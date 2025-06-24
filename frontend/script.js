// This JavaScript code powers the frontend functionality of the Serene AI chatbot.
// It should be saved as 'script.js' in the 'frontend' directory, alongside index.html.

// It handles sending user messages, displaying AI responses,
// showing a typing indicator, and managing basic UI interactions.

// IMPORTANT: Firebase initialization is commented out for local development.
// If you plan to use Firebase for persistent data or user authentication in a deployed version,
// you will need to uncomment this block and set up your own Firebase project.
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app, db, auth;
let userId = 'anonymous'; // Default userId

// Function to initialize Firebase services and authenticate the user
const initializeFirebase = async () => {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        userId = auth.currentUser?.uid || crypto.randomUUID();
        console.log("Firebase initialized. User ID:", userId);
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
};
*/

// Get references to DOM elements for manipulation
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Flag to prevent sending multiple requests while the AI is processing
let isBotTyping = false;

/**
 * Adds a new message bubble to the chat display.
 * @param {string} text - The content of the message.
 * @param {'user' | 'ai'} sender - Indicates who sent the message ('user' or 'ai').
 */
function addMessage(text, sender) {
    console.log(`[Frontend Log] Adding message: "${text}" from ${sender}`); // Debug log
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender); // Apply general and sender-specific styles

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message-bubble'); // Apply bubble styling
    bubbleDiv.textContent = text; // Set the message text content

    messageDiv.appendChild(bubbleDiv); // Attach the bubble to the message container
    chatMessages.appendChild(messageDiv); // Add the message to the chat display area
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom to show the latest message
}

/**
 * Displays a visual "typing" indicator (bouncing dots) for the AI.
 */
function showTypingIndicator() {
    console.log('[Frontend Log] Showing typing indicator.'); // Debug log
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai', 'typing-indicator'); // Apply AI and typing styles
    typingDiv.innerHTML = `
        <div class="message-bubble loading-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    chatMessages.appendChild(typingDiv); // Add the indicator to the chat display
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

/**
 * Removes the currently displayed typing indicator.
 */
function hideTypingIndicator() {
    console.log('[Frontend Log] Hiding typing indicator.'); // Debug log
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) { // Check if the indicator exists
        typingIndicator.remove(); // Remove it from the DOM
    }
}

/**
 * Sends the user's message to the backend API and handles the AI's response.
 * This is an asynchronous function to handle network requests.
 * @param {string} message - The message typed by the user.
 */
async function sendToSereneAI(message) {
    console.log(`[Frontend Log] Attempting to send message to backend: "${message}"`); // Debug log

    // Prevent duplicate requests if the AI is still processing
    if (isBotTyping) {
        console.log('[Frontend Log] Bot is already typing, request blocked.'); // Debug log
        return;
    }

    isBotTyping = true; // Set flag to true to indicate AI is busy
    showTypingIndicator(); // Show visual typing feedback
    sendButton.disabled = true; // Disable the send button to prevent more input
    userInput.disabled = true; // Also disable the text input
    console.log('[Frontend Log] UI locked: isBotTyping=true, button/input disabled.'); // Debug log

    try {
        // *** CRITICAL: This is the URL to your local Flask backend. ***
        // *** When deploying, CHANGE THIS to your deployed backend's URL (e.g., Cloud Run URL) ***
        const apiUrl = 'http://127.0.0.1:5000/api/chat';
        console.log(`[Frontend Log] Backend API URL: ${apiUrl}`); // Debug log

        // Prepare the data payload to send to the backend as JSON
        const payload = {
            message: message
        };

        console.log('[Frontend Log] Sending fetch request to backend...'); // Debug log
        // Make the HTTP POST request to your backend
        const response = await fetch(apiUrl, {
            method: 'POST', // Use POST method to send data
            headers: {
                'Content-Type': 'application/json' // Specify content type as JSON
            },
            body: JSON.stringify(payload) // Convert JavaScript object to JSON string for the request body
        });
        console.log('[Frontend Log] Fetch response received from backend.'); // Debug log

        // Parse the JSON response received from your backend
        const result = await response.json();
        console.log('[Frontend Log] Response JSON parsed:', result); // Debug log

        // Re-enable UI elements regardless of the outcome
        hideTypingIndicator();
        isBotTyping = false;
        sendButton.disabled = false;
        userInput.disabled = false;
        console.log('[Frontend Log] UI unlocked: isBotTyping=false, button/input enabled.'); // Debug log

        // Check if the HTTP response status was successful (e.g., 200 OK)
        if (response.ok) {
            // Check if the parsed result contains the expected 'response' field from the AI
            if (result && result.response) {
                console.log('[Frontend Log] AI response text received successfully.'); // Debug log
                addMessage(result.response, 'ai'); // Display the AI's message
            } else {
                // Log and display a generic error if the response format is unexpected
                console.error("[Frontend Error] Backend response OK, but missing 'response' field:", result);
                addMessage("I'm sorry, I received an unexpected response from the AI. Please try again.", 'ai');
            }
        } else {
            // If the backend returned an error (e.g., 400, 500 status code)
            console.error("[Frontend Error] Error response from backend:", result.error || "Unknown error occurred on backend.");
            addMessage(result.error || "It seems there was an error connecting to Serene AI. Please try again.", 'ai');
        }

    } catch (error) {
        // Catch any network-related errors (e.g., server not running, connection issues)
        console.error("[Frontend Error] Network or fetch operation failed:", error); // Debug log
        hideTypingIndicator();
        isBotTyping = false;
        sendButton.disabled = false;
        userInput.disabled = false;
        console.log('[Frontend Log] UI unlocked due to network error.'); // Debug log
        addMessage("It seems there was a network error. Please check your connection and try again.", 'ai');
    }
}

// Event Listener for the Send button click
sendButton.addEventListener('click', () => {
    console.log('[Frontend Log] Send button clicked.'); // Debug log
    const message = userInput.value.trim(); // Get the text from the input, remove whitespace
    if (message) { // Proceed only if the message is not empty
        console.log(`[Frontend Log] User input is not empty: "${message}"`); // Debug log
        addMessage(message, 'user'); // Immediately display the user's message
        userInput.value = ''; // Clear the input field after sending
        sendToSereneAI(message); // Call the asynchronous function to send the message
    } else {
        console.log('[Frontend Log] User input is empty, not sending message.'); // Debug log
    }
});

// Event Listener for 'keypress' event on the input field (for Enter key)
userInput.addEventListener('keypress', (e) => {
    console.log(`[Frontend Log] Key pressed in input: "${e.key}". Bot typing status: ${isBotTyping}`); // Debug log
    // If the Enter key is pressed AND the bot is not currently typing
    if (e.key === 'Enter' && !isBotTyping) {
        console.log('[Frontend Log] Enter key detected and bot is idle. Triggering send.'); // Debug log
        sendButton.click(); // Programmatically simulate a click on the Send button
    }
});

// IMPORTANT: The `window.onload = initializeFirebase;` line is commented out.
// This prevents Firebase initialization errors when running locally without a Firebase project setup.
// If you implement Firebase later, uncomment it and provide your Firebase config.
// window.onload = initializeFirebase;
