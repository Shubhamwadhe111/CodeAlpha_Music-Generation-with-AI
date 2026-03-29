import pickle
import os
from keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from model import create_network

def train_network(epochs=50, batch_size=64):
    """
    Train the Neural Network to generate music.
    
    Args:
        epochs (int): Number of training epochs
        batch_size (int): Batch size for training
    """
    print("=" * 60)
    print("MUSIC AI - MODEL TRAINING")
    print("=" * 60)
    
    # Load the preprocessed data
    print("\nLoading preprocessed data...")
    if not os.path.exists('network_data.pkl'):
        raise FileNotFoundError(
            "network_data.pkl not found. Please run preprocess.py first."
        )
    
    with open('network_data.pkl', 'rb') as filepath:
        data = pickle.load(filepath)
        
    network_input = data['input']
    network_output = data['output']
    
    n_vocab = network_output.shape[1]
    
    print(f"Network input shape: {network_input.shape}")
    print(f"Network output shape: {network_output.shape}")
    print(f"Vocabulary size: {n_vocab}")
    
    # Build the model
    print("\nBuilding model architecture...")
    model = create_network(network_input, n_vocab)
    model.summary()
    
    # Create weights directory if it doesn't exist
    if not os.path.exists('weights'):
        os.makedirs('weights')
    
    # Setup callbacks
    filepath = "weights/weights-improvement-{epoch:02d}-{loss:.4f}.keras"
    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=1,
        save_best_only=True,
        mode='min'
    )
    
    # Early stopping to prevent overfitting
    early_stopping = EarlyStopping(
        monitor='loss', 
        patience=10,
        verbose=1,
        restore_best_weights=True
    )
    
    # Reduce learning rate when loss plateaus
    reduce_lr = ReduceLROnPlateau(
        monitor='loss',
        factor=0.5,
        patience=5,
        min_lr=0.00001,
        verbose=1
    )
    
    callbacks_list = [checkpoint, early_stopping, reduce_lr]
    
    # Train the model
    print(f"\nStarting training for {epochs} epochs with batch size {batch_size}...")
    print("This may take a while depending on your hardware.\n")
    
    history = model.fit(
        network_input,
        network_output,
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks_list,
        verbose=1
    )
    
    # Save the final model explicitly
    model.save('model.keras')
    print("\n" + "=" * 60)
    print("Training complete!")
    print(f"Final model saved to 'model.keras'")
    print(f"Best weights saved in 'weights/' directory")
    print("=" * 60)
    
    return history

if __name__ == "__main__":
    # You can adjust these parameters
    EPOCHS = 50  # Increase to 100-200 for better results
    BATCH_SIZE = 64
    
    train_network(epochs=EPOCHS, batch_size=BATCH_SIZE)
