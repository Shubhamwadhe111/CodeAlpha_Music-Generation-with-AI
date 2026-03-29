import { useState, useRef, useEffect } from 'react'
import { 
    Music, Upload, Play, Pause, Square, Download,
    Sliders, Activity, Layers, Volume2, Mic,
    Zap, Sparkles, Save, Share2,
    Piano, Guitar, Drum, Music2,
    BarChart3, SkipBack, SkipForward,
    Loader2, AlertCircle, CheckCircle, User, ChevronUp
} from 'lucide-react'
import { AudioProcessor } from './AudioProcessor'

export function StudioPage() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime] = useState(0)
    const [duration] = useState(180) // 3 minutes
    const [volume, setVolume] = useState(0.8)
    const [selectedTrack, setSelectedTrack] = useState(1)
    const [isRecording, setIsRecording] = useState(false)
    const [projectName, setProjectName] = useState('Untitled Project')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedAudio, setGeneratedAudio] = useState(null)
    const [generationPrompt, setGenerationPrompt] = useState('')
    const [notification, setNotification] = useState(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const fileInputRef = useRef(null)
    const mainContentRef = useRef(null)

    // Sample tracks data
    const [tracks, setTracks] = useState([
        { id: 1, name: 'Main Melody', instrument: 'Piano', volume: 0.8, muted: false, solo: false, color: 'var(--aether-violet)' },
        { id: 2, name: 'Bass Line', instrument: 'Bass', volume: 0.7, muted: false, solo: false, color: 'var(--aether-cyan)' },
        { id: 3, name: 'Atmosphere', instrument: 'Strings', volume: 0.6, muted: false, solo: false, color: 'var(--aether-pink)' },
        { id: 4, name: 'Drums', instrument: 'Drums', volume: 0.9, muted: false, solo: false, color: '#F59E0B' },
        { id: 5, name: 'Lead Synth', instrument: 'Synth', volume: 0.75, muted: false, solo: false, color: '#10B981' },
        { id: 6, name: 'Pad', instrument: 'Pad', volume: 0.5, muted: false, solo: false, color: '#F97316' },
        { id: 7, name: 'Arp', instrument: 'Arp', volume: 0.65, muted: false, solo: false, color: '#EF4444' },
        { id: 8, name: 'FX', instrument: 'FX', volume: 0.4, muted: false, solo: false, color: '#8B5CF6' },
        { id: 9, name: 'Vocal Lead', instrument: 'Vocal', volume: 0.85, muted: false, solo: false, color: '#EC4899' },
        { id: 10, name: 'Harmony Vox', instrument: 'Vocal', volume: 0.6, muted: false, solo: false, color: '#F472B6' },
        { id: 11, name: 'Percussion', instrument: 'Perc', volume: 0.7, muted: false, solo: false, color: '#FB923C' },
        { id: 12, name: 'Sub Bass', instrument: 'Sub', volume: 0.8, muted: false, solo: false, color: '#06B6D4' },
        { id: 13, name: 'Pluck Lead', instrument: 'Pluck', volume: 0.65, muted: false, solo: false, color: '#84CC16' },
        { id: 14, name: 'Ambient Pad', instrument: 'Ambient', volume: 0.45, muted: false, solo: false, color: '#A78BFA' },
        { id: 15, name: 'Texture Layer', instrument: 'Texture', volume: 0.3, muted: false, solo: false, color: '#F87171' },
        { id: 16, name: 'Reverb Send', instrument: 'Send', volume: 0.2, muted: false, solo: false, color: '#6EE7B7' }
    ])

    const [effects, setEffects] = useState({
        reverb: 0.3,
        delay: 0.2,
        chorus: 0.1,
        distortion: 0,
        compressor: 0.4,
        eq: { low: 0, mid: 0, high: 0 }
    })

    const instruments = [
        { name: 'Piano', icon: Piano, color: 'var(--aether-violet)' },
        { name: 'Guitar', icon: Guitar, color: 'var(--aether-cyan)' },
        { name: 'Drums', icon: Drum, color: '#F59E0B' },
        { name: 'Violin', icon: Music, color: 'var(--aether-pink)' },
        { name: 'Bass', icon: Music2, color: '#F97316' }
    ]

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleAIGenerate = async (type) => {
        setIsGenerating(true)
        try {
            const response = await fetch('http://127.0.0.1:8000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    notes: 100,
                    prompt: generationPrompt || `Generate ${type} music`,
                    type: type
                })
            })

            const data = await response.json()
            if (data.success) {
                setGeneratedAudio(data.midi_data)
                showNotification(`${type} generated successfully!`, 'success')
                
                const newTrack = {
                    id: tracks.length + 1,
                    name: `AI ${type}`,
                    instrument: type === 'melody' ? 'Piano' : type === 'harmony' ? 'Strings' : 'Synth',
                    volume: 0.8,
                    muted: false, solo: false,
                    color: type === 'melody' ? 'var(--aether-violet)' : 'var(--aether-cyan)',
                    audioData: data.midi_data
                }
                setTracks([...tracks, newTrack])
            } else {
                showNotification('Generation failed: ' + data.error, 'error')
            }
        } catch (error) {
            showNotification('Connection error. Is backend running?', 'error')
        } finally {
            setIsGenerating(false)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handlePlayPause = () => setIsPlaying(!isPlaying)

    const handleTrackVolumeChange = (trackId, newVolume) => {
        setTracks(tracks.map(t => t.id === trackId ? { ...t, volume: newVolume } : t))
    }

    const handleTrackMute = (trackId) => {
        setTracks(tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t))
    }

    const handleTrackSolo = (trackId) => {
        setTracks(tracks.map(t => t.id === trackId ? { ...t, solo: !t.solo } : t))
    }

    const addNewTrack = () => {
        setTracks([...tracks, {
            id: tracks.length + 1,
            name: `Track ${tracks.length + 1}`,
            instrument: 'Piano',
            volume: 0.8,
            muted: false, solo: false,
            color: 'var(--aether-violet)'
        }])
    }

    const handleFileUpload = () => fileInputRef.current?.click()

    const handleSaveProject = () => {
        showNotification('Project saved to local storage!', 'success')
    }

    const handleExportProject = () => {
        showNotification('Project exported as MIDI/Audio!', 'success')
    }

    const scrollToTop = () => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop
        setShowScrollTop(scrollTop > 300)
    }

    useEffect(() => {
        const viewport = mainContentRef.current
        if (viewport) {
            viewport.addEventListener('scroll', handleScroll)
            return () => viewport.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="studio-root animate-fade-in">
            
            {/* Notification Float */}
            {notification && (
                <div className={`aether-notification ${notification.type}`}>
                    {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Top Toolbar */}
            <div className="studio-toolbar">
                <div className="toolbar-left">
                    <div className="project-icon-box">
                        <Music size={24} />
                    </div>
                    <div className="project-title-group">
                        <input 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="project-name-input"
                        />
                        <span className="project-subtitle">Neural Synthesis Studio</span>
                    </div>
                </div>
                
                <div className="toolbar-actions">
                    <button onClick={handleSaveProject} className="aether-btn toolbar-btn">
                        <Save size={16} /> Save
                    </button>
                    <button className="aether-btn toolbar-btn">
                        <Share2 size={16} /> Share
                    </button>
                    <button onClick={handleExportProject} className="aether-btn-primary toolbar-btn-main">
                        <Download size={16} /> Export
                    </button>

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
            </div>

            <div className="studio-main-layout">
                {/* Left Sidebar - Browser/Tools */}
                <div className="studio-sidebar-left">
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Instruments</h3>
                        <div className="instrument-grid">
                            {instruments.map((inst) => {
                                const Icon = inst.icon
                                return (
                                    <button key={inst.name} className="instrument-btn group">
                                        <Icon size={20} style={{ color: inst.color }} />
                                        <span>{inst.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Synthesizer Control</h3>
                        <div className="tool-column">
                            <button onClick={handleFileUpload} className="tool-btn">
                                <Upload size={18} className="blue" /> Upload Stem
                            </button>
                            <button onClick={() => setIsRecording(!isRecording)} className={`tool-btn ${isRecording ? 'recording' : ''}`}>
                                <Mic size={18} /> {isRecording ? 'Stop Recording' : 'Direct Record'}
                            </button>
                            <button onClick={addNewTrack} className="tool-btn">
                                <Layers size={18} className="green" /> Merge Stems
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-title">Deep Learning Models</h3>
                        <textarea
                            value={generationPrompt}
                            onChange={(e) => setGenerationPrompt(e.target.value)}
                            placeholder="Describe seed melody..."
                            className="ai-prompt-area"
                        />
                        <div className="ai-btn-group">
                            <button onClick={() => handleAIGenerate('melody')} disabled={isGenerating} className="ai-btn melody">
                                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                                <span>Generate Core</span>
                            </button>
                            <button onClick={() => handleAIGenerate('harmony')} disabled={isGenerating} className="ai-btn harmony">
                                <Sparkles size={16} /> <span>Harmonize</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Center - Arrangement/Mixer */}
                <div className="studio-center">
                    {/* Transport Bar */}
                    <div className="transport-bar">
                        <div className="transport-btns">
                            <button onClick={handlePlayPause} className="main-play-btn">
                                {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
                            </button>
                            <button className="transport-sub-btn"><Square size={18} /></button>
                            <button className="transport-sub-btn"><SkipBack size={18} /></button>
                            <button className="transport-sub-btn"><SkipForward size={18} /></button>
                        </div>

                        <div className="time-scrubber">
                            <span className="time-label">{formatTime(currentTime)}</span>
                            <div className="scrubber-track">
                                <div className="scrubber-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                            </div>
                            <span className="time-label">{formatTime(duration)}</span>
                        </div>

                        <div className="master-volume">
                            <Volume2 size={18} className="muted-icon" />
                            <input
                                type="range" min="0" max="1" step="0.01" value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
                    </div>

                    {/* Track List */}
                    <div ref={mainContentRef} className="mixer-viewport" onScroll={handleScroll}>
                        {generatedAudio && (
                            <div className="aether-panel generated-preview">
                                <h4 className="preview-title"><Sparkles size={16} /> Latest AI Generation</h4>
                                <AudioProcessor audioData={generatedAudio} />
                            </div>
                        )}

                        <div className="track-list">
                            <div className="track-list-header">
                                <h3 className="track-list-title">
                                    <Layers size={18} /> Track Mixer ({tracks.length} tracks)
                                </h3>
                                <button onClick={addNewTrack} className="add-track-btn">
                                    + Add Track
                                </button>
                            </div>
                            {tracks.map((track) => (
                                <div key={track.id} className={`track-strip ${selectedTrack === track.id ? 'active' : ''}`} onClick={() => setSelectedTrack(track.id)}>
                                    <div className="track-info">
                                        <div className="track-color-pill" style={{ background: track.color }}></div>
                                        <div className="track-meta">
                                            <span className="track-name">{track.name}</span>
                                            <span className="track-inst-name">{track.instrument}</span>
                                        </div>
                                    </div>

                                    <div className="track-vis">
                                        <Activity size={24} className="vis-placeholder" />
                                    </div>

                                    <div className="track-controls">
                                        <div className="toggle-group">
                                            <button onClick={(e) => { e.stopPropagation(); handleTrackMute(track.id); }} className={`ms-btn mute ${track.muted ? 'active' : ''}`}>M</button>
                                            <button onClick={(e) => { e.stopPropagation(); handleTrackSolo(track.id); }} className={`ms-btn solo ${track.solo ? 'active' : ''}`}>S</button>
                                        </div>
                                        <div className="track-vol-group">
                                            <input
                                                type="range" min="0" max="1" step="0.01" value={track.volume}
                                                onChange={(e) => { e.stopPropagation(); handleTrackVolumeChange(track.id, parseFloat(e.target.value)); }}
                                                className="track-slider"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Scroll to Top Button */}
                        {showScrollTop && (
                            <button onClick={scrollToTop} className="scroll-to-top-btn">
                                <ChevronUp size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - FX/Master */}
                <div className="studio-sidebar-right">
                    <div className="sidebar-section">
                        <h3 className="sidebar-title"><Sliders size={16} /> Master FX Rack</h3>
                        <div className="fx-grid">
                            {Object.entries(effects).map(([name, val]) => {
                                if (name === 'eq') return null
                                return (
                                    <div key={name} className="fx-knob-strip">
                                        <div className="knob-label"><span>{name}</span> <span>{Math.round(val * 100)}%</span></div>
                                        <input
                                            type="range" min="0" max="1" step="0.01" value={val}
                                            onChange={(e) => setEffects({ ...effects, [name]: parseFloat(e.target.value) })}
                                            className="aether-range range-purple compact"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-title"><BarChart3 size={16} /> Neural Metrics</h3>
                        <div className="stats-list">
                            <div className="stat-row"><span>Confidence</span><span className="val">94.2%</span></div>
                            <div className="stat-row"><span>Entropy</span><span className="val">0.32</span></div>
                            <div className="stat-row"><span>Polyphony</span><span className="val">16-voice</span></div>
                            <div className="stat-row"><span>Model</span><span className="val">Aether-V3</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .studio-root {
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: var(--aether-void);
                    color: white;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .aether-notification {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    z-index: 100;
                    padding: 1rem 1.5rem;
                    border-radius: var(--rounded-md);
                    border: 1px solid var(--aether-border);
                    backdrop-blur: 10px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .aether-notification.success { background: rgba(74, 222, 128, 0.1); border-color: #4ade80; color: #4ade80; }
                .aether-notification.error { background: rgba(239, 68, 68, 0.1); border-color: #ef4444; color: #ef4444; }

                .studio-toolbar {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    background: var(--aether-glass);
                    border-bottom: 1px solid var(--aether-border);
                    backdrop-filter: blur(20px);
                    z-index: 10;
                }

                .toolbar-left { 
                    display: flex; 
                    align-items: center; 
                    gap: 1.5rem; 
                    flex: 1;
                }

                .project-icon-box {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                    border-radius: var(--rounded-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
                    flex-shrink: 0;
                }

                .project-title-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    flex: 1;
                    min-width: 0;
                }

                .project-name-input {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1.375rem;
                    font-weight: 800;
                    outline: none;
                    width: 100%;
                    max-width: 300px;
                    padding: 0;
                    line-height: 1.2;
                }

                .project-subtitle {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--aether-text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    line-height: 1;
                }

                .toolbar-actions { 
                    display: flex; 
                    align-items: center;
                    gap: 1rem; 
                    flex-shrink: 0;
                }
                .toolbar-btn-main { 
                    padding: 0.75rem 1.5rem; 
                    font-size: 0.875rem; 
                    font-weight: 700;
                    border-radius: var(--rounded-lg);
                    transition: all var(--duration-fast);
                }
                
                /* Ported User Header Styles */
                .user-profile-header {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: var(--aether-glass);
                    padding: 0.25rem 0.25rem 0.25rem 0.6rem;
                    border-radius: var(--rounded-full);
                    border: 1px solid var(--aether-border);
                    margin-left: 0.5rem;
                }

                .user-profile-summary {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
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

                .user-meta {
                    display: flex;
                    flex-direction: column;
                    line-height: 1;
                }

                .email-truncated {
                    font-size: 0.7rem;
                    font-weight: 700;
                    max-width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: white;
                }

                .badge-free {
                    font-size: 0.55rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: var(--aether-cyan);
                    letter-spacing: 0.05em;
                }

                .studio-main-layout {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                    height: calc(100vh - 80px);
                }

                .studio-sidebar-left, .studio-sidebar-right {
                    width: 340px;
                    background: var(--aether-glass);
                    border-right: 1px solid var(--aether-border);
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    gap: 2.5rem;
                    overflow-y: auto;
                    height: 100%;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.2) transparent;
                    backdrop-filter: blur(20px);
                }

                .studio-sidebar-left::-webkit-scrollbar, .studio-sidebar-right::-webkit-scrollbar {
                    width: 6px;
                }

                .studio-sidebar-left::-webkit-scrollbar-track, .studio-sidebar-right::-webkit-scrollbar-track {
                    background: transparent;
                }

                .studio-sidebar-left::-webkit-scrollbar-thumb, .studio-sidebar-right::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 3px;
                }

                .studio-sidebar-left::-webkit-scrollbar-thumb:hover, .studio-sidebar-right::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.3);
                }

                .studio-sidebar-right { border-right: none; border-left: 1px solid var(--aether-border); }

                .sidebar-section {
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-title {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--aether-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .instrument-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                }

                .instrument-btn {
                    padding: 1.25rem 0.75rem;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    backdrop-filter: blur(20px);
                }

                .instrument-btn span { 
                    font-size: 0.75rem; 
                    font-weight: 600; 
                    color: var(--aether-text-muted); 
                }
                
                .instrument-btn:hover { 
                    background: var(--aether-glass-white); 
                    transform: translateY(-2px);
                    border-color: rgba(255,255,255,0.2);
                }

                .tool-column { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 1rem; 
                }

                .tool-btn {
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-lg);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    backdrop-filter: blur(20px);
                }

                .tool-btn:hover { 
                    background: var(--aether-glass-white); 
                    transform: translateY(-1px);
                    border-color: rgba(255,255,255,0.2);
                }
                
                .tool-btn .blue { color: var(--aether-cyan); }
                .tool-btn .green { color: #4ade80; }
                
                .tool-btn.recording { 
                    border-color: #ef4444; 
                    background: rgba(239, 68, 68, 0.12); 
                    color: #ef4444; 
                }

                .ai-prompt-area {
                    width: 100%;
                    height: 90px;
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-lg);
                    padding: 1rem;
                    color: white;
                    font-size: 0.875rem;
                    resize: none;
                    outline: none;
                    margin-bottom: 1rem;
                    font-family: inherit;
                    line-height: 1.4;
                    transition: border-color var(--duration-fast);
                }

                .ai-prompt-area:focus {
                    border-color: var(--aether-violet);
                }

                .ai-prompt-area::placeholder {
                    color: var(--aether-text-muted);
                }

                .ai-btn-group { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 0.75rem; 
                }

                .ai-btn {
                    padding: 1rem;
                    border-radius: var(--rounded-lg);
                    border: 1px solid transparent;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    backdrop-filter: blur(20px);
                }

                .ai-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .ai-btn.melody { 
                    background: rgba(139, 92, 246, 0.12); 
                    border-color: rgba(139, 92, 246, 0.3); 
                    color: var(--aether-violet); 
                }
                
                .ai-btn.harmony { 
                    background: rgba(34, 211, 238, 0.12); 
                    border-color: rgba(34, 211, 238, 0.3); 
                    color: var(--aether-cyan); 
                }
                
                .ai-btn:hover:not(:disabled) { 
                    transform: translateY(-1px); 
                    opacity: 0.9;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .studio-center {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: rgba(0, 0, 0, 0.15);
                    min-width: 0;
                }

                .transport-bar {
                    height: 90px;
                    background: var(--aether-glass);
                    border-bottom: 1px solid var(--aether-border);
                    display: flex;
                    align-items: center;
                    padding: 0 2.5rem;
                    gap: 3rem;
                    backdrop-filter: blur(20px);
                    flex-shrink: 0;
                }

                .transport-btns { 
                    display: flex; 
                    align-items: center; 
                    gap: 1.25rem;
                    flex-shrink: 0;
                }

                .main-play-btn {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 0 25px rgba(139, 92, 246, 0.4);
                    transition: all var(--duration-fast);
                }

                .main-play-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
                }

                .transport-sub-btn {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--rounded-lg);
                    color: var(--aether-text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--duration-fast);
                }

                .transport-sub-btn:hover { 
                    color: white; 
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .time-scrubber { 
                    flex: 1; 
                    display: flex; 
                    align-items: center; 
                    gap: 1.5rem;
                    min-width: 0;
                }
                .time-label { 
                    font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                    font-size: 0.8rem; 
                    color: var(--aether-text-muted);
                    font-weight: 600;
                    min-width: 45px;
                    text-align: center;
                }
                .scrubber-track { 
                    flex: 1; 
                    height: 6px; 
                    background: rgba(255,255,255,0.08); 
                    border-radius: 3px; 
                    position: relative;
                    cursor: pointer;
                }
                .scrubber-fill { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    height: 100%; 
                    background: linear-gradient(90deg, var(--aether-violet), var(--aether-cyan)); 
                    border-radius: 3px;
                    transition: width 0.1s ease;
                }

                .master-volume { 
                    display: flex; 
                    align-items: center; 
                    gap: 1rem;
                    flex-shrink: 0;
                }
                .volume-slider { 
                    width: 100px; 
                    accent-color: var(--aether-cyan);
                    height: 6px;
                }

                .mixer-viewport { 
                    flex: 1; 
                    padding: 2.5rem; 
                    overflow-y: auto; 
                    overflow-x: hidden;
                    height: calc(100vh - 170px); /* Account for toolbar (80px) + transport (90px) */
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.2) transparent;
                }

                .mixer-viewport::-webkit-scrollbar {
                    width: 6px;
                }

                .mixer-viewport::-webkit-scrollbar-track {
                    background: transparent;
                }

                .mixer-viewport::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 3px;
                }

                .mixer-viewport::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.3);
                }

                .generated-preview { 
                    padding: 2rem; 
                    margin-bottom: 2.5rem; 
                    border-color: var(--aether-violet);
                    border-radius: var(--rounded-xl);
                    background: rgba(139, 92, 246, 0.05);
                    backdrop-filter: blur(20px);
                }
                
                .preview-title { 
                    font-size: 0.9rem; 
                    font-weight: 700; 
                    color: var(--aether-violet); 
                    margin-bottom: 1.25rem; 
                    display: flex; 
                    align-items: center; 
                    gap: 0.75rem; 
                }

                .track-strip {
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-xl);
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 2.5rem;
                    margin-bottom: 1.25rem;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    backdrop-filter: blur(20px);
                }

                .track-strip:hover { 
                    border-color: rgba(255,255,255,0.25); 
                    transform: translateY(-1px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                
                .track-strip.active { 
                    border-color: var(--aether-violet); 
                    background: rgba(139, 92, 246, 0.08);
                    box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
                }

                .track-info { 
                    width: 200px; 
                    display: flex; 
                    align-items: center; 
                    gap: 1.25rem;
                    flex-shrink: 0;
                }
                .track-color-pill { 
                    width: 5px; 
                    height: 40px; 
                    border-radius: 2.5px;
                    flex-shrink: 0;
                }
                .track-meta { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 0.25rem;
                    min-width: 0;
                    flex: 1;
                }
                .track-name { 
                    font-weight: 700; 
                    font-size: 1.05rem; 
                    line-height: 1.2;
                    color: white;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .track-inst-name { 
                    font-size: 0.75rem; 
                    color: var(--aether-text-muted); 
                    font-weight: 600; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em;
                    line-height: 1;
                }

                .track-vis { 
                    flex: 1; 
                    height: 48px; 
                    background: rgba(0,0,0,0.25); 
                    border-radius: var(--rounded-lg); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.05);
                    min-width: 200px;
                }
                .vis-placeholder { 
                    color: rgba(255,255,255,0.08); 
                }

                .track-controls { 
                    display: flex; 
                    align-items: center; 
                    gap: 2rem;
                    flex-shrink: 0;
                }
                .toggle-group { 
                    display: flex; 
                    gap: 0.5rem; 
                }

                .ms-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: var(--rounded-md);
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--aether-text-muted);
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ms-btn:hover {
                    border-color: rgba(255,255,255,0.3);
                    color: white;
                }

                .ms-btn.mute.active { 
                    background: #ef4444; 
                    color: white; 
                    border-color: #ef4444;
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
                }
                
                .ms-btn.solo.active { 
                    background: #f59e0b; 
                    color: black; 
                    border-color: #f59e0b;
                    box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
                }

                .track-slider { 
                    width: 120px; 
                    accent-color: var(--aether-violet);
                    height: 6px;
                }

                .track-list { 
                    margin-bottom: 3rem; 
                }

                .track-list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 1px solid var(--aether-border);
                }

                .track-list-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin: 0;
                }

                .add-track-btn {
                    padding: 0.75rem 1.25rem;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-lg);
                    color: white;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    backdrop-filter: blur(20px);
                }

                .add-track-btn:hover {
                    background: var(--aether-glass-white);
                    border-color: var(--aether-violet);
                    transform: translateY(-1px);
                }

                .fx-grid, .stats-list { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 1.5rem; 
                }
                
                .stat-row { 
                    display: flex; 
                    justify-content: space-between; 
                    font-size: 0.875rem;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                
                .stat-row:last-child {
                    border-bottom: none;
                }
                
                .stat-row span:first-child { 
                    color: var(--aether-text-muted); 
                    font-weight: 600; 
                }
                
                .stat-row .val { 
                    font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                    color: white; 
                    font-weight: 600; 
                }

                .fx-knob-strip { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 0.75rem; 
                }
                
                .knob-label { 
                    display: flex; 
                    justify-content: space-between; 
                    font-size: 0.8rem; 
                    font-weight: 600; 
                    text-transform: capitalize;
                    color: white;
                }

                .knob-label span:last-child {
                    color: var(--aether-text-muted);
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                }

                .scroll-to-top-btn {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
                    transition: all var(--duration-fast);
                    z-index: 50;
                }

                .scroll-to-top-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(139, 92, 246, 0.4);
                }

                .scroll-to-top-btn:active {
                    transform: translateY(0);
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .studio-sidebar-left, .studio-sidebar-right {
                        width: 300px;
                        padding: 1.5rem;
                    }
                    
                    .track-info {
                        width: 160px;
                    }
                    
                    .track-controls {
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .studio-main-layout {
                        flex-direction: column;
                    }
                    
                    .studio-sidebar-left, .studio-sidebar-right {
                        width: 100%;
                        height: auto;
                        max-height: 300px;
                    }
                    
                    .transport-bar {
                        padding: 0 1rem;
                        gap: 1rem;
                    }
                    
                    .track-strip {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }
                    
                    .track-info {
                        width: 100%;
                    }
                    
                    .track-controls {
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    )
}