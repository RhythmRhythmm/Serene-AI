# Serene AI:  Emotional Support Chatbot

Serene AI is a beautifully designed, empathetic chatbot dedicated to helping users manage their emotions and explore their feelings. With a focus on calm, genuine conversations, Serene AI provides a supportive and non-judgmental space for emotional well-being.

##  Features

* **Empathetic AI Responses:** Powered by the Google Gemini API, Serene AI offers concise, genuine, and understanding replies to user inputs.

* **Beautiful & Subtle UI:** A visually appealing interface featuring a soothing pink gradient theme with smooth animations and subtle background elements.

* **Responsive Design:** Optimized for seamless interaction across various devices (desktop, tablet, mobile).

* **Concise Conversations:** AI responses are tuned to be short and conversational, mimicking natural chat interactions.

* **Clear Debugging Logs:** Frontend JavaScript includes detailed console logs for easier development and troubleshooting.


<picture>
<a href="https://postimg.cc/tYSwQdKJ" target="_blank"><img src="https://i.postimg.cc/kgqmSfwQ/Screenshot-2025-06-24-180335.png" alt="Screenshot-2025-06-24-180335"/></a>
<img alt="HOME PAGE" src="YOUR-DEFAULT-IMAGE">
</picture>

<picture>
 <a href="https://postimages.org/" target="_blank"><img src="https://i.postimg.cc/QdmrJ1nR/Screenshot-2025-06-24-180410.png" alt="Screenshot-2025-06-24-180410"/></a>
 <img alt="HOME PAGE" src="YOUR-DEFAULT-IMAGE">
</picture>

##  Tech Stack

* **Frontend:**

    * HTML5

    * Tailwind CSS
      
    * JavaScript 

* **Backend:**

    * Python 3.8+

    * Flask (Web Framework)

    * `requests` (for making HTTP requests to external APIs)

    * `Flask-Cors` (for handling Cross-Origin Resource Sharing)

    * `python-dotenv` (for managing environment variables locally)

    * `gunicorn` (production WSGI server)

* **AI Model:** Google Gemini API (specifically `gemini-2.0-flash`)

Ensure your project files are organized exactly like this:

```
serene-ai/
├── frontend/
│   ├── index.html
│   └── script.js
└── backend/
    ├── app.py
    ├── requirements.txt
    └── .env
```

### Step 1: Create Files & Add Code

1.  **Create the `serene-ai` folder** and navigate into it in your terminal.

2.  **Create `frontend` folder** and inside it, create `index.html` and `script.js`.

    * Copy the HTML code from the latest provided `index.html` immersive into `serene-ai/frontend/index.html`.

    * Copy the JavaScript code from the latest provided `script.js` immersive into `serene-ai/frontend/script.js`.

3.  **Create `backend` folder** and inside it, create `app.py`, `requirements.txt`, and `.env`.

    * Copy the Python code from the latest provided `app.py` immersive into `serene-ai/backend/app.py`.

    * Copy the dependencies from the latest provided `requirements.txt` immersive into `serene-ai/backend/requirements.txt`.

    * **Create the `.env` file:** Open `serene-ai/backend/.env` in a plain text editor. Add the following line, replacing `YOUR_ACTUAL_GEMINI_API_KEY_HERE` with your real Gemini API key:

        ```
        GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
        ```

        **Important:** No spaces around `=`, and no quotes around the key value.

### Step 2: Set Up Backend Python Environment

1.  Open your terminal or command prompt.

2.  Navigate to your `backend` directory:

    ```bash
    cd serene-ai/backend
    ```

3.  Create a Python virtual environment (recommended for dependency isolation):

    ```bash
    python -m venv venv
    ```

4.  Activate the virtual environment:

    * **On Windows:**
        ```bash
        .\venv\Scripts\activate
        ```

    * **On macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```

    You should see `(venv)` prepended to your command prompt.

5.  Install the required Python packages:

    ```bash
    .\venv\Scripts\python.exe -m pip install -r requirements.txt
    ```

### Step 3: Run Locally

1.  **Start the Backend Server:**
    While still in the `serene-ai/backend` directory and with your virtual environment active, run:

    ```bash
    .\venv\Scripts\python.exe app.py
    ```

    Keep this terminal window open. You should see output like `* Running on http://127.0.0.1:5000`.

2.  **Open the Frontend:**
    Open your web browser and drag-and-drop the `serene-ai/frontend/index.html` file directly into a new browser tab.

    * Optionally, open your browser's Developer Console (usually `F12`) and navigate to the "Console" tab to see frontend logs.

3.  **Interact with Serene AI:**
    Type a message into the chatbot's input field and press `Enter` or click the "Send" button.

    * You should see your message appear, followed by a typing indicator.

    * Your backend terminal should display logs indicating it received the request and communicated with Gemini.

    * Serene AI should then respond empathetically in the chat.

