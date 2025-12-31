import requests

# Get available models from OpenRouter
def get_models():
    url = "https://openrouter.ai/api/v1/models"
    headers = {
        "Authorization": "Bearer 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",
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            data = response.json()
            # Filter for free models
            free_models = [model for model in data['data'] if model.get('pricing', {}).get('completion', '') == '0' and model.get('pricing', {}).get('prompt', '') == '0']
            print("Available free models:")
            for model in free_models[:10]:  # Show first 10
                print(f"- {model['id']}: {model['name']}")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    get_models()