from gemini_service import generate_explanation

response = generate_explanation(
    user_question="Why is this image classified as fake?",
    label="FAKE",
    confidence=91.8,
    activation_strength=0.72
)

print("\n===== GEMINI RESPONSE =====\n")
print(response)