from google import genai
import os

# Use GOOGLE_API_KEY (not GEMINI_API_KEY)
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

def generate_explanation(user_question, label, confidence, activation_strength):

    context = f"""
You are an AI forensic assistant.

The CNN model has already classified the image.

Prediction: {label}
Confidence: {confidence}%
Activation Strength: {activation_strength}

You must NOT override the classification.
Only explain the reasoning behind the result in a professional manner.
"""

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=context + "\nUser Question: " + user_question,
    )

    return response.text