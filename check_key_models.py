import requests
import json

API_KEY = "ddc-a4f-ec0dbd1ce9f04006b7d6e9ce0701f195"
API_URL = "https://openrouter.ai/api/v1/models"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

print("Checking API key validity...")
try:
    response = requests.get(API_URL, headers=headers, timeout=30)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("API Key is valid.")
        models = response.json()['data']
        found = False
        for m in models:
            if m['id'] == 'provider-8/gpt-oss-20b':
                found = True
                print("Model 'provider-8/gpt-oss-20b' found in list.")
                break
        if not found:
            print("Model 'provider-8/gpt-oss-20b' NOT found in list.")
            # Print first 5 models to see what's available
            print("First 5 available models:")
            for m in models[:5]:
                print(f"- {m['id']}")
    else:
        print("API Key might be invalid or other error.")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
