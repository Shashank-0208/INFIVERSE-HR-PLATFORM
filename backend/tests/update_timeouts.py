import json

# Read the postman collection
with open(r'c:\BHIV HR PLATFORM\handover\postman_collection.json', 'r') as f:
    data = json.load(f)

# Timeout mappings based on endpoint analysis
timeout_mappings = {
    # Fast operations (3-5s)
    'Root': 3000, 'Health': 3000, 'OpenAPI': 5000, 'Docs': 5000,
    'List': 5000, 'Get': 5000, 'Stats': 5000, 'Status': 5000,
    
    # Database operations (5-8s)
    'Create Job': 8000, 'Update Profile': 8000, 'Apply for Job': 8000,
    'Schedule Interview': 8000, 'Create Offer': 8000, 'Submit Feedback': 8000,
    'Search Candidates': 8000, 'Bulk Upload': 15000,
    
    # Authentication (8-10s)
    'Login': 10000, 'Register': 10000, 'Setup 2FA': 10000,
    'Verify 2FA': 8000, 'Change Password': 8000, 'Validate Password': 8000,
    
    # AI/ML Operations (20-60s)
    'Top Matches': 30000, 'Batch Match': 45000, 'Agent Match': 30000,
    'Agent Batch Match': 45000, 'Agent Analyze': 25000,
    'RL Predict': 20000, 'RL Retrain': 60000,
    
    # Workflow Operations (15-45s)
    'Start Workflow': 45000, 'Trigger Workflow': 45000,
    'Automated Sequence': 30000, 'Bulk Notifications': 30000,
    
    # Communication (10-15s)
    'Send Notification': 15000, 'Test Email': 10000,
    'Test WhatsApp': 10000, 'Test Telegram': 10000,
    'WhatsApp Buttons': 10000, 'WhatsApp Webhook': 10000,
    
    # Default
    'default': 10000
}

def get_timeout_for_name(name):
    """Get timeout based on endpoint name"""
    for key, timeout in timeout_mappings.items():
        if key.lower() in name.lower():
            return timeout
    return timeout_mappings['default']

def add_timeout_to_item(item):
    """Add timeout event to a request item"""
    if 'request' in item:
        timeout = get_timeout_for_name(item['name'])
        
        # Remove existing timeout events
        if 'event' in item:
            item['event'] = [e for e in item['event'] if 'timeout' not in str(e)]
        else:
            item['event'] = []
        
        # Add new timeout event
        item['event'].append({
            "listen": "prerequest",
            "script": {
                "type": "text/javascript",
                "exec": [f"pm.request.timeout = {timeout}; // {timeout/1000}s timeout"]
            }
        })

def process_items_recursive(items):
    """Process all items recursively"""
    for item in items:
        if 'item' in item:  # It's a folder
            process_items_recursive(item['item'])
        else:  # It's a request
            add_timeout_to_item(item)

# Process the collection
process_items_recursive(data['item'])

# Write back
with open(r'c:\BHIV HR PLATFORM\handover\postman_collection.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated Postman collection with adaptive timeouts for all 119 endpoints")
print("Timeout ranges:")
print("- Fast operations: 3-5s")
print("- Database operations: 5-15s") 
print("- Authentication: 8-10s")
print("- AI/ML operations: 20-60s")
print("- Workflow operations: 15-45s")
print("- Communication: 10-15s")