import requests
import json
import time

# Test the Flask server
def test_flask_server():
    url = "http://localhost:8000/api/chat"
    
    payload = {
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ],
        "model": "openai/gpt-oss-20b:free"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("Testing Flask server at:", url)
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=30)
        print("Status Code:", response.status_code)
        print("Response:", response.json())
        print("Flask server test completed successfully!")
    except Exception as e:
        print("Error testing Flask server:", str(e))

if __name__ == "__main__":
    test_flask_server()