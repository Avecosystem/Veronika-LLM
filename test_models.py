import requests

# Test script for AI models
API_KEY = "YOUR_API_KEY_HERE"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

models_to_test = [
    "openai/gpt-oss-20b:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "minimax/minimax-m2:free"
]

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def test_model(model_name):
    try:
        data = {
            "model": model_name,
            "messages": [
                {"role": "user", "content": "Hello"}
            ]
        }
        
        response = requests.post(API_URL, headers=headers, json=data, timeout=10)
        return response.status_code == 200
    except:
        return False

# Test models
working_models = []
for model in models_to_test:
    if test_model(model):
        working_models.append(model)
        print(f"Working: {model}")

print(f"Working models: {working_models}")