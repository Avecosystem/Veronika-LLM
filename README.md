# VERONIKA Air - AI Chatbot

VERONIKA is an AI chatbot with a neon-themed UI featuring:
- Rainbow-colored title animation
- Interactive message interface with edit/copy/resend actions
- Support for multiple AI models via OpenRouter
- Fully responsive design for mobile/desktop

## 🚀 EASY DEPLOYMENT OPTIONS

### ✅ NETLIFY (RECOMMENDED - FULL FUNCTIONALITY)
1. Push code to GitHub repository
2. Connect repository to Netlify
3. Set build settings:
   - Build command: `# no build command`
   - Publish directory: `/`
4. Deploy - AI works immediately!

Netlify automatically handles the backend connectivity through Netlify Functions. The `netlify.toml` configuration file ensures that API requests to `/api/chat` are properly redirected to the serverless function that proxies requests to OpenRouter.

### ✅ LOCAL DEVELOPMENT
1. Install dependencies: `pip install -r requirements.txt`
2. Start server: `python server.py`
3. Access at: `http://localhost:8000`

### ❌ GITHUB PAGES LIMITATION
GitHub Pages does not support backend servers, so AI functionality won't work there.
Use Netlify instead for full functionality.

## How It Works

- **Frontend**: [index.html](file:///c%3A/Users/ankan/OneDrive/Desktop/Veronika%20Air/index.html), [script.js](file:///c%3A/Users/ankan/OneDrive/Desktop/Veronika%20Air/script.js), [style.css](file:///c%3A/Users/ankan/OneDrive/Desktop/Veronika%20Air/style.css) are served statically
- **Backend**: API requests are handled by Netlify Functions in the `netlify/functions` directory
- **API Endpoint**: The chat API is available at `/api/chat` (automatically redirected)

The frontend makes API calls to `/api/chat` which works in both local development (handled by Flask) and Netlify deployment (handled by Netlify Functions) through proper configuration.

## Troubleshooting

### If the AI models are not working:

1. **Rate Limits**: Free OpenRouter accounts have daily usage limits. If you see "Rate limit exceeded" errors, this is normal and indicates the models are properly configured.

2. **API Key**: Make sure the API key in both `server.py` and `netlify/functions/chat.js` is valid.

3. **Model Availability**: Some models may require paid credits. Check the OpenRouter dashboard for model availability.

### Connection Issues:

1. **Local Development**: Always run the Flask server and access via `http://localhost:8000`, not by opening index.html directly.

2. **Netlify Deployment**: Ensure the Netlify Functions are properly configured in `netlify.toml`.

## Supported Models

The chatbot supports multiple free AI models from OpenRouter:
- `openai/gpt-oss-20b:free` - Default model
- `minimax/minimax-m2:free` - MiniMax M2
- `nvidia/nemotron-nano-9b-v2:free` - NVIDIA Nemotron Nano 9B V2
- `z-ai/glm-4.5-air:free` - Z.AI GLM 4.5 Air
- `nousresearch/hermes-3-llama-3.1-405b:free` - Nous Hermes 3 Llama 3.1 405B
- `meituan/longcat-flash-chat:free` - Meituan LongCat Flash Chat

## Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- JavaScript (ES6+)
- Python Flask (for local development)
- Netlify Functions (for production deployment)
- OpenRouter API

## License

MIT License