# 🔌 API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently, the API does not require authentication for basic operations. Future versions will include JWT-based authentication.

## Endpoints

### Health Check
Check the status of the AI model and server.

```http
GET /api/health
```

**Response:**
```json
{
  "status": "online",
  "model_loaded": true,
  "assets_loaded": true,
  "engine": "v3.2.0-Aether",
  "cpu_state": "nominal"
}
```

### Generate Music
Generate AI music using the LSTM model.

```http
POST /api/generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": 100,
  "lead_temp": 1.1,
  "bass_temp": 0.8
}
```

**Parameters:**
- `notes` (integer): Number of notes to generate (50-400)
- `lead_temp` (float): Temperature for lead melody (0.5-2.0)
- `bass_temp` (float): Temperature for bass line (0.5-2.0)

**Response:**
```json
{
  "success": true,
  "duration": "50.0s",
  "midi_data": "data:audio/midi;base64,TVRoZAAAAAY...",
  "download_url": "/api/download"
}
```

### Download Generated Music
Download the last generated MIDI file.

```http
GET /api/download
```

**Response:** MIDI file download

### Discover Feed
Get a feed of sample AI-generated tracks.

```http
GET /api/discover
```

**Response:**
```json
{
  "success": true,
  "total": 6,
  "tracks": [
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
    }
  ]
}
```

### Templates
Get available neural network templates.

```http
GET /api/templates
```

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "tpl_cyber_noir",
      "name": "Cyber-Noir",
      "genre": "Synthwave",
      "description": "Deep, driving basslines with crystalline lead synths.",
      "color": "var(--aether-cyan)",
      "params": {
        "seqLength": 128,
        "instrument": "synth_lead",
        "reverb": 0.4,
        "delay": 0.6,
        "filterCutoff": 8000
      },
      "stats": ["High Energy", "Driving Bass"]
    }
  ]
}
```

### Audio Stem Splitting
Split audio into separate stems (experimental).

```http
POST /api/split
Content-Type: multipart/form-data
```

**Request Body:**
- `audio`: Audio file (WAV, MP3)

**Response:**
```json
{
  "success": true,
  "stems": {
    "vocals": "data:audio/wav;base64,UklGRn...",
    "drums": "data:audio/wav;base64,UklGRn...",
    "bass": "data:audio/wav;base64,UklGRn...",
    "other": "data:audio/wav;base64,UklGRn..."
  },
  "message": "Neural Deconstruction Complete"
}
```

### Training Status
Get the status of model training operations.

```http
GET /api/status
```

**Response:**
```json
{
  "collection": {
    "is_collecting": false,
    "message": "Idle"
  },
  "training": {
    "is_training": false,
    "message": "Idle"
  }
}
```

### Start Data Collection
Begin collecting training data.

```http
POST /api/collect
Content-Type: application/json
```

**Request Body:**
```json
{
  "count": 10
}
```

### Start Model Training
Begin training the AI model.

```http
POST /api/train
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
Currently, no rate limiting is implemented. Future versions will include rate limiting for production use.

## CORS
CORS is enabled for all origins in development mode. Configure appropriately for production.