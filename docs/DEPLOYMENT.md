# 🚀 Deployment Guide

## Overview

This guide covers deploying the AI Music Generator to various platforms and environments.

## Prerequisites

- Git repository with your code
- Domain name (optional)
- Cloud platform account (AWS, Google Cloud, Azure, etc.)

## Local Production Build

### 1. Prepare the Application

```bash
# Clone and setup
git clone https://github.com/yourusername/ai-music-generator.git
cd ai-music-generator

# Backend setup
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend build
cd frontend
npm install
npm run build
cd ..
```

### 2. Production Configuration

Create `.env` file:
```env
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=your-secret-key-here
```

### 3. Run Production Server

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./data:/app/data
      - ./generated_data:/app/generated_data
    restart: unless-stopped

  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
    restart: unless-stopped
```

### 3. Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Cloud Platform Deployments

### Heroku Deployment

1. **Create Heroku App**
```bash
heroku create your-app-name
```

2. **Add Buildpacks**
```bash
heroku buildpacks:add heroku/python
heroku buildpacks:add heroku/nodejs
```

3. **Create Procfile**
```
web: gunicorn app:app
release: python preprocess.py
```

4. **Deploy**
```bash
git push heroku main
```

### AWS Deployment (EC2)

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t3.medium or larger
   - Configure security groups (ports 22, 80, 443)

2. **Setup Server**
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip nginx git -y

# Clone repository
git clone https://github.com/yourusername/ai-music-generator.git
cd ai-music-generator

# Setup application
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/ubuntu/ai-music-generator/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **Setup Systemd Service**
```ini
[Unit]
Description=AI Music Generator
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ai-music-generator
Environment=PATH=/home/ubuntu/ai-music-generator/.venv/bin
ExecStart=/home/ubuntu/ai-music-generator/.venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### Google Cloud Platform (App Engine)

1. **Create app.yaml**
```yaml
runtime: python39

env_variables:
  FLASK_ENV: production

handlers:
- url: /static
  static_dir: frontend/dist/assets

- url: /.*
  script: auto
```

2. **Deploy**
```bash
gcloud app deploy
```

### Vercel Deployment (Frontend Only)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Configure vercel.json**
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

3. **Deploy**
```bash
cd frontend
vercel --prod
```

## Environment Configuration

### Production Environment Variables

```env
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=your-super-secret-key

# Database (if using)
DATABASE_URL=postgresql://user:pass@host:port/db

# File Storage
UPLOAD_FOLDER=/app/uploads
MAX_CONTENT_LENGTH=16777216

# AI Model Configuration
MODEL_PATH=/app/model.keras
NOTES_PATH=/app/notes.pkl

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log
```

### Security Configuration

```python
# app.py additions for production
import os
from flask_talisman import Talisman

# Security headers
Talisman(app, force_https=True)

# Rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

## Performance Optimization

### Backend Optimizations

1. **Use Production WSGI Server**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

2. **Enable Caching**
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/templates')
@cache.cached(timeout=300)
def get_templates():
    # Cached for 5 minutes
    pass
```

3. **Optimize Model Loading**
```python
# Load model once at startup
model = None

def load_ai_assets():
    global model
    if model is None:
        model = load_model('model.keras')
```

### Frontend Optimizations

1. **Build Optimization**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          audio: ['midi-player-js', 'soundfont-player']
        }
      }
    }
  }
}
```

2. **Asset Optimization**
```bash
# Compress images
npm install imagemin imagemin-webp

# Enable gzip compression in nginx
gzip on;
gzip_types text/css application/javascript application/json;
```

## Monitoring and Logging

### Application Monitoring

```python
# Add to app.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

### Health Checks

```python
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }
```

## SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Backup and Recovery

### Database Backup (if using)
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Model and Data Backup
```bash
# Backup AI models and data
tar -czf backup-$(date +%Y%m%d).tar.gz model.keras notes.pkl network_data.pkl data/
```

## Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Ensure all .pkl files are present
   - Check file permissions
   - Verify Python version compatibility

2. **CORS Issues**
   - Update CORS_ORIGINS in production
   - Check frontend API URLs

3. **Memory Issues**
   - Increase server memory
   - Optimize model loading
   - Use model quantization

4. **Performance Issues**
   - Enable caching
   - Use CDN for static assets
   - Optimize database queries

### Logs and Debugging

```bash
# View application logs
tail -f logs/app.log

# Check system resources
htop
df -h

# Monitor network
netstat -tulpn
```

This deployment guide should help you get your AI Music Generator running in production successfully!