import os
import tensorflow as tf

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")

IMG_SIZE = (224, 224)
BATCH_SIZE = 16        # Safe for laptop
EPOCHS = 8             # You selected 8
LEARNING_RATE = 0.0001

def main():

    print("====================================")
    print(" AI IMAGE DETECTOR - TRAINING START ")
    print("====================================\n")


    # ==============================
    # DATA GENERATORS
    # ==============================

    print("Loading dataset...")

    train_generator = ImageDataGenerator(
        rescale=1.0/255,
        rotation_range=10,
        zoom_range=0.1,
        horizontal_flip=True
    )

    test_generator = ImageDataGenerator(
        rescale=1.0/255
    )


    train_data = train_generator.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="binary"
    )

    test_data = test_generator.flow_from_directory(
        TEST_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="binary",
        shuffle=False
    )


    # ==============================
    # MODEL SETUP (MOBILENET)
    # ==============================

    print("\nBuilding model...")

    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(224, 224, 3)
    )

    # Freeze base model layers
    base_model.trainable = False


    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation="relu")(x)
    output = Dense(1, activation="sigmoid")(x)

    model = Model(inputs=base_model.input, outputs=output)


    # ==============================
    # COMPILE MODEL
    # ==============================

    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=["accuracy"]
    )


    model.summary()


    # ==============================
    # CALLBACKS (AUTO SAVE + STOP)
    # ==============================

    print("\nSetting callbacks...")

    checkpoint = ModelCheckpoint(
        "model_checkpoint.h5",
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1
    )


    early_stop = EarlyStopping(
        monitor="val_loss",
        patience=2,
        restore_best_weights=True
    )


    callbacks = [checkpoint, early_stop]


    # ==============================
    # TRAINING
    # ==============================

    print("\nTraining started...\n")

    history = model.fit(
        train_data,
        validation_data=test_data,
        epochs=EPOCHS,
        callbacks=callbacks
    )


    # ==============================
    # FINAL SAVE
    # ==============================

    print("\nSaving final model...")

    model.save("model.h5")

    print("\n====================================")
    print(" TRAINING COMPLETED SUCCESSFULLY ✅ ")
    print(" Model saved as model.h5")
    print("====================================")


# ==============================
# RUN
# ==============================

if __name__ == "__main__":
    main()