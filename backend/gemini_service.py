import os

try:
    from dotenv import load_dotenv
except Exception:
    # If python-dotenv is not installed, we simply skip .env loading.
    def load_dotenv(*_args, **_kwargs):  # type: ignore[override]
        return None

try:
    from google import genai
    from google.genai import types
except Exception:
    # If the optional Google Gemini SDK is not installed, degrade gracefully.
    genai = None  # type: ignore[assignment]
    types = None  # type: ignore[assignment]


# ==============================
# LOAD ENV VARIABLES
# ==============================

load_dotenv()  # Load variables from .env file

api_key = os.getenv("GOOGLE_API_KEY")


# ==============================
# INITIALIZE GEMINI CLIENT
# ==============================

client = None
if api_key and genai is not None and types is not None:
    try:
        client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(api_version="v1beta"),
        )
    except Exception:
        # Any failure here should not crash the backend; we will
        # fall back to a static textual explanation instead.
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