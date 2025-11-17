import google.generativeai as genai
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

# Shared configuration for Gemini model. Prefer environment variable for the API key.
API_KEY = os.getenv("GEMINI_KEY")
genai.configure(api_key=API_KEY)

# Shared model instance
model = genai.GenerativeModel('gemini-2.5-pro')


def start_chat_with_system(system_prompt: str | None = None):
    """
    Start a new chat and optionally send an initial system prompt to set context.
    Returns the chat object.
    """
    chat = model.start_chat()
    if system_prompt:
        # Set initial context by sending the system prompt as the first message.
        # The underlying API may treat the first message as the system message.
        chat.send_message(system_prompt)
    return chat


def ask_model(prompt: str, chat):
    """
    Send a user prompt to a chat and return the textual response.
    """
    print(f"\n--- Sending prompt to Model ---\nUSER: {prompt}\n")
    response = chat.send_message(prompt)
    return response.text


def count_tokens(history):
    """Return token count for the given chat history using the shared model."""
    return model.count_tokens(history)
