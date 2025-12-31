# Netlify Deployment Guide for VERONIKA Chatbot

This guide will help you deploy the VERONIKA chatbot to Netlify with full backend functionality.

## Prerequisites

1. A GitHub account
2. A Netlify account
3. The VERONIKA chatbot codebase

## Deployment Steps

### Step 1: Push Code to GitHub

1. Create a new repository on GitHub
2. Push your VERONIKA code to this repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Select your GitHub repository
4. Configure the deployment settings:
   - Branch to deploy: `main`
   - Build command: `# no build command`
   - Publish directory: `/`

### Step 3: Set API Key (Important!)

1. In Netlify, go to your site settings
2. Navigate to "Environment variables"
3. Add a new variable:
   - Key: `OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key

4. Update your `netlify/functions/chat.js` file to use the environment variable:
   ```javascript
   const API_KEY = process.env.OPENROUTER_API_KEY || "your-fallback-api-key";
   ```

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the deployment to complete
3. Visit your new site URL

## How It Works

The deployment uses Netlify's serverless functions to handle API requests:

- **Frontend**: Static files ([index.html](file:///c%3A/Users/ankan/OneDrive/Desktop/Veronika%20Air/index.html), [script.js](file:///c%3A/Users/ankan/OneDrive/Desktop/Veronika%20Air/script.js)) are served directly by Netlify
- **Backend**: API requests to `/api/chat` are automatically redirected to Netlify Functions
- **API Proxy**: The function in `netlify/functions/chat.js` securely proxies requests to OpenRouter

## Troubleshooting

### If the chatbot isn't working:

1. Check the Netlify function logs:
   - Go to your site in Netlify
   - Navigate to "Functions" > "chat"
   - Check the logs for errors

2. Verify API key:
   - Ensure your OpenRouter API key is valid
   - Check that it's properly set in the Netlify environment variables

3. Check the browser console:
   - Open developer tools (F12)
   - Look for any JavaScript errors
   - Check network requests to `/api/chat`

### Common Issues:

1. **CORS errors**: Make sure the `netlify.toml` file is correctly configured
2. **404 errors**: Verify that the redirect rules in `netlify.toml` are correct
3. **500 errors**: Check the function logs for specific error messages

## Testing Your Deployment

After deployment, you can test your setup:

1. Visit your Netlify site
2. Open the browser's developer tools
3. Try sending a message
4. Check the Network tab to see if the API request to `/api/chat` is successful
5. Check the Console tab for any errors

## Updating Your Deployment

To update your deployed site:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update description"
   git push origin main
   ```
3. Netlify will automatically redeploy your site

## Security Notes

- Never commit API keys directly to your repository
- Always use Netlify's environment variables for sensitive data
- The current setup uses a fallback API key in the code, but you should remove this for production

## Support

If you continue to have issues, please check:
1. The Netlify function logs
2. The browser's developer console
3. Ensure all files are in the correct locations