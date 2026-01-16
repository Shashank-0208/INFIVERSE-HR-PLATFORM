import requests
import json

api_key = 'prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o'
headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}

failing_endpoints = [
    {'name': 'Batch Match', 'method': 'POST', 'url': 'http://localhost:8000/v1/match/batch', 'body': [1, 2]},
    {'name': 'Bulk Notifications', 'method': 'POST', 'url': 'http://localhost:9001/automation/bulk-notifications?sequence_type=application_received', 'body': {'candidates': [{'candidate_name': 'Test User', 'candidate_email': 'test@test.com', 'candidate_phone': '+1234567890'}], 'job_data': {'job_title': 'Test Engineer', 'job_id': 1}}}
]

for endpoint in failing_endpoints:
    try:
        response = requests.request(endpoint['method'], endpoint['url'], headers=headers, json=endpoint['body'], timeout=10)
        print(f"{endpoint['name']}: {response.status_code} - {'PASS' if response.status_code < 400 else 'FAIL'}")
        if response.status_code >= 400:
            print(f"  Error: {response.text[:100]}")
    except Exception as e:
        print(f"{endpoint['name']}: ERROR - {str(e)}")