from google import genai
from google.genai import types
import os
from dotenv import load_dotenv


# ==============================
# LOAD ENV VARIABLES
# ==============================

load_dotenv()  # Load variables from .env file

api_key = os.getenv("GOOGLE_API_KEY")


# ==============================
# INITIALIZE GEMINI CLIENT
# ==============================

client = None
if api_key:
    try:
        client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(api_version="v1beta"),
        )
    except Exception:
        client = None


# ==============================
# GENERATE EXPLANATION FUNCTION
# ==============================

def generate_explanation(user_question, label, confidence, activation_strength):
    """
    Uses Gemini to explain the CNN prediction.
    Gemini does NOT override classification.
    It only explains the result.
    """

    context = f"""
You are an AI forensic assistant.

The CNN model has already classified the image.

Prediction: {label}
Confidence: {confidence}%
Activation Strength: {activation_strength}

You must NOT override the classification.
Only explain what the result means in a professional and technical manner.
Keep the explanation structured and concise.
"""

    if client is None:
        return (
            f"Predicted label: {label} with {confidence}% confidence. "
            f"Activation strength: {activation_strength}. "
            "Gemini explanation is unavailable because GOOGLE_API_KEY is not configured."
        )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=context + "\n\nUser Question: " + user_question,
        )

        return response.text

    except Exception as e:
        return f"Gemini API Error: {str(e)}"