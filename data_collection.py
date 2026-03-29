import os
from music21 import corpus

def collect_data(output_dir='data/', num_files=30, corpus_type='bach'):
    """
    Collects MIDI files from the music21 corpus and saves them to the output directory.
    
    Args:
        output_dir (str): Directory to save MIDI files
        num_files (int): Number of files to collect
        corpus_type (str): Type of corpus ('bach', 'beethoven', 'mozart', etc.)
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    print(f"Fetching {num_files} pieces from music21 {corpus_type} corpus...")
    
    # Get the corpus based on type
    if corpus_type.lower() == 'bach':
        pieces = corpus.chorales.Iterator()
        print("Using Bach Chorales corpus")
    else:
        # For other composers, use the general corpus search
        pieces = corpus.search(corpus_type, 'composer')
        print(f"Using {corpus_type} corpus")
    
    count = 0
    for piece in pieces:
        if count >= num_files:
            break
            
        try:
            # Generate a filename based on the piece's title or ID
            if hasattr(piece, 'metadata') and piece.metadata and piece.metadata.title:
                title = piece.metadata.title
            else:
                title = f"{corpus_type}_piece_{count}"
            
            # Clean up title for filename
            safe_title = "".join([c for c in title if c.isalpha() or c.isdigit() or c == ' ']).rstrip().replace(" ", "_")
            if not safe_title:
                safe_title = f"{corpus_type}_piece_{count}"
            
            filename = os.path.join(output_dir, f"{safe_title}.mid")
            
            # Write out as MIDI
            piece.write('midi', fp=filename)
            print(f"[{count + 1}/{num_files}] Saved: {filename}")
            count += 1
            
        except Exception as e:
            print(f"Error saving piece {count}: {e}")
            # Continue to next piece

    print(f"\nSuccessfully collected {count} MIDI files in '{output_dir}'.")
    
    if count == 0:
        print("Warning: No files were collected. Try a different corpus or check your music21 installation.")

if __name__ == "__main__":
    # You can change these parameters
    collect_data(
        output_dir='data/',
        num_files=30,
        corpus_type='bach'  # Options: 'bach', 'beethoven', 'mozart', etc.
    )
