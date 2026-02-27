import tensorflow as tf
import numpy as np
import cv2
import sys
import os

IMG_SIZE = (224, 224)

# Last convolution layer for MobileNetV2
LAST_CONV_LAYER = "Conv_1"

def preprocess_image(img_path):

    img = cv2.imread(img_path)

    if img is None:
        raise ValueError("❌ Image not found")

    original = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    img = cv2.resize(original, IMG_SIZE)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    return img, original


def make_gradcam_heatmap(img_array, model):

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(LAST_CONV_LAYER).output, model.output]
    )

    with tf.GradientTape() as tape:

        conv_output, predictions = grad_model(img_array)

        class_index = tf.argmax(predictions[0])

        loss = predictions[:, class_index]


    grads = tape.gradient(loss, conv_output)

    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))


    conv_output = conv_output[0]

    heatmap = conv_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)


    heatmap = tf.maximum(heatmap, 0)

    if tf.reduce_max(heatmap) != 0:
        heatmap /= tf.reduce_max(heatmap)


    return heatmap.numpy()


# ==============================
# OVERLAY HEATMAP ON IMAGE
# ==============================

def overlay_heatmap(heatmap, original_img, alpha=0.4):

    heatmap = cv2.resize(
        heatmap,
        (original_img.shape[1], original_img.shape[0])
    )

    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(
        heatmap,
        cv2.COLORMAP_JET
    )

    overlay = cv2.addWeighted(
        original_img,
        1 - alpha,
        heatmap,
        alpha,
        0
    )

    return overlay



if __name__ == "__main__":

    if len(sys.argv) != 2:
        print("Usage: python gradcam.py <image_path>")
        sys.exit(1)


    MODEL_PATH = "model.h5"


    print("Loading model...")

    model = tf.keras.models.load_model(MODEL_PATH)

    print("✅ Model loaded for Grad-CAM")


    image_path = sys.argv[1]

    print("Processing:", image_path)


    # Load image
    img_array, original = preprocess_image(image_path)


    # Prediction
    pred = model.predict(img_array)[0][0]

    if pred > 0.5:
        label = "REAL"
        confidence = pred
    else:
        label = "FAKE"
        confidence = 1 - pred


    print(f"Prediction: {label} ({confidence*100:.2f}%)")


    # Generate heatmap
    heatmap = make_gradcam_heatmap(img_array, model)


    # Overlay
    result = overlay_heatmap(heatmap, original)


    # Save output
    output_name = "gradcam_output.jpg"

    cv2.imwrite(
        output_name,
        cv2.cvtColor(result, cv2.COLOR_RGB2BGR)
    )


    print("✅ Heatmap saved as:", output_name)


    


    