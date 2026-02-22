import tensorflow as tf
import numpy as np
import cv2
import sys
import os


# ==============================
# LOAD MODEL
# ==============================

MODEL_PATH = "model.h5"

model = tf.keras.models.load_model(MODEL_PATH)

print("✅ Model loaded for prediction")


# ==============================
# IMAGE PREPROCESS
# ==============================

IMG_SIZE = (224, 224)


def preprocess_image(img_path):

    img = cv2.imread(img_path)

    if img is None:
        raise ValueError("❌ Image not found or invalid format")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    img = cv2.resize(img, IMG_SIZE)

    img = img / 255.0

    img = np.expand_dims(img, axis=0)

    return img


# ==============================
# PREDICTION FUNCTION
# ==============================

def predict_image(img_path):

    img = preprocess_image(img_path)

    pred = model.predict(img)[0][0]

    if pred > 0.5:
        label = "REAL"
        confidence = pred
    else:
        label = "FAKE"
        confidence = 1 - pred

    return label, confidence


# ==============================
# MAIN (CLI TEST)
# ==============================

if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]

    label, conf = predict_image(image_path)

    print("\n==============================")
    print(" Prediction Result")
    print("==============================")
    print(f" Image   : {image_path}")
    print(f" Result  : {label}")
    print(f" Confidence: {conf*100:.2f}%")
    print("==============================\n")