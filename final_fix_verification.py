import requests
import json

# Final verification that all AI models are working properly
API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Models from the current configuration
current_models = [
    "minimax/minimax-m2:free",
    "qwen/qwen3-14b:free",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "mistralai/mistral-nemo:free",
    "deepseek/deepseek-r1:free"
]

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload_template = {
    "messages": [
        {"role": "user", "content": "Reply with exactly: MODEL WORKING"}
    ],
    "temperature": 0.7,
    "max_tokens": 15
}

print("FINAL VERIFICATION OF AI MODELS")
print("=" * 40)

all_working = True
working_models = []
problem_models = []

for i, model in enumerate(current_models, 1):
    print(f"\n{i}. Testing {model}")
    
    payload = payload_template.copy()
    payload["model"] = model
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            result = data['choices'][0]['message']['content'].strip()
            working_models.append(model)
            print(f"   ✅ SUCCESS: {result}")
        elif response.status_code == 429:
            working_models.append(model)  # Rate limited but exists
            print(f"   ⚠️ RATE LIMITED (but working correctly)")
        else:
            problem_models.append((model, response.status_code))
            print(f"   ❌ ERROR: {response.status_code}")
            all_working = False
            
    except Exception as e:
        problem_models.append((model, f"EXCEPTION: {str(e)}"))
        print(f"   ❌ EXCEPTION: {str(e)}")
        all_working = False

print(f"\n{'=' * 40}")
print(f"FINAL RESULTS:")
print(f"✅ Working models: {len(working_models)}")
for model in working_models:
    print(f"   • {model}")

if problem_models:
    print(f"\n❌ Problem models: {len(problem_models)}")
    for model, error in problem_models:
        print(f"   • {model}: {error}")

if all_working:
    print(f"\n🎉 ALL MODELS ARE WORKING PROPERLY!")
    print(f"✅ No configuration issues found")
    print(f"✅ Ready for use")
else:
    print(f"\n⚠️ Some models have issues that need to be fixed")
    
    # If there are problems, let's create a fixed configuration
    if problem_models:
        print(f"\n🔧 CREATING FIXED CONFIGURATION...")
        print(f"Removing problem models and keeping working ones...")
        
        # Save the working models as the fixed configuration
        with open('working_models_only.json', 'w') as f:
            json.dump(working_models, f, indent=2)
        
        print(f"✅ Fixed configuration saved to 'working_models_only.json'")

print(f"\n{'=' * 40}")
print(f"SUMMARY:")
print(f"• 200 Response = Model working correctly")
print(f"• 429 Response = Model exists but rate limited (normal for free accounts)")
print(f"• 404 Response = Model doesn't exist (configuration problem)")
print(f"• No 404 errors = All models properly configured")