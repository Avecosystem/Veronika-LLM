// Test script for Netlify function
const fs = require('fs');
const path = require('path');

// Mock event for testing
const mockEvent = {
  httpMethod: 'POST',
  headers: {
    origin: 'http://localhost:8888'
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: "Hello, how are you?" }
    ],
    model: "openai/gpt-oss-20b:free"
  })
};

// Mock context
const mockContext = {};

// Import the Netlify function
const chatFunction = require('./netlify/functions/chat.js');

// Test the function
async function testFunction() {
  try {
    console.log('Testing Netlify function...');
    const result = await chatFunction.handler(mockEvent, mockContext);
    console.log('Function executed successfully!');
    console.log('Status code:', result.statusCode);
    console.log('Response headers:', result.headers);
    
    if (result.body) {
      const body = JSON.parse(result.body);
      console.log('Response body:', JSON.stringify(body, null, 2));
    }
  } catch (error) {
    console.error('Error testing function:', error);
  }
}

testFunction();