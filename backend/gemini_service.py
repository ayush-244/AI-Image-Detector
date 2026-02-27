import google.generativeai as genai
import os


# Set your Gemini API key as environment variable first
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")


def generate_explanation(user_question, label, confidence, activation_strength):

    system_context = f"""
    You are an AI forensic assistant.

    Model Prediction: {label}
    Confidence: {confidence}%
    Activation Strength: {activation_strength}

    The CNN model has already classified the image.
    You must NOT override the classification.
    You must only explain and interpret.
    """

    prompt = system_context + "\nUser Question: " + user_question

    response = model.generate_content(prompt)

    return response.text