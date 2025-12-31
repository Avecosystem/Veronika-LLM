import requests
import json

# Test the chat endpoint to see if the AI models are working properly
API_URL = "http://127.0.0.1:8000/api/chat"

# Test payload with a working model
payload = {
    "messages": [
        {"role": "user", "content": "Say 'CHAT ENDPOINT WORKING' and nothing else"}
    ],
    "model": "minimax/minimax-m2:free"
}

headers = {
    "Content-Type": "application/json"
}

print("TESTING CHAT ENDPOINT")
print("=" * 30)

try:
    print("Sending request to local Flask server...")
    response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
    
    print(f"Response Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ SUCCESS! Chat endpoint is working")
        print(f"Response: {data}")
    else:
        print(f"❌ ERROR: {response.status_code}")
        try:
            error_data = response.json()
            print(f"Error details: {error_data}")
        except:
            print(f"Error text: {response.text}")
            
except Exception as e:
    print(f"❌ CONNECTION ERROR: {str(e)}")
    print("Make sure the Flask server is running on port 8000")

print("\nTesting direct OpenRouter API...")
# Test direct OpenRouter API
API_KEY = "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"
DIRECT_API_URL = "https://openrouter.ai/api/v1/chat/completions"

direct_payload = {
    "model": "minimax/minimax-m2:free",
    "messages": [
        {"role": "user", "content": "Say 'DIRECT API WORKING' and nothing else"}
    ],
    "temperature": 0.7,
    "max_tokens": 20
}

direct_headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

try:
    print("Sending direct request to OpenRouter...")
    direct_response = requests.post(DIRECT_API_URL, headers=direct_headers, json=direct_payload, timeout=30)
    
    print(f"Direct API Status: {direct_response.status_code}")
    
    if direct_response.status_code == 200:
        data = direct_response.json()
        result = data['choices'][0]['message']['content'].strip()
        print(f"✅ DIRECT API WORKING: {result}")
    else:
        print(f"❌ DIRECT API ERROR: {direct_response.status_code}")
        try:
            error_data = direct_response.json()
            print(f"Error details: {error_data}")
        except:
            print(f"Error text: {direct_response.text}")
            
except Exception as e:
    print(f"❌ DIRECT API CONNECTION ERROR: {str(e)}")