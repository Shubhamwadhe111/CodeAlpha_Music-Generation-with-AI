"""
Configuration file for AI Music Generation
Modify these parameters to customize your music generation
"""

# ============================================================================
# DATA COLLECTION SETTINGS
# ============================================================================

# Directory to store training MIDI files
DATA_DIR = 'data/'

# Number of MIDI files to collect from corpus
NUM_TRAINING_FILES = 30  # Increase to 50-100 for better results

# Type of music corpus to use
# Options: 'bach', 'beethoven', 'mozart', 'handel', 'haydn', etc.
CORPUS_TYPE = 'bach'

# ============================================================================
# PREPROCESSING SETTINGS
# ============================================================================

# Length of input sequences for training
SEQUENCE_LENGTH = 100  # Longer sequences = more context, but slower training

# ============================================================================
# MODEL ARCHITECTURE SETTINGS
# ============================================================================

# Number of LSTM units per layer
LSTM_UNITS = 512  # Options: 256 (faster), 512 (balanced), 1024 (better quality)

# Number of LSTM layers
NUM_LSTM_LAYERS = 3  # 3 is a good balance

# Dropout rate for regularization
DROPOUT_RATE = 0.3  # Range: 0.2-0.5

# Recurrent dropout rate
RECURRENT_DROPOUT = 0.3  # Range: 0.2-0.4

# ============================================================================
# TRAINING SETTINGS
# ============================================================================

# Number of training epochs
EPOCHS = 50  # Increase to 100-200 for production quality

# Batch size for training
BATCH_SIZE = 64  # Larger = faster but needs more memory

# Optimizer
OPTIMIZER = 'adam'  # Options: 'adam', 'rmsprop', 'sgd'

# Learning rate (None = use default)
LEARNING_RATE = None  # Or set to 0.001, 0.0001, etc.

# Early stopping patience
EARLY_STOPPING_PATIENCE = 10  # Stop if no improvement for N epochs

# Reduce LR patience
REDUCE_LR_PATIENCE = 5  # Reduce learning rate if no improvement for N epochs

# ============================================================================
# GENERATION SETTINGS
# ============================================================================

# Number of notes to generate
NUM_NOTES_TO_GENERATE = 200  # Longer = longer composition

# Sampling temperature
# Lower = more conservative, Higher = more creative
TEMPERATURE = 1.0  # Range: 0.5-1.5

# Output directory for generated MIDI files
OUTPUT_DIR = 'generated_data/'

# Default output filename
DEFAULT_OUTPUT_FILENAME = 'aether_track.mid'

# ============================================================================
# FILE PATHS
# ============================================================================

# Path to save/load notes
NOTES_FILE = 'notes.pkl'

# Path to save/load network data
NETWORK_DATA_FILE = 'network_data.pkl'

# Path to save/load trained model
MODEL_FILE = 'model.keras'

# Directory for model checkpoints
WEIGHTS_DIR = 'weights/'

# ============================================================================
# ADVANCED SETTINGS
# ============================================================================

# Use GPU if available
USE_GPU = True

# Random seed for reproducibility (None = random)
RANDOM_SEED = None  # Or set to 42, 123, etc.

# Verbose output during training
VERBOSE = 1  # 0 = silent, 1 = progress bar, 2 = one line per epoch

# ============================================================================
# PRESETS
# ============================================================================

# Quick test preset (fast training for testing)
PRESET_QUICK_TEST = {
    'NUM_TRAINING_FILES': 10,
    'EPOCHS': 10,
    'LSTM_UNITS': 256,
    'NUM_NOTES_TO_GENERATE': 100
}

# Balanced preset (good quality, reasonable time)
PRESET_BALANCED = {
    'NUM_TRAINING_FILES': 30,
    'EPOCHS': 50,
    'LSTM_UNITS': 512,
    'NUM_NOTES_TO_GENERATE': 200
}

# High quality preset (best results, longer training)
PRESET_HIGH_QUALITY = {
    'NUM_TRAINING_FILES': 100,
    'EPOCHS': 150,
    'LSTM_UNITS': 1024,
    'NUM_NOTES_TO_GENERATE': 300
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def apply_preset(preset_name):
    """
    Apply a preset configuration
    
    Args:
        preset_name (str): 'quick_test', 'balanced', or 'high_quality'
    """
    presets = {
        'quick_test': PRESET_QUICK_TEST,
        'balanced': PRESET_BALANCED,
        'high_quality': PRESET_HIGH_QUALITY
    }
    
    if preset_name not in presets:
        raise ValueError(f"Unknown preset: {preset_name}")
    
    preset = presets[preset_name]
    
    # Update global variables
    globals().update(preset)
    
    print(f"Applied preset: {preset_name}")
    for key, value in preset.items():
        print(f"  {key} = {value}")

def get_config():
    """
    Get current configuration as a dictionary
    
    Returns:
        dict: Current configuration
    """
    return {
        'DATA_DIR': DATA_DIR,
        'NUM_TRAINING_FILES': NUM_TRAINING_FILES,
        'CORPUS_TYPE': CORPUS_TYPE,
        'SEQUENCE_LENGTH': SEQUENCE_LENGTH,
        'LSTM_UNITS': LSTM_UNITS,
        'NUM_LSTM_LAYERS': NUM_LSTM_LAYERS,
        'DROPOUT_RATE': DROPOUT_RATE,
        'RECURRENT_DROPOUT': RECURRENT_DROPOUT,
        'EPOCHS': EPOCHS,
        'BATCH_SIZE': BATCH_SIZE,
        'OPTIMIZER': OPTIMIZER,
        'LEARNING_RATE': LEARNING_RATE,
        'NUM_NOTES_TO_GENERATE': NUM_NOTES_TO_GENERATE,
        'TEMPERATURE': TEMPERATURE,
        'OUTPUT_DIR': OUTPUT_DIR,
        'DEFAULT_OUTPUT_FILENAME': DEFAULT_OUTPUT_FILENAME
    }

def print_config():
    """Print current configuration"""
    print("=" * 60)
    print("CURRENT CONFIGURATION")
    print("=" * 60)
    
    config = get_config()
    for key, value in config.items():
        print(f"{key:30} = {value}")
    
    print("=" * 60)

if __name__ == "__main__":
    print_config()
