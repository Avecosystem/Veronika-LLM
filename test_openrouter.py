import requests
import json
import os

API_KEY = "ddc-a4f-ec0dbd1ce9f04006b7d6e9ce0701f195"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:8000",
    "X-Title": "Veronika Test"
}

data = {
    "model": "provider-8/gpt-oss-20b",
    "messages": [{"role": "user", "content": "Hello, are you working?"}],
    "max_tokens": 100
}

print(f"Testing OpenRouter API with model: {data['model']}")
try:
    response = requests.post(API_URL, headers=headers, json=data, timeout=30)
    print(f"Status Code: {response.status_code}")
    print("Response Headers:", response.headers)
    print("Response Body:", response.text)
except Exception as e:
    print(f"Error: {e}")
