import React, { useState, useRef, useEffect } from 'react'
import { 
    Scissors, Upload, Play, Pause, Square, 
    Download, Activity, Volume2, Music, 
    Sparkles, Loader2, AlertCircle, CheckCircle,
    User, Headphones, Layers, RotateCcw
} from 'lucide-react'

export function StemSplitterPage() {
    const [file, setFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [stems, setStems] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(0.8)
    const [tracks, setTracks] = useState({
        vocals: { muted: false, solo: false, volume: 1, color: 'var(--aether-pink)' },
        drums: { muted: false, solo: false, volume: 1, color: '#F59E0B' },
        bass: { muted: false, solo: false, volume: 1, color: 'var(--aether-cyan)' },
        other: { muted: false, solo: false, volume: 1, color: 'var(--aether-violet)' }
    })
    
    const audioRefs = {
        vocals: useRef(null),
        drums: useRef(null),
        bass: useRef(null),
        other: useRef(null)
    }
    
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.type.startsWith('audio/')) {
            setFile(selectedFile)
            setStems(null)
        }
    }

    const processAudio = async () => {
        if (!file) return
        
        setIsProcessing(true)
        setProgress(0)
        
        const formData = new FormData()
        formData.append('audio', file)
        
        // Progress simulation
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + (Math.random() * 10), 90))
        }, 400)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/split', {
                method: 'POST',
                body: formData
            })
            
            const data = await response.json()
            if (data.success) {
                setStems(data.stems)
                setProgress(100)
            } else {
                alert('Deconstruction Failed: ' + data.error)
            }
        } catch (error) {
            alert('Core Offline: Check backend connection')
        } finally {
            clearInterval(interval)
            setIsProcessing(false)
        }
    }

    const togglePlayAll = () => {
        const newState = !isPlaying
        Object.values(audioRefs).forEach(ref => {
            if (ref.current) {
                if (newState) ref.current.play()
                else ref.current.pause()
            }
        })
        setIsPlaying(newState)
    }

    const stopAll = () => {
        Object.values(audioRefs).forEach(ref => {
            if (ref.current) {
                ref.current.pause()
                ref.current.currentTime = 0
            }
        })
        setIsPlaying(false)
    }

    const handleTrackControl = (track, type) => {
        setTracks(prev => ({
            ...prev,
            [track]: { ...prev[track], [type]: !prev[track][type] }
        }))
    }

    const handleTrackVolume = (track, val) => {
        setTracks(prev => ({
            ...prev,
            [track]: { ...prev[track], volume: parseFloat(val) }
        }))
        if (audioRefs[track].current) {
            audioRefs[track].current.volume = parseFloat(val) * volume
        }
    }

    useEffect(() => {
        // Master volume update
        Object.keys(tracks).forEach(track => {
            if (audioRefs[track].current) {
                audioRefs[track].current.volume = tracks[track].volume * volume
            }
        })
    }, [volume, tracks])

    return (
        <div className="stem-splitter-root animate-fade-in">
            {/* Header Content */}
            <header className="splitter-header">
                <div className="header-text">
                    <h1 className="header-title">
                        <div className="icon-badge">
                            <Scissors size={24} />
                        </div>
                        Audio Deconstructor
                    </h1>
                    <p className="header-desc">
                        Isolate Vocals, Drums, Bass, and Melody with high-fidelity neural deconstruction.
                    </p>
                </div>

                <div className="header-account">
                     <div className="user-profile-header">
                        <div className="user-profile-summary">
                            <div className="user-avatar-small">
                                <User size={14} />
                            </div>
                            <div className="user-meta">
                                <span className="email-truncated">user@example.com</span>
                                <span className="badge-free">Free</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {!stems ? (
                /* Upload Stage */
                <div className="upload-workflow">
                    <div 
                        className={`drop-zone ${file ? 'has-file' : ''}`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input 
                            type="file" ref={fileInputRef} 
                            onChange={handleFileChange} hide="true" 
                            style={{ display: 'none' }}
                        />
                        <div className="drop-content">
                            <div className="glow-icon-box">
                                {isProcessing ? (
                                    <Loader2 size={48} className="animate-spin text-cyan" />
                                ) : file ? (
                                    <Music size={48} className="text-violet" />
                                ) : (
                                    <Upload size={48} />
                                )}
                            </div>
                            <h3>{file ? file.name : 'Upload Source Audio'}</h3>
                            <p>{isProcessing ? 'Matrixing Neural Sequences...' : 'Drag & Drop .wav or .mp3 (Max 20MB)'}</p>
                        </div>
                        
                        {isProcessing && (
                            <div className="processing-bar-container">
                                <div className="processing-bar-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </div>

                    <button 
                        className="aether-btn-primary split-btn"
                        disabled={!file || isProcessing}
                        onClick={processAudio}
                    >
                        {isProcessing ? 'Processing...' : 'Deconstruct Audio'}
                    </button>
                </div>
            ) : (
                /* Mixer Stage */
                <div className="mixer-workflow">
                    <div className="master-controls">
                        <div className="master-left">
                            <button onClick={togglePlayAll} className="aether-btn-primary play-all-btn">
                                {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
                            </button>
                            <button onClick={stopAll} className="aether-btn stop-btn">
                                <Square size={20} />
                            </button>
                            <div className="master-info">
                                <h3>{file?.name || 'Session Track'}</h3>
                                <div className="status-badge"><Activity size={12} /> Live Matrix</div>
                            </div>
                        </div>

                        <div className="master-right">
                            <div className="master-vol-group">
                                <Volume2 size={18} />
                                <input 
                                    type="range" min="0" max="1" step="0.01" value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="master-slider"
                                />
                            </div>
                            <button className="aether-btn reload-btn" onClick={() => setStems(null)}>
                                <RotateCcw size={16} /> New File
                            </button>
                        </div>
                    </div>

                    <div className="track-grid">
                        {Object.entries(stems).map(([name, uri]) => (
                            <div key={name} className={`stem-card ${tracks[name].muted ? 'muted' : ''} ${tracks[name].solo ? 'solo' : ''}`}>
                                <div className="card-header">
                                    <div className="track-icon" style={{ background: tracks[name].color }}>
                                        {name === 'vocals' ? <Headphones size={20} /> : <Music size={20} />}
                                    </div>
                                    <div className="track-title-info">
                                        <h4 className="track-name">{name}</h4>
                                        <span className="track-tag">Neural_Isolation_v3</span>
                                    </div>
                                    <button className="card-download"><Download size={16} /></button>
                                </div>

                                <div className="waveform-mock">
                                    <div className="bar-set">
                                        {[...Array(20)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className="wave-bar" 
                                                style={{ 
                                                    height: `${Math.random() * 100}%`,
                                                    animationDelay: `${i * 0.1}s`,
                                                    background: isPlaying && !tracks[name].muted ? tracks[name].color : 'rgba(255,255,255,0.1)'
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="track-solo-mute">
                                        <button 
                                            onClick={() => handleTrackControl(name, 'muted')}
                                            className={`tm-btn m ${tracks[name].muted ? 'active' : ''}`}
                                        >M</button>
                                        <button 
                                            onClick={() => handleTrackControl(name, 'solo')}
                                            className={`tm-btn s ${tracks[name].solo ? 'active' : ''}`}
                                        >S</button>
                                    </div>
                                    <div className="track-vol">
                                        <input 
                                            type="range" min="0" max="1" step="0.01" value={tracks[name].volume}
                                            onChange={(e) => handleTrackVolume(name, e.target.value)}
                                            className="track-slider"
                                            style={{ '--track-color': tracks[name].color }}
                                        />
                                    </div>
                                </div>
                                <audio ref={audioRefs[name]} src={uri} loop />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .stem-splitter-root {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 1rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .splitter-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .icon-badge {
                    width: 44px;
                    height: 44px;
                    background: rgba(34, 211, 238, 0.1);
                    border: 1px solid rgba(34, 211, 238, 0.2);
                    border-radius: var(--rounded-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--aether-cyan);
                    margin-bottom: 1rem;
                }

                .header-title {
                    font-size: 1.75rem;
                    font-weight: 900;
                    letter-spacing: -0.05em;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .header-desc {
                    color: var(--aether-text-muted);
                    font-size: 1rem;
                    margin-top: 0.5rem;
                }

                /* Upload Stage Styles */
                .upload-workflow {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    min-height: 400px;
                }

                .drop-zone {
                    width: 100%;
                    max-width: 600px;
                    height: 300px;
                    background: var(--aether-glass);
                    border: 2px dashed var(--aether-border);
                    border-radius: var(--rounded-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    position: relative;
                    overflow: hidden;
                }

                .drop-zone:hover {
                    border-color: var(--aether-cyan);
                    background: rgba(34, 211, 238, 0.05);
                }

                .drop-zone.has-file {
                    border-style: solid;
                    border-color: var(--aether-violet);
                    background: rgba(139, 92, 246, 0.05);
                }

                .drop-content {
                    text-align: center;
                }

                .glow-icon-box {
                    margin-bottom: 1.5rem;
                    color: var(--aether-text-muted);
                }

                .drop-content h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
                .drop-content p { font-size: 0.875rem; color: var(--aether-text-muted); }

                .processing-bar-container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: rgba(255,255,255,0.05);
                }

                .processing-bar-fill {
                    height: 100%;
                    background: linear-gradient(to right, var(--aether-cyan), var(--aether-violet));
                    transition: width 0.4s ease;
                }

                .split-btn {
                    padding: 1rem 3rem;
                    font-size: 1.125rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                /* Mixer Stage Styles */
                .master-controls {
                    background: var(--aether-glass);
                    padding: 1rem 1.5rem;
                    border-radius: var(--rounded-md);
                    border: 1px solid var(--aether-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .master-left { display: flex; align-items: center; gap: 1.5rem; }
                .play-all-btn { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                
                .master-info h3 { font-size: 1.125rem; font-weight: 800; }
                .status-badge { 
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
                    color: var(--aether-cyan); margin-top: 0.25rem;
                }

                .master-right { display: flex; align-items: center; gap: 2rem; }
                .master-vol-group { display: flex; align-items: center; gap: 1rem; color: var(--aether-text-muted); }
                .master-slider { width: 120px; }

                .track-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .stem-card {
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: all var(--duration-fast);
                }

                .stem-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.2); }
                .stem-card.solo { border-color: var(--aether-cyan); box-shadow: 0 0 20px rgba(34, 211, 238, 0.1); }
                .stem-card.muted { opacity: 0.5; }

                .card-header { display: flex; align-items: center; gap: 1rem; }
                .track-icon {
                    width: 40px; height: 40px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center; color: white;
                }

                .track-title-info { flex: 1; }
                .track-name { font-size: 1rem; font-weight: 800; text-transform: capitalize; }
                .track-tag { font-size: 0.65rem; color: var(--aether-text-muted); font-weight: 700; opacity: 0.6; }

                .card-download { 
                    background: transparent; border: none; color: var(--aether-text-muted); cursor: pointer;
                    padding: 0.5rem; border-radius: 50%; transition: all 0.2s;
                }
                .card-download:hover { background: var(--aether-glass-white); color: white; }

                .waveform-mock {
                    height: 80px; width: 100%; background: rgba(0,0,0,0.2);
                    border-radius: var(--rounded-md); display: flex; align-items: center; padding: 0 1rem;
                }

                .bar-set { display: flex; align-items: center; gap: 4px; height: 40px; width: 100%; }
                .wave-bar {
                    flex: 1; min-width: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;
                    transition: height 0.2s ease, background 0.2s ease;
                }

                .card-footer { display: flex; align-items: center; justify-content: space-between; }
                .track-solo-mute { display: flex; gap: 0.5rem; }
                
                .tm-btn {
                    width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--aether-border);
                    background: transparent; color: var(--aether-text-muted); font-size: 0.75rem; font-weight: 900;
                    cursor: pointer; transition: all 0.2s;
                }

                .tm-btn.m.active { background: #ef4444; border-color: #ef4444; color: white; }
                .tm-btn.s.active { background: var(--aether-cyan); border-color: var(--aether-cyan); color: black; }

                .track-vol { flex: 1; display: flex; justify-content: flex-end; }
                .track-slider { width: 100px; }

                /* Header Account Mock */
                .user-profile-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: var(--aether-glass);
                    padding: 0.35rem 1rem;
                    border-radius: var(--rounded-full);
                    border: 1px solid var(--aether-border);
                    backdrop-filter: blur(12px);
                }

                .user-profile-summary {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                }

                .user-avatar-small {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .user-meta { display: flex; flex-direction: column; }
                .email-truncated { font-size: 0.7rem; font-weight: 700; color: white; }
                .badge-free { font-size: 0.55rem; font-weight: 800; color: var(--aether-cyan); text-transform: uppercase; }

                /* Global UI override for better range inputs in stems */
                input[type=range] {
                    -webkit-appearance: none;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    background: var(--aether-border);
                    border-radius: 2px;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    margin-top: -4px;
                    box-shadow: 0 0 10px rgba(255,255,255,0.3);
                }
            `}</style>
        </div>
    )
}
