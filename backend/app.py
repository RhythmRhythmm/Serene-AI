# backend/app.py
import os
import requests
import json # Ensure json module is imported for parsing
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Initialize the Flask web application
app = Flask(__name__)

CORS(app)

# Retrieve the Gemini API Key from environment variables.
# Using environment variables is the secure way to manage sensitive information
# like API keys, especially in production environments.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") # This line is correct for reading from .env

# Provide a warning if the API key is not found, which is crucial for debugging.
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable is NOT set.")
    print("Please ensure you have a '.env' file in the 'backend' directory with 'GEMINI_API_KEY=YOUR_KEY_HERE',")
    print("or set it in your deployment environment.")



@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Handles incoming POST requests to the /api/chat endpoint from the frontend.
    It processes the user's message, sends it to the Gemini AI,
    and returns the AI's empathetic response to the frontend.
    """
    print(f"[Backend Log] Received request to /api/chat. Method: {request.method}")

    # Check if the API key is available before processing the request.
    if not GEMINI_API_KEY:
        print("[Backend Error] API Key missing, returning 500.")
        return jsonify({"error": "Gemini API key is not configured on the backend. Please check server logs."}), 500

    # Ensure the request body is JSON
    if not request.is_json:
        print("[Backend Error] Request is not JSON. Content-Type header missing or incorrect.")
        return jsonify({"error": "Request must be JSON."}), 400

    data = request.get_json() # Get the JSON data from the request body
    user_message = data.get('message') # Extract the 'message' field

    # Validate that a user message was provided
    if not user_message:
        print("[Backend Error] No 'message' field found in request JSON.")
        return jsonify({"error": "No message provided in the request payload."}), 400

    print(f"[Backend Log] User message received: '{user_message[:50]}...'") # Log first 50 chars

    try:
        # Define the persona and instructions for Serene AI.
        # This prompt guides the Gemini model to respond as an empathetic emotional support chatbot.
        prompt = (
            f"You are Serene AI, an empathetic and supportive self-help chatbot "
            f"designed to help users manage their emotions and well-being. "
            f"Listen attentively, offer understanding, and provide gentle guidance "
            f"or supportive insights based on the user's input. "
            f"Your goal is to foster a sense of calm and help users process their feelings. "
            f"Respond conversationally and empathetically, keeping responses concise, like a typical chatbot."
            f"The user's input is: \"{user_message}\""
        )

        # Prepare the conversation history for the Gemini API call.
        # For a single turn, we just send the current user prompt.
        # For multi-turn conversations, you would store and pass previous turns here.
        chat_history = [{"role": "user", "parts": [{"text": prompt}]}]

        # Construct the payload for the Gemini API request
        gemini_payload = {
            "contents": chat_history,
            "generationConfig": { # Added generationConfig
                "temperature": 0.7, # Controls randomness. Lower values lead to more deterministic responses.
                "maxOutputTokens": 70 # Further reduced limit for concise, genuine chatbot responses.
            }
        }

        # Build the full URL for the Gemini API endpoint
        gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        print(f"[Backend Log] Calling Gemini API: {gemini_api_url}")

        # Make the HTTP POST request to the Gemini API
        gemini_response = requests.post(gemini_api_url, json=gemini_payload)
        gemini_response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx status codes from Gemini)

        gemini_result = gemini_response.json() # Parse Gemini's JSON response
        print(f"[Backend Log] Gemini API raw response: {json.dumps(gemini_result, indent=2)}") # Log full Gemini response

        # Extract the AI's text response from Gemini's specific JSON structure
        if gemini_result.get("candidates") and gemini_result["candidates"][0].get("content") and \
           gemini_result["candidates"][0]["content"].get("parts"):
            ai_response_text = gemini_result["candidates"][0]["content"]["parts"][0]["text"]
            print(f"[Backend Log] AI response extracted: '{ai_response_text[:50]}...'")
            # Return the extracted AI response as JSON to the frontend
            return jsonify({"response": ai_response_text}), 200
        else:
            # Handle cases where Gemini's response structure is not as expected
            print("[Backend Error] Unexpected Gemini API response structure. 'candidates' or 'content' or 'parts' missing.")
            return jsonify({"error": "The AI service returned an unexpected response format."}), 500

    except requests.exceptions.RequestException as e:
        # Catch and log network/HTTP errors when communicating with Gemini API
        print(f"[Backend Error] Network/API request error to Gemini: {e}")
        return jsonify({"error": f"Failed to connect to the AI service: {e}"}), 500
    except json.JSONDecodeError as e:
        # Catch and log errors if Gemini's response is not valid JSON
        print(f"[Backend Error] JSON decoding error from Gemini response: {e}")
        return jsonify({"error": "Invalid response format received from AI service."}), 500
    except Exception as e:
        # Catch any other unforeseen exceptions during processing
        print(f"[Backend Error] An unexpected internal server error occurred: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
