#!/usr/bin/env python3
"""
Count endpoints in the complete fixed Postman collection
"""

import json

def count_endpoints_in_collection(file_path):
    """Count endpoints in collection"""
    with open(file_path, 'r', encoding='utf-8') as f:
        collection = json.load(f)
    
    total = 0
    breakdown = {}
    
    def count_items(items):
        nonlocal total
        count = 0
        for item in items:
            if 'item' in item:  # Folder
                folder_count = count_items(item['item'])
                breakdown[item['name']] = folder_count
                count += folder_count
            elif 'request' in item:  # Request
                count += 1
                total += 1
        return count
    
    if 'item' in collection:
        count_items(collection['item'])
    
    return total, breakdown

def main():
    file_path = r"c:\BHIV HR PLATFORM\postman_collection_complete_fixed.json"
    
    total, breakdown = count_endpoints_in_collection(file_path)
    
    print("COMPLETE FIXED COLLECTION ENDPOINT COUNT:")
    print("=" * 50)
    print(f"Total endpoints: {total}")
    print()
    
    # Count by service
    gateway_count = 0
    agent_count = 0
    langgraph_count = 0
    
    for folder_name, count in breakdown.items():
        print(f"{folder_name}: {count} endpoints")
        
        if folder_name.startswith('GW-'):
            gateway_count += count
        elif folder_name.startswith('Agent-'):
            agent_count += count
        elif folder_name.startswith('LangGraph-'):
            langgraph_count += count
    
    print()
    print("SERVICE BREAKDOWN:")
    print("=" * 50)
    print(f"Gateway: {gateway_count} endpoints")
    print(f"Agent: {agent_count} endpoints") 
    print(f"LangGraph: {langgraph_count} endpoints")
    print(f"Total: {gateway_count + agent_count + langgraph_count} endpoints")
    
    print()
    print("TARGET vs ACTUAL:")
    print("=" * 50)
    print(f"Target Gateway: 88, Actual: {gateway_count}, Diff: {88 - gateway_count}")
    print(f"Target Agent: 6, Actual: {agent_count}, Diff: {6 - agent_count}")
    print(f"Target LangGraph: 25, Actual: {langgraph_count}, Diff: {25 - langgraph_count}")
    print(f"Target Total: 119, Actual: {total}, Diff: {119 - total}")
    
    if total == 119:
        print("\n✅ SUCCESS: Collection has exactly 119 endpoints!")
    else:
        print(f"\n❌ MISSING: Need {119 - total} more endpoints to reach 119")

if __name__ == "__main__":
    main()