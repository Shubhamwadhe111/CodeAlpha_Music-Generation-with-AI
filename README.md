# 🎵 AI Music Generation Website

A sophisticated AI-powered music generation platform built with Flask, React, and LSTM neural networks. Create unique musical compositions using advanced machine learning algorithms with a professional studio interface.

![AI Music Generator](https://img.shields.io/badge/AI-Music%20Generator-purple?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow)

## ✨ Features

### 🎼 AI Music Generation
- **LSTM Neural Network** - Advanced sequence generation for melodies and harmonies
- **Dual-Track Generation** - Separate lead and bass tracks with temperature control
- **Genre & Mood Selection** - Electronic, Classical, Jazz, Rock, Ambient, Hip Hop
- **Advanced Parameters** - Tempo, key, complexity, and instrument selection

### 🎛️ Professional Studio Interface
- **Multi-Track Mixer** - 16-track professional mixing console
- **Real-Time Audio Processing** - Waveform visualization and playback
- **Effects Rack** - Reverb, delay, chorus, distortion, and EQ
- **Project Management** - Save, export, and share your creations

### 🌟 Modern Web Interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Glass Morphism UI** - Modern design with backdrop blur effects
- **User Authentication** - Secure login and signup system
- **Template System** - Pre-configured neural matrices for quick start

### 🔍 Discovery Platform
- **Community Feed** - Explore AI-generated tracks from other users
- **Search & Filter** - Find music by genre, artist, or mood
- **Interactive Player** - Built-in audio player with controls

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-music-generator.git
cd ai-music-generator
```

2. **Set up the backend**
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

3. **Set up the frontend**
```bash
cd frontend
npm install
```

4. **Start the application**

Backend (Terminal 1):
```bash
python app.py
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
ai-music-generator/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   ├── App.jsx             # Main application component
│   │   └── main.jsx            # Application entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── 📁 data/                    # Training MIDI files
├── 📁 generated_data/          # Generated music output
├── app.py                      # Flask backend server
├── model.py                    # Neural network architecture
├── train.py                    # Model training script
├── preprocess.py               # Data preprocessing
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🎯 Usage

### Creating Music

1. **Sign up** or **log in** to your account
2. **Navigate** to the music generator
3. **Select** your preferred genre and mood
4. **Adjust** parameters like tempo, key, and complexity
5. **Click** "Generate Music" to create your AI composition
6. **Play**, **download**, or **use in the studio**

### Using Templates

1. Go to the **Templates** page
2. Browse **pre-configured neural matrices**
3. Click **"Launch Matrix"** to apply template settings
4. **Generate** music with optimized parameters

### Studio Features

1. **Multi-track mixing** with individual volume controls
2. **Real-time effects** processing
3. **AI-powered** melody and harmony generation
4. **Export** your projects as MIDI or audio files

## 🧠 AI Model Details

### Architecture
- **LSTM Neural Network** with 512 hidden units
- **Sequence Length** of 100 notes for training
- **Dual-temperature sampling** for lead and bass tracks
- **Music21** library for MIDI processing

### Training Data
- Classical MIDI compositions
- Preprocessed note sequences
- Chord and rhythm patterns

### Generation Process
1. **Input Processing** - Convert parameters to model input
2. **Sequence Generation** - LSTM generates note sequences
3. **Temperature Sampling** - Apply creativity vs. structure balance
4. **MIDI Creation** - Convert sequences to playable MIDI files
5. **Audio Processing** - Real-time playback and visualization

## 🛠️ API Endpoints

### Music Generation
```http
POST /api/generate
Content-Type: application/json

{
  "notes": 100,
  "lead_temp": 1.1,
  "bass_temp": 0.8
}
```

### Health Check
```http
GET /api/health
```

### Discover Feed
```http
GET /api/discover
```

### Templates
```http
GET /api/templates
```

## 🎨 Customization

### Adding New Genres
1. Update the `genres` array in `GenerationPrompt.jsx`
2. Add corresponding logic in the backend generation function
3. Train the model with genre-specific data

### Modifying UI Theme
1. Edit CSS variables in `frontend/src/index.css`
2. Update color schemes in component styles
3. Customize glass morphism effects

### Extending AI Model
1. Modify `model.py` for different architectures
2. Update training parameters in `train.py`
3. Retrain with new data in the `data/` folder

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Music21** - For MIDI processing capabilities
- **TensorFlow/Keras** - For neural network implementation
- **React** - For the modern frontend framework
- **Flask** - For the lightweight backend API
- **Vite** - For fast frontend development

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ai-music-generator/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🔮 Future Features

- [ ] Real-time collaborative composition
- [ ] Advanced audio effects and synthesis
- [ ] Mobile app development
- [ ] Cloud-based model training
- [ ] Integration with music streaming platforms
- [ ] Advanced AI model architectures (Transformer, VAE)

---

**Made with ❤️ and AI** - Transform your musical ideas into reality with the power of artificial intelligence.