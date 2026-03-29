# 🚀 Setup Guide - AI Music Generator

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-music-generator.git
cd ai-music-generator
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Verify Backend Installation
```bash
python app.py
```
You should see: `AI Model loaded successfully.`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

### 4. Access the Application

1. **Backend**: http://localhost:8000
2. **Frontend**: http://localhost:5173

## Training Your Own Model (Optional)

### 1. Prepare Training Data
```bash
# Add MIDI files to the data/ folder
python data_collection.py
```

### 2. Preprocess Data
```bash
python preprocess.py
```

### 3. Train the Model
```bash
python train.py
```

## Troubleshooting

### Common Issues

#### Backend Won't Start
- Ensure Python 3.8+ is installed
- Activate virtual environment
- Install all requirements: `pip install -r requirements.txt`

#### Frontend Won't Start
- Ensure Node.js 16+ is installed
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`

#### Model Not Loading
- Check if `model.keras` exists in root directory
- Retrain the model if necessary
- Verify all `.pkl` files are present

#### CORS Errors
- Ensure backend is running on port 8000
- Check frontend is accessing correct backend URL

### Performance Tips

1. **Use SSD storage** for faster model loading
2. **Allocate sufficient RAM** (minimum 8GB recommended)
3. **Close unnecessary applications** during training
4. **Use GPU acceleration** if available (CUDA-compatible)

## Development Mode

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Vite automatically reloads on file changes
- **Backend**: Flask debug mode reloads on Python file changes

### Environment Variables
Create `.env` file in root directory:
```env
FLASK_ENV=development
FLASK_DEBUG=1
```

## Production Deployment

### Backend
```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Frontend
```bash
# Build for production
cd frontend
npm run build

# Serve static files
npm run preview
```

## Need Help?

- 📖 Check the main [README.md](README.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/yourusername/ai-music-generator/issues)
- 💬 Join our community discussions