// Netlify function to proxy AI requests
const axios = require('axios');

// API Configuration
const API_KEY = process.env.OPENROUTER_API_KEY || "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: 'Method Not Allowed',
        message: 'Only POST requests are allowed'
      })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const messages = data.messages || [];
    const model = data.model || 'openai/gpt-oss-20b:free';

    // Special handling for free models
    const is_free_model = model.includes(':free');
    const free_models_with_suffix = [
      'minimax/minimax-m2:free',
      'nvidia/nemotron-nano-9b-v2:free',
      'openai/gpt-oss-20b:free',
      'z-ai/glm-4.5-air:free',
      'mistralai/mistral-7b-instruct:free',
      'alibaba/tongyi-deepresearch-30b-a3b:free'
    ];

    const adjusted_model = free_models_with_suffix.includes(model) ? model : 
                          (is_free_model ? model.replace(':free', '') : model);

    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': event.headers.origin || '',
      'X-Title': 'VERONIKA Chatbot'
    };

    // Prepare payload with reduced temperature for consistency
    const payload = {
      'model': adjusted_model,
      'messages': messages,
      'temperature': 0.3,  // Reduced from 0.7 to 0.3 for more consistent and predictable outputs
      'max_tokens': 1000,
      'frequency_penalty': 0.0,
      'presence_penalty': 0.0,
      'top_p': 1.0,
      'stop': null
    };

    // Make the request to OpenRouter
    const response = await axios.post(API_URL, payload, { headers, timeout: 60000 });

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error in chat function:', error);

    // Handle different error types
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred. Please try again later.';

    if (error.response) {
      // API responded with error status
      statusCode = error.response.status;
      const errorData = error.response.data;
      
      if (statusCode === 429) {
        errorMessage = "Rate limit exceeded. This is normal for free accounts. Please try again tomorrow or select a different model. You can also purchase credits at https://openrouter.ai/settings/credits for higher limits.";
      } else if (statusCode === 402) {
        errorMessage = "This model requires paid credits. Please select a free model or purchase credits at https://openrouter.ai/settings/credits";
      } else if (statusCode === 404) {
        errorMessage = "The selected AI model is not available. Please try a different model.";
      } else if (statusCode >= 500) {
        errorMessage = "Server error. Please try again later or select a different AI model.";
      } else {
        errorMessage = errorData.message || errorData.error || 'API Error';
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Unable to connect to the AI service. Please check your internet connection and try again.";
    }

    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({
        error: `API Error: ${statusCode}`,
        message: errorMessage
      })
    };
  }
};