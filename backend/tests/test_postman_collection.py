#!/usr/bin/env python3
"""
BHIV HR Platform - Postman Collection Validator
Tests postman_collection.json for structure, endpoints, and data integrity
"""

import json
import re
from typing import Dict, List, Any, Tuple
from urllib.parse import urlparse

class PostmanCollectionValidator:
    def __init__(self, collection_path: str):
        self.collection_path = collection_path
        self.collection = None
        self.errors = []
        self.warnings = []
        self.stats = {
            'total_endpoints': 0,
            'gateway_endpoints': 0,
            'agent_endpoints': 0,
            'langgraph_endpoints': 0,
            'get_requests': 0,
            'post_requests': 0,
            'put_requests': 0,
            'delete_requests': 0
        }

    def load_collection(self) -> bool:
        """Load and parse the Postman collection JSON"""
        try:
            with open(self.collection_path, 'r', encoding='utf-8') as f:
                self.collection = json.load(f)
            return True
        except FileNotFoundError:
            self.errors.append(f"Collection file not found: {self.collection_path}")
            return False
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON format: {e}")
            return False

    def validate_structure(self) -> bool:
        """Validate basic Postman collection structure"""
        required_fields = ['info', 'item']
        
        for field in required_fields:
            if field not in self.collection:
                self.errors.append(f"Missing required field: {field}")
                return False

        # Validate info section
        info = self.collection['info']
        info_fields = ['name', 'description', 'version', 'schema']
        for field in info_fields:
            if field not in info:
                self.errors.append(f"Missing info field: {field}")

        # Check schema version
        if 'schema' in info and 'v2.1.0' not in info['schema']:
            self.warnings.append("Collection schema is not v2.1.0")

        return len(self.errors) == 0

    def validate_variables(self) -> bool:
        """Validate collection variables"""
        if 'variable' not in self.collection:
            self.warnings.append("No variables defined in collection")
            return True

        variables = self.collection['variable']
        expected_vars = ['gw', 'ag', 'lg', 'api_key_secret']
        
        for var in variables:
            if 'key' not in var or 'value' not in var:
                self.errors.append(f"Invalid variable structure: {var}")
                continue
                
            if var['key'] in expected_vars:
                expected_vars.remove(var['key'])

        if expected_vars:
            self.warnings.append(f"Missing expected variables: {expected_vars}")

        return True

    def validate_auth(self) -> bool:
        """Validate authentication configuration"""
        if 'auth' not in self.collection:
            self.warnings.append("No collection-level auth defined")
            return True

        auth = self.collection['auth']
        if auth.get('type') != 'bearer':
            self.warnings.append("Collection auth is not bearer token")

        return True

    def validate_endpoints(self) -> bool:
        """Validate all endpoints in the collection"""
        if 'item' not in self.collection:
            self.errors.append("No items found in collection")
            return False

        self._validate_items(self.collection['item'])
        return True

    def _validate_items(self, items: List[Dict], parent_name: str = ""):
        """Recursively validate collection items"""
        for item in items:
            if 'name' not in item:
                self.errors.append(f"Item missing name in {parent_name}")
                continue

            item_name = item['name']
            
            if 'item' in item:  # Folder
                self._validate_items(item['item'], item_name)
            elif 'request' in item:  # Request
                self._validate_request(item['request'], item_name)
                self.stats['total_endpoints'] += 1
                
                # Count by service
                if 'GW-' in item_name or parent_name.startswith('GW-'):
                    self.stats['gateway_endpoints'] += 1
                elif 'Agent-' in item_name or parent_name.startswith('Agent-'):
                    self.stats['agent_endpoints'] += 1
                elif 'LangGraph-' in item_name or parent_name.startswith('LangGraph-'):
                    self.stats['langgraph_endpoints'] += 1

    def _validate_request(self, request: Dict, item_name: str):
        """Validate individual request structure"""
        # Validate method
        if 'method' not in request:
            self.errors.append(f"Missing method in {item_name}")
            return

        method = request['method'].upper()
        if method not in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
            self.errors.append(f"Invalid method '{method}' in {item_name}")
        else:
            self.stats[f'{method.lower()}_requests'] += 1

        # Validate URL
        if 'url' not in request:
            self.errors.append(f"Missing URL in {item_name}")
            return

        url = request['url']
        if isinstance(url, str):
            self._validate_url(url, item_name)
        elif isinstance(url, dict) and 'raw' in url:
            self._validate_url(url['raw'], item_name)

        # Validate body for POST/PUT requests
        if method in ['POST', 'PUT'] and 'body' in request:
            self._validate_body(request['body'], item_name)

    def _validate_url(self, url: str, item_name: str):
        """Validate URL format and variables"""
        # Check for variable usage
        variables = re.findall(r'\{\{(\w+)\}\}', url)
        expected_vars = ['gw', 'ag', 'lg']
        
        for var in variables:
            if var not in expected_vars and var != 'api_key_secret':
                self.warnings.append(f"Unknown variable '{var}' in {item_name}")

        # Basic URL validation
        if not url.startswith(('http://', 'https://', '{{')):
            self.errors.append(f"Invalid URL format in {item_name}: {url}")

    def _validate_body(self, body: Dict, item_name: str):
        """Validate request body"""
        if 'mode' not in body:
            self.errors.append(f"Missing body mode in {item_name}")
            return

        if body['mode'] == 'raw' and 'raw' in body:
            try:
                json.loads(body['raw'])
            except json.JSONDecodeError:
                self.errors.append(f"Invalid JSON in body for {item_name}")

    def validate_endpoint_counts(self) -> bool:
        """Validate expected endpoint counts"""
        expected_total = 119
        expected_gateway = 88
        expected_agent = 6
        expected_langgraph = 25

        if self.stats['total_endpoints'] != expected_total:
            self.errors.append(
                f"Expected {expected_total} total endpoints, found {self.stats['total_endpoints']}"
            )

        if self.stats['gateway_endpoints'] != expected_gateway:
            self.warnings.append(
                f"Expected {expected_gateway} gateway endpoints, found {self.stats['gateway_endpoints']}"
            )

        if self.stats['agent_endpoints'] != expected_agent:
            self.warnings.append(
                f"Expected {expected_agent} agent endpoints, found {self.stats['agent_endpoints']}"
            )

        if self.stats['langgraph_endpoints'] != expected_langgraph:
            self.warnings.append(
                f"Expected {expected_langgraph} langgraph endpoints, found {self.stats['langgraph_endpoints']}"
            )

        return True

    def validate_security_endpoints(self) -> bool:
        """Validate security-related endpoints"""
        security_patterns = [
            r'/auth/',
            r'/2fa/',
            r'/security/',
            r'/password/',
            r'/csp-'
        ]
        
        security_count = 0
        items = self._flatten_items(self.collection['item'])
        
        for item in items:
            if 'request' in item and 'url' in item['request']:
                url = item['request']['url']
                if isinstance(url, dict):
                    url = url.get('raw', '')
                
                for pattern in security_patterns:
                    if re.search(pattern, url):
                        security_count += 1
                        break

        if security_count < 20:
            self.warnings.append(f"Only {security_count} security endpoints found, expected more")

        return True

    def _flatten_items(self, items: List[Dict]) -> List[Dict]:
        """Flatten nested items structure"""
        flattened = []
        for item in items:
            if 'item' in item:
                flattened.extend(self._flatten_items(item['item']))
            else:
                flattened.append(item)
        return flattened

    def run_validation(self) -> Tuple[bool, Dict]:
        """Run complete validation suite"""
        print("Starting Postman Collection Validation...")
        
        if not self.load_collection():
            return False, self._get_results()

        validation_steps = [
            ("Structure", self.validate_structure),
            ("Variables", self.validate_variables),
            ("Authentication", self.validate_auth),
            ("Endpoints", self.validate_endpoints),
            ("Endpoint Counts", self.validate_endpoint_counts),
            ("Security Endpoints", self.validate_security_endpoints)
        ]

        for step_name, step_func in validation_steps:
            print(f"  - Validating {step_name}...")
            step_func()

        return len(self.errors) == 0, self._get_results()

    def _get_results(self) -> Dict:
        """Get validation results"""
        return {
            'success': len(self.errors) == 0,
            'errors': self.errors,
            'warnings': self.warnings,
            'stats': self.stats,
            'collection_info': self.collection.get('info', {}) if self.collection else {}
        }

def print_results(results: Dict):
    """Print validation results"""
    print("\n" + "="*60)
    print("POSTMAN COLLECTION VALIDATION RESULTS")
    print("="*60)
    
    # Collection Info
    info = results['collection_info']
    if info:
        print(f"Collection: {info.get('name', 'Unknown')}")
        print(f"Description: {info.get('description', 'No description')}")
        print(f"Version: {info.get('version', 'Unknown')}")
    
    # Statistics
    stats = results['stats']
    print(f"\nENDPOINT STATISTICS:")
    print(f"  Total Endpoints: {stats['total_endpoints']}")
    print(f"  Gateway: {stats['gateway_endpoints']}")
    print(f"  Agent: {stats['agent_endpoints']}")
    print(f"  LangGraph: {stats['langgraph_endpoints']}")
    print(f"  GET: {stats['get_requests']}")
    print(f"  POST: {stats['post_requests']}")
    print(f"  PUT: {stats['put_requests']}")
    
    # Errors
    if results['errors']:
        print(f"\nERRORS ({len(results['errors'])}):")
        for error in results['errors']:
            print(f"  - {error}")
    else:
        print(f"\nNO ERRORS FOUND")
    
    # Warnings
    if results['warnings']:
        print(f"\nWARNINGS ({len(results['warnings'])}):")
        for warning in results['warnings']:
            print(f"  - {warning}")
    else:
        print(f"\nNO WARNINGS")
    
    # Overall Status
    status = "PASSED" if results['success'] else "FAILED"
    print(f"\nVALIDATION STATUS: {status}")
    print("="*60)

def main():
    """Main execution function"""
    collection_path = r"c:\BHIV HR PLATFORM\handover\postman_collection.json"
    
    validator = PostmanCollectionValidator(collection_path)
    success, results = validator.run_validation()
    
    print_results(results)
    
    # Generate summary report
    if success:
        print("\nCollection is valid and ready for use!")
        print("You can import this collection into Postman for API testing")
    else:
        print("\nPlease fix the errors before using the collection")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())