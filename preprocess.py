import os
import pickle
import numpy as np
from music21 import converter, instrument, note, chord
from keras.utils import to_categorical

def get_notes(data_dir='data/'):
    """
    Extracts all notes and chords from the MIDI files in the given directory.
    
    Args:
        data_dir (str): Directory containing MIDI files
        
    Returns:
        list: List of note strings and chord representations
    """
    notes = []
    midi_files = [f for f in os.listdir(data_dir) if f.endswith('.mid')]
    
    if not midi_files:
        raise ValueError(f"No MIDI files found in {data_dir}")
    
    print(f"Found {len(midi_files)} MIDI files to process")
    
    # Get all MIDI files in the data directory
    for idx, file in enumerate(midi_files, 1):
        file_path = os.path.join(data_dir, file)
        try:
            print(f"[{idx}/{len(midi_files)}] Parsing {file}")
            midi = converter.parse(file_path)
            
            notes_to_parse = None
            
            try:
                # Group based on different instruments parts
                s2 = instrument.partitionByInstrument(midi)
                
                if s2: # If parts exist, use the first instrument part
                    notes_to_parse = s2.parts[0].recurse()
                else: # Otherwise, use flat structure
                    notes_to_parse = midi.flat.notes
            except Exception as e:
                print(f"  Warning: Exception while partitioning instrument: {e}")
                notes_to_parse = midi.flat.notes
                
            file_notes = 0
            for element in notes_to_parse:
                if isinstance(element, note.Note):
                    notes.append(str(element.pitch))
                    file_notes += 1
                elif isinstance(element, chord.Chord):
                    # Join chord notes with a dot
                    notes.append('.'.join(str(n) for n in element.normalOrder))
                    file_notes += 1
            
            print(f"  Extracted {file_notes} notes/chords")
            
        except Exception as e:
            print(f"  Error parsing {file_path}: {e}")

    if not notes:
        raise ValueError("No notes extracted from MIDI files. Check your data directory.")

    # Save notes for generation step
    with open('notes.pkl', 'wb') as filepath:
        pickle.dump(notes, filepath)
    
    print(f"\nTotal notes extracted: {len(notes)}")
    print(f"Saved notes to 'notes.pkl'")
        
    return notes

def prepare_sequences(notes, n_vocab, sequence_length=100):
    """
    Prepare the sequences used by the Neural Network.
    
    Args:
        notes (list): List of note strings
        n_vocab (int): Size of vocabulary (unique notes)
        sequence_length (int): Length of input sequences
        
    Returns:
        tuple: (network_input, network_output, pitches)
    """
    # Get all pitch names
    pitches = sorted(set(item for item in notes))
    
    # Create a dictionary to map pitches to integers
    note_to_int = dict((note, number) for number, note in enumerate(pitches))
    
    network_input = []
    network_output = []
    
    # Create input sequences and the corresponding outputs
    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]
        network_input.append([note_to_int[char] for char in sequence_in])
        network_output.append(note_to_int[sequence_out])
        
    n_patterns = len(network_input)
    
    if n_patterns == 0:
        raise ValueError(f"Not enough notes to create sequences. Need at least {sequence_length + 1} notes.")
    
    # Reshape the input into a format compatible with LSTM layers
    network_input = np.reshape(network_input, (n_patterns, sequence_length, 1))
    
    # Normalize input
    network_input = network_input / float(n_vocab)
    
    # Categorical logic - One hot encode the output
    network_output = to_categorical(network_output, num_classes=n_vocab)
    
    print(f"Created {n_patterns} training sequences")
    
    return network_input, network_output, pitches

if __name__ == "__main__":
    print("=" * 60)
    print("MUSIC AI - DATA PREPROCESSING")
    print("=" * 60)
    
    # Step 1: Extract notes from MIDI files
    print("\nStep 1: Extracting notes from MIDI files...")
    notes = get_notes()
    n_vocab = len(set(notes))
    print(f"Vocabulary size: {n_vocab}")
    
    # Step 2: Prepare sequences for training
    print("\nStep 2: Preparing training sequences...")
    network_input, network_output, pitches = prepare_sequences(notes, n_vocab)
    print(f"Network input shape: {network_input.shape}")
    print(f"Network output shape: {network_output.shape}")
    
    # Step 3: Save network input/output to disk for training
    print("\nStep 3: Saving preprocessed data...")
    with open('network_data.pkl', 'wb') as filepath:
        pickle.dump({
            'input': network_input, 
            'output': network_output,
            'pitches': pitches,
            'n_vocab': n_vocab
        }, filepath)
    
    print("\n" + "=" * 60)
    print("Preprocessing completed successfully!")
    print(f"Sequence data saved to 'network_data.pkl'")
    print("=" * 60)
