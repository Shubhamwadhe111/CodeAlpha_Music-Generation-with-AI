import os
import pickle
import numpy as np
import subprocess
import threading
import base64
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from music21 import instrument, note, stream, chord
from keras.models import load_model
from scipy.io import wavfile
import scipy.signal as signal

app = Flask(__name__)
# Enable CORS for the separate React frontend on port 5173
CORS(app)

# Global variables to handle background processes and status
training_status = {"is_training": False, "message": "Idle"}
collection_status = {"is_collecting": False, "message": "Idle"}
model = None
network_input = None
pitches = None
n_vocab = None

def load_ai_assets():
    global model, network_input, pitches, n_vocab
    try:
        print("Loading model and data...")
        with open('notes.pkl', 'rb') as filepath:
            notes = pickle.load(filepath)
        with open('network_data.pkl', 'rb') as filepath:
            data = pickle.load(filepath)

        network_input = data['input']
        pitches = sorted(set(item for item in notes))
        n_vocab = len(set(notes))
        
        if os.path.exists('model.keras'):
            model = load_model('model.keras')
            print("AI Model loaded successfully.")
        else:
            print("Warning: No model.keras found. Training required.")
    except Exception as e:
        print(f"Failed to load assets: {e}")

# Load initially on startup
load_ai_assets()

def generate_notes_advanced(model, network_input, pitches, n_vocab, num_notes=100, lead_temp=1.1, bass_temp=0.8):
    start = np.random.randint(0, len(network_input)-1)
    int_to_note = dict((number, note) for number, note in enumerate(pitches))
    
    # Bass starts from same vector but will deviate via temperature
    pattern_lead = network_input[start].flatten().tolist()
    pattern_lead = [int(p * n_vocab) for p in pattern_lead]
    
    pattern_bass = list(pattern_lead)
    
    prediction_output_lead = []
    prediction_output_bass = []
    
    for _ in range(num_notes):
        # --- LEAD GENERATION ---
        prediction_input_lead = np.reshape(pattern_lead, (1, len(pattern_lead), 1))
        prediction_input_lead = prediction_input_lead / float(n_vocab)
        prediction_lead = model.predict(prediction_input_lead, verbose=0)
        
        # Apply temperature to lead for melodic variation
        # Use lead_temp provided by user
        prediction_lead = np.log(prediction_lead) / lead_temp
        exp_preds_lead = np.exp(prediction_lead)
        prediction_lead = exp_preds_lead / np.sum(exp_preds_lead)
        
        index_lead = np.random.choice(len(prediction_lead[0]), p=prediction_lead[0])
        result_lead = int_to_note[index_lead]
        prediction_output_lead.append(result_lead)
        pattern_lead.append(index_lead)
        pattern_lead = pattern_lead[1:len(pattern_lead)]
        
        # --- BASS GENERATION ---
        prediction_input_bass = np.reshape(pattern_bass, (1, len(pattern_bass), 1))
        prediction_input_bass = prediction_input_bass / float(n_vocab)
        prediction_bass = model.predict(prediction_input_bass, verbose=0)
        
        # Apply bass temperature for stability/chaos
        prediction_bass = np.log(prediction_bass) / bass_temp
        exp_preds_bass = np.exp(prediction_bass)
        prediction_bass = exp_preds_bass / np.sum(exp_preds_bass)
        
        index_bass = np.random.choice(len(prediction_bass[0]), p=prediction_bass[0])
        result_bass = int_to_note[index_bass]
        
        # Pitch shift the bass note down computationally if it's a standard note
        if '.' not in result_bass and not result_bass.isdigit():
             try:
                 pitch_class = result_bass[:-1]
                 octave = int(result_bass[-1]) - 2 # Drop 2 octaves
                 if octave < 1: octave = 1
                 result_bass = f"{pitch_class}{octave}"
             except: pass
             
        prediction_output_bass.append(result_bass)
        pattern_bass.append(index_bass)
        pattern_bass = pattern_bass[1:len(pattern_bass)]
        
    return prediction_output_lead, prediction_output_bass

def create_midi_advanced(prediction_leads, prediction_basses, filename='output.mid'):
    # Track 0: Standard Lead Melody
    offset = 0
    output_notes = []
    for pattern in prediction_leads:
        if ('.' in pattern) or pattern.isdigit():
            notes_in_chord = pattern.split('.')
            chord_notes = []
            for current_note in notes_in_chord:
                new_note = note.Note(int(current_note))
                new_note.storedInstrument = instrument.Piano()
                chord_notes.append(new_note)
            new_chord = chord.Chord(chord_notes)
            new_chord.offset = offset
            output_notes.append(new_chord)
        else:
            new_note = note.Note(pattern)
            new_note.offset = offset
            new_note.storedInstrument = instrument.Piano()
            output_notes.append(new_note)
        offset += 0.5
        
    # Track 1: Bass Counter-Melody
    offset = 0 # Reset offset for simultaneous track
    output_bass_notes = []
    for pattern in prediction_basses:
        if ('.' in pattern) or pattern.isdigit():
            notes_in_chord = pattern.split('.')
            chord_notes = []
            for current_note in notes_in_chord:
                new_note = note.Note(int(current_note))
                new_note.storedInstrument = instrument.ElectricBass()
                chord_notes.append(new_note)
            new_chord = chord.Chord(chord_notes)
            new_chord.offset = offset
            output_bass_notes.append(new_chord)
        else:
            new_note = note.Note(pattern)
            new_note.offset = offset
            new_note.storedInstrument = instrument.ElectricBass()
            output_bass_notes.append(new_note)
        # Slower rhythm for bass (half-time)
        offset += 1.0

    midi_stream = stream.Score()
    
    part_lead = stream.Part()
    part_lead.append(output_notes)
    
    part_bass = stream.Part()
    part_bass.append(output_bass_notes)

    midi_stream.append(part_lead)
    midi_stream.append(part_bass)
    
    midi_stream.write('midi', fp=filename)
    return filename

# API Endpoints
@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        num_notes = data.get('notes', 100)
        lead_temp = data.get('lead_temp', 1.1)
        bass_temp = data.get('bass_temp', 0.8)
        
        # Duration purely illustrative (~0.5s per note)
        duration_seconds = int(num_notes) * 0.5
        
        print(f"Generating with Flux Matrix: {num_notes} notes, Lead={lead_temp}, Bass={bass_temp}")
        prediction_lead, prediction_bass = generate_notes_advanced(
            model, network_input, pitches, n_vocab, 
            num_notes=int(num_notes), 
            lead_temp=float(lead_temp), 
            bass_temp=float(bass_temp)
        )
        
        # Output paths
        output_dir = os.path.join(app.root_path, 'generated_data')
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        output_file = os.path.join(output_dir, 'aether_track.mid')
        create_midi_advanced(prediction_lead, prediction_bass, filename=output_file)
        
        # Read the file and convert to base64 for direct browser playback (midi-player-js)
        with open(output_file, 'rb') as f:
            base64_midi = base64.b64encode(f.read()).decode('utf-8')
        
        return jsonify({
            'success': True, 
            'duration': f'{duration_seconds}s',
            'midi_data': f'data:audio/midi;base64,{base64_midi}',
            'download_url': '/api/download'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/download')
def download():
    file_path = os.path.join(app.root_path, 'generated_data', 'aether_track.mid')
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True, download_name='aether_generated_track.mid')
    return jsonify({'success': False, 'error': 'No generated file found.'}), 404

# --- STEM SPLITTER LOGIC (DSP PROTOTYPE) ---
def apply_filter(audio_data, rate, type='lowpass', cut=500):
    # Basic Butterworth filter
    nyq = 0.5 * rate
    normal_cut = cut / nyq
    b, a = signal.butter(4, normal_cut, btype=type, analog=False)
    return signal.lfilter(b, a, audio_data)

@app.route('/api/split', methods=['POST'])
def split_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'success': False, 'error': 'No audio file provided'}), 400
            
        audio_file = request.files['audio']
        # Read the file
        rate, data = wavfile.read(audio_file)
        
        # If stereo, convert to mono or just take one channel for processing
        if len(data.shape) > 1:
            working_data = data[:, 0]
        else:
            working_data = data
            
        # Create stems using filters (Prototype Logic)
        stems = {
            'vocals': apply_filter(working_data, rate, 'highpass', 2000),
            'drums': apply_filter(working_data, rate, 'bandpass', [1000, 4000]) if rate > 8000 else working_data,
            'bass': apply_filter(working_data, rate, 'lowpass', 400),
            'other': working_data # Keep original for "other" or bandpass
        }
        
        response_stems = {}
        for name, stem_data in stems.items():
            # Convert back to uint16/int16 for wav writing
            stem_int = np.int16(stem_data / np.max(np.abs(stem_data)) * 32767)
            
            byte_io = io.BytesIO()
            wavfile.write(byte_io, rate, stem_int)
            b64_stem = base64.b64encode(byte_io.getvalue()).decode('utf-8')
            response_stems[name] = f'data:audio/wav;base64,{b64_stem}'
            
        return jsonify({
            'success': True,
            'stems': response_stems,
            'message': 'Neural Deconstruction Complete'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# --- DISCOVER NETWORK FEED (SEED DATA) ---
@app.route('/api/discover', methods=['GET'])
def get_discover_feed():
    tracks = [
        {
            "id": "trk_001",
            "title": "Neon Monsoon",
            "artist": "Aether-V3",
            "genre": "Synthwave",
            "plays": "12.4K",
            "likes": "1.2K",
            "duration": "3:42",
            "color": "var(--aether-cyan)",
            "tags": ["Cyberpunk", "Atmospheric"]
        },
        {
            "id": "trk_002",
            "title": "Stardust Echo",
            "artist": "Neural-Luna",
            "genre": "Cinematic",
            "plays": "8.9K",
            "likes": "942",
            "duration": "4:15",
            "color": "var(--aether-violet)",
            "tags": ["Space", "Orchestral"]
        },
        {
            "id": "trk_003",
            "title": "Digital Raindrops",
            "artist": "Rain-Coder",
            "genre": "Lo-Fi",
            "plays": "25.1K",
            "likes": "3.5K",
            "duration": "2:58",
            "color": "var(--aether-pink)",
            "tags": ["Chill", "Study"]
        },
        {
            "id": "trk_004",
            "title": "Quantum Pulse",
            "artist": "Bit-Master",
            "genre": "Techno",
            "plays": "5.2K",
            "likes": "412",
            "duration": "5:12",
            "color": "#F59E0B",
            "tags": ["High-Energy", "Dark"]
        },
        {
            "id": "trk_005",
            "title": "Midnight Matrix",
            "artist": "Neo-Synth",
            "genre": "Synthwave",
            "plays": "15.8K",
            "likes": "1.9K",
            "duration": "3:20",
            "color": "var(--aether-cyan)",
            "tags": ["Retro", "Driving"]
        },
        {
            "id": "trk_006",
            "title": "Orion's Belt",
            "artist": "Cosmo-AI",
            "genre": "Ambient",
            "plays": "7.3K",
            "likes": "820",
            "duration": "6:45",
            "color": "var(--aether-violet)",
            "tags": ["Space", "Ethereal"]
        }
    ]
    return jsonify({
        "success": True,
        "tracks": tracks,
        "total": len(tracks)
    })

# --- CONSTELLATIONS (NEURAL TEMPLATES) ---
@app.route('/api/templates', methods=['GET'])
def get_templates():
    templates = [
        {
            "id": "tpl_cyber_noir",
            "name": "Cyber-Noir",
            "genre": "Synthwave",
            "description": "Deep, driving basslines with crystalline lead synths. Optimized for nocturnal urban scoring.",
            "color": "var(--aether-cyan)",
            "params": {
                "seqLength": 128,
                "instrument": "synth_lead",
                "reverb": 0.4,
                "delay": 0.6,
                "filterCutoff": 8000
            },
            "stats": ["High Energy", "Driving Bass"]
        },
        {
            "id": "tpl_stellar_drift",
            "name": "Stellar Drift",
            "genre": "Ambient",
            "description": "Ethereal, evolving soundscapes with infinite sustain. Perfect for space exploration and meditation.",
            "color": "var(--aether-violet)",
            "params": {
                "seqLength": 200,
                "instrument": "acoustic_grand_piano",
                "reverb": 0.9,
                "delay": 0.3,
                "filterCutoff": 15000
            },
            "stats": ["Atmospheric", "Infinite"]
        },
        {
            "id": "tpl_vortex_pulse",
            "name": "Vortex Pulse",
            "genre": "Techno",
            "description": "Minimalist repeating structures with aggressive filtering. Engineered for high-speed digital motion.",
            "color": "var(--aether-pink)",
            "params": {
                "seqLength": 64,
                "instrument": "electric_guitar_clean",
                "reverb": 0.2,
                "delay": 0.1,
                "filterCutoff": 4000
            },
            "stats": ["Rhythmic", "Technoid"]
        },
        {
            "id": "tpl_lofi_memory",
            "name": "Lo-Fi Memory",
            "genre": "Study",
            "description": "Nostalgic, dusty textures with warm organic keys. Ideal for focus and reflection in the matrix.",
            "color": "#F59E0B",
            "params": {
                "seqLength": 150,
                "instrument": "electric_piano_1",
                "reverb": 0.6,
                "delay": 0.4,
                "filterCutoff": 3000
            },
            "stats": ["Warm", "Nostalgic"]
        }
    ]
    return jsonify({
        "success": True,
        "templates": templates
    })

@app.route('/api/health', methods=['GET'])
def get_health():
    """Diagnostic check for AI Engine and Server Health."""
    return jsonify({
        "status": "online",
        "model_loaded": model is not None,
        "assets_loaded": network_input is not None,
        "engine": "v3.2.0-Aether",
        "cpu_state": "nominal"
    })

# Background wrapper tasks
def run_collection_task(num_files):
    global collection_status
    collection_status["is_collecting"] = True
    collection_status["message"] = f"Downloading {num_files} missing MIDI tracks..."
    
    try:
        # Run the collection script but override the default num_files dynamically
        # Let's call data_collection.py as a script passing arg is hard, we'll just run its main logic natively if possible
        # Or simply call subprocess for separation
        import data_collection
        data_collection.collect_data(output_dir='data/', num_files=num_files)
        collection_status["message"] = f"Successfully downloaded {num_files} MIDI files."
    except Exception as e:
        collection_status["message"] = f"Error during collection: {str(e)}"
    finally:
        collection_status["is_collecting"] = False

def run_training_pipeline():
    global training_status
    training_status["is_training"] = True
    training_status["message"] = "Preprocessing..."
    
    try:
        # Step 1: Preprocess
        import preprocess
        print("Running preprocess from app.py...")
        notes = preprocess.get_notes()
        vocab_len = len(set(notes))
        network_in, network_out, p = preprocess.prepare_sequences(notes, vocab_len)
        with open('network_data.pkl', 'wb') as filepath:
            pickle.dump({'input': network_in, 'output': network_out}, filepath)
            
        training_status["message"] = "Training LSTM Model (This will take a while)..."
        
        # Step 2: Train
        import train
        print("Running training from app.py...")
        train.train_network()
        
        training_status["message"] = "Training successful! Reloading global UI assets."
        load_ai_assets() # Refresh the model in memory
        
    except Exception as e:
        training_status["message"] = f"Error during training pipeline: {str(e)}"
    finally:
        training_status["is_training"] = False


# Endpoints for Frontend control
@app.route('/api/collect', methods=['POST'])
def start_collection():
    if collection_status["is_collecting"]:
        return jsonify({'success': False, 'message': 'Collection already running'})
        
    data = request.json
    num_files = int(data.get('count', 10))
    thread = threading.Thread(target=run_collection_task, args=(num_files,))
    thread.daemon = True
    thread.start()
    return jsonify({'success': True, 'message': 'Data collection started'})

@app.route('/api/train', methods=['POST'])
def start_training():
    if training_status["is_training"]:
        return jsonify({'success': False, 'message': 'Training already running'})
        
    thread = threading.Thread(target=run_training_pipeline)
    thread.daemon = True
    thread.start()
    return jsonify({'success': True, 'message': 'Training pipeline initialized'})

@app.route('/api/status', methods=['GET'])
def get_global_status():
    return jsonify({
        'collection': collection_status,
        'training': training_status
    })

if __name__ == '__main__':
    app.run(debug=True, port=8000)
