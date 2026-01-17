import google.generativeai as genai
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

# Shared configuration for Gemini model. Prefer environment variable for the API key.
API_KEY = os.getenv("GEMINI_KEY")
genai.configure(api_key=API_KEY)

BASE_MODEL_NAME = 'gemini-2.5-pro'

# Base model instance (no system prompt) for shared utilities like token counting.
base_model = genai.GenerativeModel(BASE_MODEL_NAME)


def start_chat_with_system(system_prompt: str | None = None):
    """
    Start a new chat and optionally send an initial system prompt to set context.
    Returns the chat object.
    """
    # IMPORTANT:
    # Do NOT send the system prompt as a normal message. That produces an
    # additional model reply and pollutes chat.history, which breaks any
    # "first user message" detection.
    if system_prompt:
        agent_model = genai.GenerativeModel(
            BASE_MODEL_NAME,
            system_instruction=system_prompt,
        )
        return agent_model.start_chat()

    return base_model.start_chat()


def ask_model(prompt: str, chat):
    """
    Send a user prompt to a chat and return the textual response.
    """
    print(f"\n--- Sending prompt to Model ---\nUSER: {prompt}\n")
    response = chat.send_message(prompt)
    return response.text


def count_tokens(history):
    """Return token count for the given chat history using the shared model."""
    return base_model.count_tokens(history)
