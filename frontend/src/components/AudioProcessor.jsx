import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Square, Volume2, Download, Activity } from 'lucide-react'

export function AudioProcessor({ audioData }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.8)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        if (audioData) {
            loadAudio()
        }
    }, [audioData])

    const loadAudio = async () => {
        if (!audioData) return
        
        setIsLoading(true)
        try {
            // Create audio context for processing
            const AudioContextClass = window.AudioContext || window.webkitAudioContext
            const audioContext = new AudioContextClass()
            
            // Decode audio data
            const arrayBuffer = await fetch(`data:audio/wav;base64,${audioData}`).then(r => r.arrayBuffer())
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
            
            setDuration(audioBuffer.duration)
            drawWaveform(audioBuffer)
            
            // Create audio element
            if (audioRef.current) {
                audioRef.current.src = `data:audio/wav;base64,${audioData}`
                audioRef.current.volume = volume
            }
        } catch (error) {
            console.error('Error loading audio:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const drawWaveform = (audioBuffer) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const width = canvas.width
        const height = canvas.height

        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.fillRect(0, 0, width, height)

        // Get audio data
        const channelData = audioBuffer.getChannelData(0)
        const samples = width
        const blockSize = Math.floor(channelData.length / samples)

        // Gradient for waveform
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, '#a78bfa')
        gradient.addColorStop(0.5, '#8b5cf6')
        gradient.addColorStop(1, '#6d28d9')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let i = 0; i < samples; i++) {
            let sum = 0
            for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(channelData[i * blockSize + j])
            }
            const average = sum / blockSize
            const barHeight = average * height * 1.5
            const y = (height - barHeight) / 2

            if (i === 0) {
                ctx.moveTo(i, y)
            } else {
                ctx.lineTo(i, y)
            }
        }
        ctx.stroke()

        // Draw progress line
        const progressX = (currentTime / duration) * width
        ctx.strokeStyle = '#00ffcc'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(progressX, 0)
        ctx.lineTo(progressX, height)
        ctx.stroke()
    }

    const handlePlayPause = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleStop = () => {
        if (!audioRef.current) return
        
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setCurrentTime(0)
        setIsPlaying(false)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume)
        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const downloadAudio = () => {
        if (!audioData) return
        
        const link = document.createElement('a')
        link.href = `data:audio/wav;base64,${audioData}`
        link.download = 'aether-generation.wav'
        link.click()
    }

    if (!audioData) {
        return (
            <div className="audio-processor-empty">
                <div className="empty-content">
                    <Activity size={32} className="empty-icon" />
                    <p>Neural Stream Offline</p>
                </div>
                <style>{`
                    .audio-processor-empty {
                        width: 100%;
                        height: 120px;
                        background: rgba(0, 0, 0, 0.4);
                        border: 1px dashed var(--aether-border);
                        border-radius: var(--rounded-md);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .empty-content { text-align: center; color: var(--aether-text-muted); }
                    .empty-icon { margin-bottom: 0.5rem; opacity: 0.5; }
                    .empty-content p { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
                `}</style>
            </div>
        )
    }

    return (
        <div className="audio-processor-root animate-fade-in">
            {/* Waveform Display */}
            <div className="waveform-container">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={120}
                    className="waveform-canvas"
                />
            </div>

            {/* Controls */}
            <div className="processor-controls">
                <div className="controls-left">
                    <button
                        onClick={handlePlayPause}
                        disabled={isLoading}
                        className="aether-btn-primary play-btn"
                    >
                        {isLoading ? (
                            <div className="spin-loader"></div>
                        ) : isPlaying ? (
                            <Pause size={20} />
                        ) : (
                            <Play size={20} style={{ marginLeft: '2px' }} />
                        )}
                    </button>
                    
                    <button onClick={handleStop} className="aether-btn stop-btn">
                        <Square size={16} />
                    </button>

                    <div className="time-display">
                        <span className="current">{formatTime(currentTime)}</span>
                        <span className="separator">/</span>
                        <span className="total">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="controls-right">
                    <div className="processor-volume">
                        <Volume2 size={16} className="vol-icon" />
                        <input
                            type="range" min="0" max="1" step="0.01" value={volume}
                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                            className="volume-slider-custom"
                        />
                    </div>

                    <button onClick={downloadAudio} className="aether-btn download-btn">
                        <Download size={16} />
                        <span>Export WAV</span>
                    </button>
                </div>
            </div>

            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            />

            <style>{`
                .audio-processor-root {
                    width: 100%;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-lg);
                    padding: 1.5rem;
                }

                .waveform-container {
                    width: 100%;
                    height: 100px;
                    background: var(--aether-void);
                    border-radius: var(--rounded-md);
                    overflow: hidden;
                    margin-bottom: 1.5rem;
                    border: 1px solid var(--aether-border);
                }

                .waveform-canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                .processor-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .controls-left, .controls-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .play-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stop-btn {
                    width: 36px;
                    height: 36px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .time-display {
                    font-family: monospace;
                    font-size: 0.875rem;
                    color: white;
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(0,0,0,0.3);
                    padding: 0.4rem 0.75rem;
                    border-radius: var(--rounded-sm);
                    border: 1px solid var(--aether-border);
                }

                .time-display .separator { opacity: 0.3; }
                .time-display .total { color: var(--aether-text-muted); }

                .processor-volume {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0 1rem;
                }

                .vol-icon { color: var(--aether-text-muted); }

                .volume-slider-custom {
                    width: 80px;
                    height: 4px;
                    -webkit-appearance: none;
                    background: var(--aether-border);
                    border-radius: 2px;
                    outline: none;
                }

                .volume-slider-custom::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px;
                    height: 12px;
                    background: var(--aether-cyan);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px var(--aether-cyan-glow);
                }

                .download-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .spin-loader {
                    width: 18px;
                    height: 18px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
            `}</style>
        </div>
    )
}