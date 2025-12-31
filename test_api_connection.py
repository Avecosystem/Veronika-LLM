import requests
import json

url = "http://127.0.0.1:8000/api/chat"
headers = {"Content-Type": "application/json"}
data = {
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "provider-8/gpt-oss-20b"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
