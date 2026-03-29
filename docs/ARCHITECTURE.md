# 🏗️ Architecture Overview

## System Architecture

The AI Music Generator follows a modern full-stack architecture with clear separation between frontend, backend, and AI components.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Engine     │
│   (React)       │◄──►│   (Flask)       │◄──►│   (TensorFlow)  │
│                 │    │                 │    │                 │
│ • User Interface│    │ • REST API      │    │ • LSTM Model    │
│ • Audio Player  │    │ • MIDI Processing│    │ • Music21       │
│ • Studio UI     │    │ • File Handling │    │ • Note Generation│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture (React)

### Component Structure
```
src/
├── components/
│   ├── HomePage.jsx           # Landing page
│   ├── GenerationPrompt.jsx   # Music generation interface
│   ├── StudioPage.jsx         # Professional studio interface
│   ├── DiscoverPage.jsx       # Community feed
│   ├── TemplatesPage.jsx      # Neural templates
│   ├── AudioProcessor.jsx     # Audio playback and visualization
│   ├── Sidebar.jsx            # Navigation sidebar
│   └── auth/
│       ├── LoginPage.jsx      # User authentication
│       └── SignUpPage.jsx     # User registration
├── App.jsx                    # Main application component
└── main.jsx                   # Application entry point
```

### State Management
- **React Hooks** for local component state
- **Context API** for global state (user authentication)
- **Props drilling** for component communication
- **Local Storage** for persistence

### Styling Architecture
- **CSS-in-JS** with styled components
- **CSS Custom Properties** for theming
- **Glass Morphism** design system
- **Responsive Design** with CSS Grid and Flexbox

## Backend Architecture (Flask)

### API Structure
```python
app.py                 # Main Flask application
├── Routes
│   ├── /api/health           # System health check
│   ├── /api/generate         # Music generation
│   ├── /api/discover         # Community feed
│   ├── /api/templates        # Neural templates
│   ├── /api/split           # Audio stem splitting
│   └── /api/download        # File downloads
├── AI Integration
│   ├── model.py             # Neural network architecture
│   ├── train.py             # Model training
│   └── preprocess.py        # Data preprocessing
└── Utilities
    ├── MIDI processing      # Music21 integration
    └── Audio processing     # SciPy signal processing
```

### Data Flow
1. **HTTP Request** → Flask route handler
2. **Parameter Validation** → Input sanitization
3. **AI Model Inference** → LSTM generation
4. **MIDI Creation** → Music21 processing
5. **Response Formatting** → JSON serialization
6. **File Handling** → Base64 encoding

## AI Engine Architecture

### Neural Network Design
```
Input Layer (100 notes)
        ↓
LSTM Layer (512 units)
        ↓
Dense Layer (vocab_size)
        ↓
Softmax Activation
        ↓
Output (Next note prediction)
```

### Model Components
- **LSTM Cells**: 512 hidden units for sequence memory
- **Vocabulary**: All unique notes from training data
- **Temperature Sampling**: Creativity vs. structure control
- **Dual-Track Generation**: Separate lead and bass sequences

### Training Pipeline
```
MIDI Files → Note Extraction → Sequence Creation → Model Training → Saved Weights
```

## Data Architecture

### File Structure
```
data/
├── *.mid                    # Training MIDI files
generated_data/
├── aether_track.mid         # Generated output
model_files/
├── model.keras              # Trained model weights
├── notes.pkl               # Vocabulary data
└── network_data.pkl        # Preprocessed sequences
```

### Data Processing Flow
1. **MIDI Parsing** → Music21 note extraction
2. **Vocabulary Building** → Unique note identification
3. **Sequence Creation** → Sliding window approach
4. **Normalization** → Input/output preparation
5. **Training Data** → Batch generation

## Security Architecture

### Current Implementation
- **CORS Configuration** for cross-origin requests
- **Input Validation** for API parameters
- **File Type Validation** for uploads
- **Error Handling** with sanitized messages

### Future Enhancements
- **JWT Authentication** for user sessions
- **Rate Limiting** for API endpoints
- **Input Sanitization** for XSS prevention
- **HTTPS Enforcement** for production

## Performance Architecture

### Optimization Strategies
- **Model Caching** → Keep model in memory
- **Lazy Loading** → Load components on demand
- **Code Splitting** → Reduce bundle size
- **Asset Optimization** → Compress images and audio

### Scalability Considerations
- **Stateless Backend** → Easy horizontal scaling
- **CDN Integration** → Static asset delivery
- **Database Integration** → User data persistence
- **Microservices** → Service decomposition

## Deployment Architecture

### Development Environment
```
Local Machine
├── Backend (localhost:8000)
├── Frontend (localhost:5173)
└── Hot Reload Enabled
```

### Production Environment (Recommended)
```
Cloud Infrastructure
├── Frontend (CDN/Static Hosting)
├── Backend (Container/VM)
├── Database (Managed Service)
└── File Storage (Object Storage)
```

## Technology Stack

### Frontend
- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **GSAP** - Animations
- **Web Audio API** - Audio processing

### Backend
- **Flask** - Web framework
- **TensorFlow/Keras** - Machine learning
- **Music21** - MIDI processing
- **SciPy** - Signal processing
- **NumPy** - Numerical computing

### Development Tools
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline
- **Git** - Version control

## Integration Points

### Frontend ↔ Backend
- **REST API** communication
- **JSON** data exchange
- **Base64** file encoding
- **WebSocket** (future real-time features)

### Backend ↔ AI Engine
- **Direct function calls**
- **Pickle serialization**
- **NumPy arrays**
- **File system storage**

### External Integrations
- **Web Audio API** - Browser audio
- **File System API** - File downloads
- **Local Storage** - Client persistence
- **Canvas API** - Waveform visualization

This architecture provides a solid foundation for scalability, maintainability, and future enhancements while keeping the codebase clean and organized.