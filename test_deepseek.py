import requests
import json

# Test the DeepSeek model
def test_model():
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "VERONIKA Chatbot"
    }
    
    payload = {
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [
            {"role": "user", "content": "Hello, this is a test message. Please respond with exactly 'Test successful' if you receive this."}
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("Response:")
            print(data['choices'][0]['message']['content'])
            print("Model test successful!")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_model()