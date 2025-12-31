from flask import Flask, render_template, send_from_directory, request, jsonify
import os
import requests
import json
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# API Configuration
import os
API_KEY = os.environ.get('OPENROUTER_API_KEY') or "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.route('/')
def index():
    logger.info("Serving index.html")
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    logger.info(f"Serving static file: {filename}")
    return send_from_directory('.', filename)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        logger.info("Received API request")
        # Get the data from the request
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        if not data:
            logger.error("No JSON data provided")
            return jsonify({
                'error': 'Bad Request',
                'message': 'No JSON data provided'
            }), 400
        
        # Extract messages and model from the request
        messages = data.get('messages', [])
        model = data.get('model', 'provider-8/gpt-oss-20b')  # Updated default model
        logger.info(f"Messages: {messages}")
        logger.info(f"Model: {model}")
        
        # Special handling for free models
        # Only keeping the current model in logic
        adjusted_model = model
        logger.info(f"Adjusted model: {adjusted_model}")
        
        # Prepare headers
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': request.headers.get('Origin', ''),
            'X-Title': 'VERONIKA Chatbot'
        }
        
        # Prepare payload with reduced temperature for consistency and increased token limits
        payload = {
            'model': adjusted_model,
            'messages': messages,
            'temperature': 0.3,  # Reduced from 0.7 to 0.3 for more consistent and predictable outputs
            'max_tokens': 1000,  # Increased token limit for more complete responses
            'frequency_penalty': 0.0,
            'presence_penalty': 0.0,
            'top_p': 1.0,
            'stop': None
        }
        logger.info(f"Payload: {payload}")
        
        # Make the request to OpenRouter
        logger.info("Making request to OpenRouter")
        try:
            response = requests.post(
                API_URL,
                headers=headers,
                json=payload,
                timeout=120  # Increased timeout to 120 seconds
            )
            logger.info(f"OpenRouter response status: {response.status_code}")
            logger.info(f"OpenRouter response headers: {response.headers}")
            
            # Check if request was successful
            if response.status_code == 200:
                response_data = response.json()
                logger.info("Successful response from OpenRouter")
                return jsonify(response_data)
            else:
                # Parse error response
                try:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', response.text)
                except:
                    error_message = response.text
                    
                logger.info(f"Error from OpenRouter: {error_message}")
                
                # Provide more user-friendly error messages
                user_friendly_message = f"API Error ({response.status_code}): {error_message}"
                if response.status_code == 429:
                    user_friendly_message = "Rate limit exceeded. Please try again later."
                elif response.status_code == 401:
                    user_friendly_message = "Invalid API Key. Please check your configuration."
                elif response.status_code == 408:
                    user_friendly_message = "Request timed out from AI provider."
                
                return jsonify({
                    'error': f'API Error: {response.status_code}',
                    'message': user_friendly_message
                }), response.status_code

        except requests.exceptions.Timeout:
            logger.error("Request to OpenRouter timed out")
            return jsonify({
                'error': 'Timeout',
                'message': 'The AI provider took too long to respond. Please try again later.'
            }), 504
        except requests.exceptions.RequestException as e:
            logger.error(f"Request exception: {str(e)}")
            return jsonify({
                'error': 'Connection Error',
                'message': f'Failed to connect to AI provider: {str(e)}'
            }), 502
            
    except Exception as e:
        logger.error(f"Exception in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Server Error',
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)