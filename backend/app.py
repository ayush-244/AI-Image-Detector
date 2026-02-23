import os
import uuid
import tensorflow as tf
import numpy as np
import cv2

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from predict import predict_image
from gradcam import make_gradcam_heatmap, overlay_heatmap, preprocess_image


# ==============================
# APP SETUP
# ==============================

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


# ==============================
# LOAD MODEL
# ==============================

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
model = tf.keras.models.load_model(MODEL_PATH)

print("✅ Model loaded for API")


# ==============================
# ROUTES
# ==============================

@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400


    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400


    # Save file
    filename = str(uuid.uuid4()) + ".jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    file.save(filepath)


    # Prediction
    label, confidence = predict_image(filepath)


    # Grad-CAM
    img_array, original = preprocess_image(filepath)

    heatmap = make_gradcam_heatmap(img_array, model)

    result = overlay_heatmap(heatmap, original)

    output_name = "out_" + filename
    output_path = os.path.join(OUTPUT_FOLDER, output_name)

    cv2.imwrite(
        output_path,
        cv2.cvtColor(result, cv2.COLOR_RGB2BGR)
    )


    return jsonify({
        "label": label,
        "confidence": round(float(confidence * 100), 2),
        "heatmap_image": output_name
    })


@app.route("/output/<filename>")
def get_output(filename):

    path = os.path.join(OUTPUT_FOLDER, filename)

    return send_file(path, mimetype="image/jpeg")



if __name__ == "__main__":

    app.run(debug=True)