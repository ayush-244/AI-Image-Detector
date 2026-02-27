import tensorflow as tf

model = tf.keras.models.load_model("model.h5")
# Use ASCII-only output to avoid Windows console encoding issues.
print("Model loaded successfully!")