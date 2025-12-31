// API Configuration - Use consistent endpoint that works in all environments
// Netlify redirects /api/chat to /.netlify/functions/chat
// Local development uses /api/chat which is handled by Flask
const API_URL = "/api/chat";

// DOM Elements
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const micBtn = document.getElementById('micBtn');
const sendBtn = document.getElementById('sendBtn');
const modelSelectorBtn = document.getElementById('modelSelectorBtn');
const modelDropdownContainer = document.getElementById('modelDropdownContainer');
const modelOptions = document.querySelectorAll('.model-option');
const selectedModelText = document.getElementById('selectedModelText');
const newChatBtn = document.getElementById('newChatBtn');
const promptButtons = document.querySelectorAll('.prompt-button');
const welcomeSection = document.querySelector('.welcome-section');
const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');

// Store conversation history
let conversationHistory = [];
let lastUserMessage = "";
let isRecording = false;
let voicesLoaded = false;

// Speech recognition
let recognition;

// Current selected model - now set to OpenAI GPT-OSS 20B as default
let currentModel = 'openai/gpt-oss-20b:free';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (messageInput) {
        messageInput.addEventListener('input', updateSendButton);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && messageInput.value.trim()) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Add model change listener
    if (modelSelectorBtn) {
        modelSelectorBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (modelDropdownContainer) {
                modelDropdownContainer.classList.toggle('hidden');
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (modelSelectorBtn && modelDropdownContainer && 
            !modelSelectorBtn.contains(event.target) && !modelDropdownContainer.contains(event.target)) {
            modelDropdownContainer.classList.add('hidden');
        }
    });
    
    // Model selection
    if (modelOptions) {
        modelOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Update selected model
                currentModel = this.getAttribute('data-model');
                
                // Update UI
                modelOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Update button text
                if (selectedModelText) {
                    selectedModelText.textContent = this.textContent.split(' (')[0];
                }
                
                // Close dropdown
                if (modelDropdownContainer) {
                    modelDropdownContainer.classList.add('hidden');
                }
            });
        });
    }
    
    // Set the default model in the UI
    setTimeout(() => {
        if (modelOptions) {
            // Find the default model option and select it
            const defaultOption = Array.from(modelOptions).find(option => 
                option.getAttribute('data-model') === 'provider-8/gpt-oss-20b');
            
            if (defaultOption) {
                // Remove selected class from all options
                modelOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to default option
                defaultOption.classList.add('selected');
                // Update the button text
                if (selectedModelText) {
                    selectedModelText.textContent = defaultOption.textContent.split(' (')[0];
                }
            }
        }
    }, 100);
    
    if (micBtn) micBtn.addEventListener('click', toggleVoiceInput);
    
    // Set up menu item event listeners with error checking
    if (newChatBtn) newChatBtn.addEventListener('click', handleNewChat);
    
    // Set up three dots menu
    if (menuButton) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (menuDropdown) {
                menuDropdown.classList.toggle('hidden');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (menuButton && menuDropdown && 
            !menuButton.contains(event.target) && !menuDropdown.contains(event.target)) {
            menuDropdown.classList.add('hidden');
        }
    });
    
    // Add event listeners for prompt buttons
    if (promptButtons) {
        promptButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prompt = this.getAttribute('data-prompt');
                if (messageInput) messageInput.value = prompt;
                sendMessage();
            });
        });
    }
    
    // Load voices
    if ('speechSynthesis' in window) {
        // Chrome loads voices asynchronously
        speechSynthesis.onvoiceschanged = function() {
            voicesLoaded = true;
        };
        
        // Try to trigger voice loading
        speechSynthesis.getVoices();
    }
    
    // Initialize speech recognition with better error handling
    initSpeechRecognition();
    
    // Don't show initial welcome message - removed as requested
    
    // Ensure input is focused on load
    setTimeout(() => {
        if (messageInput) messageInput.focus();
    }, 500);
});

// Toggle voice input
function toggleVoiceInput() {
    if (isRecording) {
        stopVoiceInput();
    } else {
        startVoiceInput();
    }
}

// Initialize speech recognition with comprehensive error handling
function initSpeechRecognition() {
    try {
        // Check for speech recognition support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.log('Speech recognition not supported');
            if (micBtn) {
                micBtn.title = "Voice input not supported in this browser";
                micBtn.classList.add('disabled');
            }
            return;
        }
        
        // Initialize recognition
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        
        // Event handlers
        recognition.onstart = () => {
            isRecording = true;
            if (micBtn) micBtn.classList.add('recording');
            console.log('Speech recognition started');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Recognized speech:', transcript);
            if (messageInput) messageInput.value = transcript;
            stopVoiceInput();
            updateSendButton(); // Enable send button
            // Auto-send the message
            setTimeout(() => {
                sendMessage();
            }, 1000);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            stopVoiceInput();
        };
        
        recognition.onend = () => {
            console.log('Speech recognition ended');
            stopVoiceInput();
        };
        
        console.log('Speech recognition initialized successfully');
    } catch (error) {
        console.error('Error initializing speech recognition:', error);
        if (micBtn) {
            micBtn.title = "Voice input initialization failed";
            micBtn.classList.add('disabled');
        }
    }
}

// Start voice input
function startVoiceInput() {
    if (!recognition) {
        return;
    }
    
    try {
        console.log('Starting voice input');
        recognition.start();
    } catch (error) {
        console.error('Error starting voice input:', error);
    }
}

// Stop voice input
function stopVoiceInput() {
    console.log('Stopping voice input');
    isRecording = false;
    if (micBtn) micBtn.classList.remove('recording');
    // Note: We don't stop recognition here as it stops automatically after recognition
}

// Update send button state based on input
function updateSendButton() {
    if (sendBtn && messageInput) {
        if (messageInput.value.trim()) {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    }
}

// Send message function
async function sendMessage() {
    if (!messageInput) return;
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Store the last message for edit/resend functionality
    lastUserMessage = message;
    
    // Hide welcome section
    if (welcomeSection) {
        welcomeSection.style.display = 'none';
    }
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input and update send button
    messageInput.value = '';
    updateSendButton();
    
    // Add loading indicator
    const loadingElement = addBotMessage("-thinking...", true);
    
    try {
        // Prepare messages for API (include conversation history)
        const messages = [...conversationHistory];
        
        // Add a system message to encourage complete responses
        const systemMessage = {
            role: "system",
            content: "Please provide complete, well-organized, and comprehensive answers without cutting off in the middle. Give full explanations with proper formatting and organization."
        };
        
        // Insert system message at the beginning if it's not already there
        const completeMessages = [systemMessage, ...messages];
        
        // Call backend API with improved error handling
        const response = await callBackendAPI(completeMessages, currentModel);
        
        // Remove loading indicator
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
        
        // Add bot response to chat
        addBotMessage(response);
        
        // Speak the response
        speakResponse(response);
    } catch (error) {
        console.error('Error:', error);
        // Remove loading indicator
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
        
        // Show user-friendly error message with deployment instructions
        let errorMessage = "❌ Sorry, I encountered an error. ";
        
        if (error.message.includes('Failed to fetch') || error.message.includes('TypeError')) {
            errorMessage += "Unable to connect to the server. Please make sure the server is running and you're accessing the application through http://localhost:8000";
        } else if (error.message.includes('GitHub Pages')) {
            errorMessage += "GitHub Pages doesn't support backend servers. Please:\n\n" +
                           "1. Deploy to Netlify (recommended)\n" +
                           "2. Run locally with Flask server\n\n" +
                           "For Netlify deployment:\n" +
                           "- Push code to GitHub repository\n" +
                           "- Connect repository to Netlify\n" +
                           "- Netlify will automatically handle the backend\n\n" +
                           "For local development:\n" +
                           "- Run: python server.py\n" +
                           "- Access: http://localhost:8000";
        } else if (error.message.includes('direct file access')) {
            errorMessage += "Direct file access doesn't work. Please:\n\n" +
                           "Run locally with Flask server:\n" +
                           "- Run: python server.py\n" +
                           "- Access: http://localhost:8000\n\n" +
                           "Or deploy to Netlify for online access.";
        } else if (error.message.includes('401')) {
            errorMessage += "API authentication failed. Please check your API key.";
        } else if (error.message.includes('402')) {
            errorMessage += "This model requires paid credits. Please select a free model or purchase credits at https://openrouter.ai/settings/credits";
        } else if (error.message.includes('404')) {
            errorMessage += "The selected AI model is not available. Please try a different model.";
        } else if (error.message.includes('429')) {
            errorMessage += "Rate limit exceeded. This is normal for free accounts. Please try again tomorrow or select a different model. You can also purchase credits at https://openrouter.ai/settings/credits for higher limits.";
        } else if (error.message.includes('network')) {
            errorMessage += "Network connection error. Please check your internet connection.";
        } else if (error.message.includes('timeout')) {
            errorMessage += "Request timed out. The server might be busy. Please try again.";
        } else if (error.message.includes('quota')) {
            errorMessage += "API quota exceeded. Please try a different model or try again later.";
        } else {
            errorMessage += "Please try again or select a different AI model. If the problem persists, try refreshing the page.";
        }
        
        addBotMessage(errorMessage);
    }
}

// Add user message to chat with actions
function addUserMessage(content) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Create user message box
    const userMessageBox = document.createElement('div');
    userMessageBox.className = 'user-message-box';
    userMessageBox.innerHTML = `<p>${content}</p>`;
    
    // Create action buttons container
    const messageActions = document.createElement('div');
    messageActions.className = 'message-actions';
    
    // Add action buttons for user message
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn';
    copyBtn.innerHTML = '<span class="material-symbols-outlined text-xs">content_copy</span> Copy';
    copyBtn.addEventListener('click', function() {
        copyMessage(content, copyBtn);
    });
    
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn';
    editBtn.innerHTML = '<span class="material-symbols-outlined text-xs">edit</span> Edit';
    editBtn.addEventListener('click', function() {
        editMessage(content, messageContent);
    });
    
    messageActions.appendChild(copyBtn);
    messageActions.appendChild(editBtn);
    
    messageContent.appendChild(userMessageBox);
    messageContent.appendChild(messageActions);
    messageElement.appendChild(messageContent);
    
    if (messagesArea) messagesArea.appendChild(messageElement);
    scrollToBottom();
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: content
    });
}

// Add bot message to chat with actions
function addBotMessage(content, isLoading = false) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (isLoading) {
        const loadingContent = document.createElement('div');
        loadingContent.className = 'bot-message-content';
        loadingContent.innerHTML = `<p><span class="loading"></span> ${content}</p>`;
        messageContent.appendChild(loadingContent);
    } else {
        // Create bot message content (normal text format, not in a box)
        const botMessageContent = document.createElement('div');
        botMessageContent.className = 'bot-message-content';
        botMessageContent.innerHTML = `<p>${content}</p>`;
        
        // Create action buttons container
        const messageActions = document.createElement('div');
        messageActions.className = 'message-actions';
        
        // Add action buttons for bot message
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn';
        copyBtn.innerHTML = '<span class="material-symbols-outlined text-xs">content_copy</span> Copy';
        copyBtn.addEventListener('click', function() {
            copyMessage(content, copyBtn);
        });
        
        const likeBtn = document.createElement('button');
        likeBtn.className = 'action-btn';
        likeBtn.innerHTML = '<span class="material-symbols-outlined text-xs">thumb_up</span> Like';
        likeBtn.addEventListener('click', function() {
            likeMessage(content, likeBtn);
        });
        
        const badBtn = document.createElement('button');
        badBtn.className = 'action-btn';
        badBtn.innerHTML = '<span class="material-symbols-outlined text-xs">thumb_down</span> Bad';
        badBtn.addEventListener('click', function() {
            badMessage(content, badBtn);
        });
        
        const shareBtn = document.createElement('button');
        shareBtn.className = 'action-btn';
        shareBtn.innerHTML = '<span class="material-symbols-outlined text-xs">share</span> Share';
        shareBtn.addEventListener('click', function() {
            shareMessage(content);
        });
        
        const retryBtn = document.createElement('button');
        retryBtn.className = 'action-btn';
        retryBtn.innerHTML = '<span class="material-symbols-outlined text-xs">refresh</span> Try again';
        retryBtn.addEventListener('click', function() {
            retryMessage(content);
        });
        
        const readAloudBtn = document.createElement('button');
        readAloudBtn.className = 'action-btn';
        readAloudBtn.innerHTML = '<span class="material-symbols-outlined text-xs">volume_up</span> Read aloud';
        readAloudBtn.addEventListener('click', function() {
            speakResponse(content);
        });
        
        messageActions.appendChild(copyBtn);
        messageActions.appendChild(likeBtn);
        messageActions.appendChild(badBtn);
        messageActions.appendChild(shareBtn);
        messageActions.appendChild(retryBtn);
        messageActions.appendChild(readAloudBtn);
        
        messageContent.appendChild(botMessageContent);
        messageContent.appendChild(messageActions);
        
        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: content
        });
    }
    
    messageElement.appendChild(messageContent);
    
    if (messagesArea) messagesArea.appendChild(messageElement);
    scrollToBottom();
    return messageElement;
}

// Call backend API with enhanced error handling and fallback for GitHub Pages
async function callBackendAPI(messages, model) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased timeout to 60 seconds
    
    try {
        console.log('Calling API at:', API_URL);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('API response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API error response:', errorData);
            
            // Handle specific error cases
            if (response.status === 404) {
                throw new Error('Backend not found. For GitHub Pages, please use Netlify or run locally with Flask server.');
            } else if (response.status === 402) {
                throw new Error('This model requires paid credits. Please select a free model or purchase credits at https://openrouter.ai/settings/credits');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. This is normal for free accounts. Please try again tomorrow or select a different model.');
            }
            
            throw new Error(`API error: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('API success response:', data);
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API call error:', error);
        if (error.name === 'AbortError') {
            throw new Error('network timeout');
        }
        
        // Detect if we're on GitHub Pages (no backend server)
        if (window.location.protocol === 'https:' && window.location.hostname.includes('github')) {
            throw new Error('GitHub Pages does not support backend servers. Please deploy to Netlify or run locally with Flask server. See deployment instructions.');
        }
        
        // Detect if we're opening file directly
        if (window.location.protocol === 'file:') {
            throw new Error('Direct file access does not work. Please run the Flask server (python server.py) and access via http://localhost:8000');
        }
        
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Scroll chat to bottom
function scrollToBottom() {
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

// Text-to-speech function with female voice preference
function speakResponse(text) {
    // Remove any HTML tags from the response
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.9;  // Slightly slower for clarity
        utterance.pitch = 1.2; // Higher pitch for a more feminine voice
        utterance.volume = 1.0;
        
        // Try to find a female voice
        const voices = speechSynthesis.getVoices();
        let femaleVoice = null;
        
        // If voices are already loaded, look for a female voice immediately
        if (voices.length > 0) {
            // Look for female voices (common names/patterns)
            for (let i = 0; i < voices.length; i++) {
                if (voices[i].name.includes('Female') || 
                    voices[i].name.includes('Woman') || 
                    voices[i].name.includes('Google UK English Female') ||
                    voices[i].name.includes('Samantha') || // macOS Siri voice
                    voices[i].name.includes('Microsoft Zira') || // Windows voice
                    voices[i].name.includes('Google 日本語') ||
                    voices[i].gender === 'female') {
                    femaleVoice = voices[i];
                    break;
                }
            }
            
            // If we found a female voice, use it
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
        }
        
        // Handle the case where voices might load asynchronously
        if (voices.length === 0) {
            // Set up a listener for when voices are loaded
            speechSynthesis.onvoiceschanged = function() {
                const voices = speechSynthesis.getVoices();
                // Look for female voices again when voices are loaded
                for (let i = 0; i < voices.length; i++) {
                    if (voices[i].name.includes('Female') || 
                        voices[i].name.includes('Woman') || 
                        voices[i].name.includes('Google UK English Female') ||
                        voices[i].name.includes('Samantha') || // macOS Siri voice
                        voices[i].name.includes('Microsoft Zira') || // Windows voice
                        voices[i].name.includes('Google 日本語') ||
                        voices[i].gender === 'female') {
                        utterance.voice = voices[i];
                        break;
                    }
                }
                speechSynthesis.speak(utterance);
            };
            
            // Trigger voice loading
            speechSynthesis.getVoices();
        } else {
            // Voices are already available, speak immediately
            speechSynthesis.speak(utterance);
        }
    } else {
        console.log("Text-to-speech not supported in this browser");
    }
}

// Copy message function
function copyMessage(content, button) {
    navigator.clipboard.writeText(content)
        .then(() => {
            // Visual feedback
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="material-symbols-outlined text-xs">check</span> Copied';
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 1500);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            addBotMessage("❌ Failed to copy message to clipboard.");
        });
}

// Edit message function
function editMessage(content, messageElement) {
    if (messageInput) {
        messageInput.value = content;
        messageInput.focus();
    }
}

// Like message function
function likeMessage(content, button) {
    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="material-symbols-outlined text-xs">thumb_up</span> Liked';
    button.style.color = '#10b981'; // green
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.color = '';
    }, 1500);
    
    // In a real implementation, you would send this feedback to your backend
    console.log('User liked message:', content);
}

// Bad message function
function badMessage(content, button) {
    // Visual feedback
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="material-symbols-outlined text-xs">thumb_down</span> Reported';
    button.style.color = '#ef4444'; // red
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.color = '';
    }, 1500);
    
    // In a real implementation, you would send this feedback to your backend
    console.log('User reported bad message:', content);
}

// Share message function
function shareMessage(content) {
    if (navigator.share) {
        navigator.share({
            title: 'VERONIKA AI Response',
            text: content,
        }).catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(content)
            .then(() => {
                // Show temporary message
                const tempDiv = document.createElement('div');
                tempDiv.textContent = 'Message copied to clipboard!';
                tempDiv.style.position = 'fixed';
                tempDiv.style.bottom = '20px';
                tempDiv.style.left = '50%';
                tempDiv.style.transform = 'translateX(-50%)';
                tempDiv.style.backgroundColor = '#334155';
                tempDiv.style.color = 'white';
                tempDiv.style.padding = '10px 20px';
                tempDiv.style.borderRadius = '9999px';
                tempDiv.style.zIndex = '1000';
                document.body.appendChild(tempDiv);
                
                setTimeout(() => {
                    document.body.removeChild(tempDiv);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
}

// Retry message function
function retryMessage(content) {
    // Find the last user message and resend it
    if (conversationHistory.length >= 2) {
        const lastUserMessage = conversationHistory[conversationHistory.length - 2];
        if (lastUserMessage.role === 'user') {
            // Remove the last bot response from conversation history and UI
            conversationHistory.pop(); // Remove bot response
            
            // Remove the last bot message from UI
            const messages = document.querySelectorAll('.bot-message');
            if (messages.length > 0) {
                messages[messages.length - 1].remove();
            }
            
            // Resend the user message
            if (messageInput) {
                messageInput.value = lastUserMessage.content;
                sendMessage();
            }
        }
    }
}

// Button action handlers
function handleNewChat() {
    // Clear conversation history
    conversationHistory = [];
    
    // Clear messages area
    if (messagesArea) {
        const messageElements = messagesArea.querySelectorAll('.message');
        messageElements.forEach(el => el.remove());
    }
    
    // Show welcome section
    if (welcomeSection) {
        welcomeSection.style.display = 'flex';
    }
    
    // Reset model to default (OpenAI GPT-OSS 20B)
    currentModel = 'openai/gpt-oss-20b:free';
    if (modelOptions) {
        // Remove selected class from all options
        modelOptions.forEach(opt => opt.classList.remove('selected'));
        // Find and select the default option
        const defaultOption = Array.from(modelOptions).find(option => 
            option.getAttribute('data-model') === 'openai/gpt-oss-20b:free');
        if (defaultOption) {
            defaultOption.classList.add('selected');
            if (selectedModelText) {
                selectedModelText.textContent = defaultOption.textContent.split(' (')[0];
            }
        }
    }
}