"""
Easy-to-use music generation script with customizable parameters
"""

import argparse
import os
import pickle
from keras.models import load_model
from generate import generate_notes, create_midi

def generate_music_with_params(
    output_filename='generated_data/output.mid',
    num_notes=200,
    temperature=1.0,
    model_path='model.keras'
):
    """
    Generate music with custom parameters
    
    Args:
        output_filename (str): Output MIDI file path
        num_notes (int): Number of notes to generate
        temperature (float): Sampling temperature (0.5-1.5)
        model_path (str): Path to trained model
    """
    print("=" * 60)
    print("AI MUSIC GENERATION")
    print("=" * 60)
    
    # Check if required files exist
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found at {model_path}. Please train the model first."
        )
    
    if not os.path.exists('notes.pkl'):
        raise FileNotFoundError(
            "notes.pkl not found. Please run preprocess.py first."
        )
    
    if not os.path.exists('network_data.pkl'):
        raise FileNotFoundError(
            "network_data.pkl not found. Please run preprocess.py first."
        )
    
    # Load data
    print("\nLoading data...")
    with open('notes.pkl', 'rb') as filepath:
        notes = pickle.load(filepath)
    with open('network_data.pkl', 'rb') as filepath:
        data = pickle.load(filepath)
    
    network_input = data['input']
    pitches = sorted(set(item for item in notes))
    n_vocab = len(set(notes))
    
    print(f"Vocabulary size: {n_vocab}")
    
    # Load model
    print(f"\nLoading model from {model_path}...")
    model = load_model(model_path)
    
    # Generate music
    print(f"\nGenerating {num_notes} notes with temperature {temperature}...")
    prediction_output = generate_notes(
        model,
        network_input,
        pitches,
        n_vocab,
        num_notes=num_notes,
        temperature=temperature
    )
    
    # Create MIDI
    print(f"\nCreating MIDI file...")
    create_midi(prediction_output, filename=output_filename)
    
    print("\n" + "=" * 60)
    print("Generation complete!")
    print(f"Output saved to: {output_filename}")
    print("=" * 60)

def main():
    parser = argparse.ArgumentParser(
        description='Generate AI music with custom parameters',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate with default settings
  python generate_music.py

  # Generate 300 notes with more creativity
  python generate_music.py --notes 300 --temperature 1.3

  # Generate conservative music
  python generate_music.py --temperature 0.7 --output my_song.mid

  # Use a specific model checkpoint
  python generate_music.py --model weights/weights-improvement-10-3.1633.keras

Temperature guide:
  0.5-0.7  : Conservative, stays close to training data
  0.8-1.0  : Balanced (default: 1.0)
  1.1-1.5  : Creative, more variation
        """
    )
    
    parser.add_argument(
        '-o', '--output',
        type=str,
        default='generated_data/output.mid',
        help='Output MIDI filename (default: generated_data/output.mid)'
    )
    
    parser.add_argument(
        '-n', '--notes',
        type=int,
        default=200,
        help='Number of notes to generate (default: 200)'
    )
    
    parser.add_argument(
        '-t', '--temperature',
        type=float,
        default=1.0,
        help='Sampling temperature 0.5-1.5 (default: 1.0)'
    )
    
    parser.add_argument(
        '-m', '--model',
        type=str,
        default='model.keras',
        help='Path to trained model (default: model.keras)'
    )
    
    args = parser.parse_args()
    
    # Validate temperature
    if args.temperature < 0.1 or args.temperature > 2.0:
        print("Warning: Temperature should be between 0.5 and 1.5 for best results")
    
    try:
        generate_music_with_params(
            output_filename=args.output,
            num_notes=args.notes,
            temperature=args.temperature,
            model_path=args.model
        )
    except Exception as e:
        print(f"\nError: {e}")
        print("\nMake sure you have:")
        print("  1. Run preprocess.py to create notes.pkl and network_data.pkl")
        print("  2. Run train.py to create model.keras")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
