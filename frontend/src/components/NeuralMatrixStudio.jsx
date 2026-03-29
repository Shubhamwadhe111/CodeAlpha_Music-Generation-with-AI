import React, { useState, useRef, useEffect } from 'react'
import { 
    Music, Play, Pause, Square, Download, 
    Save, Share2, Layers, Zap, Activity,
    Sliders, Cpu, Sparkles, Loader2,
    Volume2, VolumeX, Maximize2, Trash2,
    RefreshCw, ChevronRight, Gauge
} from 'lucide-react'
import { AetherMidiPlayer } from './AetherMidiPlayer'

export function NeuralMatrixStudio({ 
    onGenerate, 
    isGenerating, 
    isTurboActive, 
    isDevActive, 
    leadTemp, 
    setLeadTemp, 
    bassTemp, 
    setBassTemp,
    mutationIntensity,
    onApplyMutation,
    history = []
}) {
    const [activeNotes, setActiveNotes] = useState([])
    const [audioData, setAudioData] = useState([])
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [projectName, setProjectName] = useState('NEURAL_TRACK_001')
    
    // Track Management
    const [tracks, setTracks] = useState([
        { id: 'lead', name: 'NEURAL_LEAD', color: 'var(--aether-violet)', volume: 0.8, muted: false, solo: false, icon: Zap },
        { id: 'bass', name: 'SYNTH_BASS', color: 'var(--aether-cyan)', volume: 0.7, muted: false, solo: false, icon: Layers },
        { id: 'pad', name: 'ETHER_PAD', color: 'var(--aether-pink)', volume: 0.5, muted: false, solo: false, icon: Activity }
    ])

    const containerRef = useRef(null)

    // Sync with global history if needed
    const latestGenerated = history.length > 0 ? history[0].data : null

    const handleVolumeChange = (id, val) => {
        setTracks(tracks.map(t => t.id === id ? { ...t, volume: val } : t))
    }

    const toggleMute = (id) => {
        setTracks(tracks.map(t => t.id === id ? { ...t, muted: !t.muted } : t))
    }

    return (
        <div ref={containerRef} className={`studio-module animate-fade-in ${isTurboActive ? 'turbo-mode' : ''}`}>
            
            {/* Studio Header HUD */}
            <header className="studio-hud-header">
                <div className="hud-left">
                    <div className="studio-orb-glow">
                        <Music className="pulse-icon" />
                    </div>
                    <div className="meta-stack">
                        <input 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="studio-title-input"
                        />
                        <div className="system-status">
                            <span className="status-bit">KERNEL_v3.2</span>
                            <span className="status-separator">//</span>
                            <span className="status-bit">STUDIO_ACTIVE</span>
                        </div>
                    </div>
                </div>

                <div className="hud-right">
                    <div className="stat-pills">
                        <div className="stat-pill">
                            <span className="p-label">FIDELITY</span>
                            <span className="p-val">98%</span>
                        </div>
                        <div className="stat-pill">
                            <span className="p-label">LATENCY</span>
                            <span className="p-val">12ms</span>
                        </div>
                    </div>
                    <button className="studio-action-btn primary" onClick={() => onGenerate()}>
                         {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                         GENERATE SINGLE_POINT
                    </button>
                    <button className="studio-action-btn secondary"><Download size={16} /> EXPORT_MIDI</button>
                </div>
            </header>

            <main className="studio-workspace">
                {/* --- ARRANGEMENT VIEW (LEFT) --- */}
                <section className="arrangement-view">
                    <div className="track-list-column">
                        {tracks.map(track => (
                            <div key={track.id} className="track-header-strip">
                                <div className="track-id-glow" style={{ background: track.color }}></div>
                                <div className="track-meta">
                                    <span className="track-name">{track.name}</span>
                                    <div className="track-controls-small">
                                        <button onClick={() => toggleMute(track.id)} className={`ctrl-btn ${track.muted ? 'active' : ''}`}>M</button>
                                        <button className="ctrl-btn">S</button>
                                    </div>
                                </div>
                                <div className="track-slider-group">
                                    <input 
                                        type="range" min="0" max="1" step="0.01" 
                                        value={track.volume} 
                                        onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                                        style={{ '--accent': track.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="timeline-view-grid">
                        <div className="timeline-playhead" style={{ left: `${(currentTime / 100) * 100}%` }}></div>
                        {tracks.map(track => (
                            <div key={track.id} className="timeline-track-lane">
                                {latestGenerated && (
                                    <div className="audio-region" style={{ background: `linear-gradient(to right, ${track.color}44, ${track.color}22)` }}>
                                        <div className="region-wave"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- MUTATION & CONTROL (RIGHT) --- */}
                <aside className="studio-sidebar-controls">
                    <div className="aether-panel mutation-matrix-panel">
                        <h3 className="panel-label"><Gauge size={14} /> NEURAL_MUTATION_HUD</h3>
                        
                        <div className="temp-sliders-advanced">
                            <div className="slider-row">
                                <div className="s-header">
                                    <span>LEAD_NOVELTY</span>
                                    <b>{leadTemp.toFixed(1)}</b>
                                </div>
                                <input 
                                    type="range" min="0.5" max="1.8" step="0.1" 
                                    value={leadTemp} 
                                    onChange={(e) => setLeadTemp(parseFloat(e.target.value))}
                                    className="aether-range range-purple"
                                />
                                <span className="s-desc">Melodic entropy level for primary vectors.</span>
                            </div>

                            <div className="slider-row">
                                <div className="s-header">
                                    <span>BASS_HARMONY</span>
                                    <b>{bassTemp.toFixed(1)}</b>
                                </div>
                                <input 
                                    type="range" min="0.5" max="1.4" step="0.1" 
                                    value={bassTemp} 
                                    onChange={(e) => setBassTemp(parseFloat(e.target.value))}
                                    className="aether-range range-cyan"
                                />
                                <span className="s-desc">Calculation of harmonic grounding vs. chaos.</span>
                            </div>
                        </div>

                        <div className="intensity-selector-flat">
                            <button onClick={() => onApplyMutation('Subtle')} className={`int-option ${mutationIntensity === 'Subtle' ? 'active' : ''}`}>Subtle</button>
                            <button onClick={() => onApplyMutation('Evolved')} className={`int-option ${mutationIntensity === 'Evolved' ? 'active' : ''}`}>Evolved</button>
                            <button onClick={() => onApplyMutation('Chaotic')} className={`int-option ${mutationIntensity === 'Chaotic' ? 'active' : ''}`}>Chaotic</button>
                        </div>
                    </div>

                    <div className="aether-panel visualizer-telemetry">
                        <h3 className="panel-label"><Activity size={14} /> NEURAL_PULSE_FEED</h3>
                        <div className="visualizer-bars">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className="v-bar" 
                                    style={{ 
                                        height: `${Math.random() * 100}%`,
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                        <div className="tel-feed">
                            <div className="tel-row">
                                <span>SIGNAL_FIDELITY:</span>
                                <b>OK</b>
                            </div>
                            <div className="tel-row">
                                <span>MATRIX_RESOLVE:</span>
                                <b>94%</b>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* --- MASTER CONTROLS (BOTTOM) --- */}
            <footer className="studio-master-footer">
                <div className="player-module-core">
                    <AetherMidiPlayer
                        midiBase64={latestGenerated}
                        onNoteOn={(n) => setActiveNotes(prev => [...prev, n])}
                        onNoteOff={(n) => setActiveNotes(prev => prev.filter(x => x !== n))}
                        onProgress={(p) => setCurrentTime(p)}
                        instrumentName="acoustic_grand_piano"
                        reverbLevel={0.4}
                        delayLevel={0.2}
                    />
                </div>
            </footer>

            <style>{`
                .studio-module {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem 2rem;
                    gap: 1.5rem;
                    height: 100vh;
                    overflow: hidden;
                    position: relative;
                }

                .studio-hud-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--aether-border);
                }

                .hud-left { display: flex; align-items: center; gap: 1.5rem; }
                .studio-orb-glow {
                    width: 52px; height: 52px;
                    background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 25px var(--aether-violet-glow);
                    color: white;
                }
                .pulse-icon { animation: pulse 2s infinite; }

                .studio-title-input {
                    background: transparent; border: none; outline: none;
                    color: white; font-size: 1.75rem; font-weight: 950;
                    letter-spacing: -0.05em; width: 350px;
                }

                .system-status { display: flex; gap: 0.75rem; font-size: 0.65rem; color: var(--aether-text-muted); font-weight: 800; }
                .status-bit { color: var(--aether-cyan); letter-spacing: 0.1em; }

                .hud-right { display: flex; align-items: center; gap: 1.5rem; }
                .stat-pills { display: flex; gap: 1rem; }
                .stat-pill {
                    display: flex; flex-direction: column; align-items: flex-end;
                    line-height: 1; gap: 0.25rem;
                }
                .p-label { font-size: 0.55rem; font-weight: 900; color: var(--aether-text-muted); }
                .p-val { font-size: 0.9rem; font-weight: 900; font-family: monospace; color: white; }

                .studio-action-btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 10px; border: 1px solid transparent;
                    font-size: 0.8rem; font-weight: 900; display: flex; align-items: center; gap: 0.75rem;
                    cursor: pointer; transition: all 0.2s;
                }
                .studio-action-btn.primary {
                    background: var(--aether-violet); color: white;
                    box-shadow: 0 0 20px var(--aether-violet-glow);
                }
                .studio-action-btn.secondary {
                    background: rgba(255,255,255,0.05); border-color: var(--aether-border);
                    color: var(--aether-text-muted);
                }
                .studio-action-btn:hover { transform: translateY(-2px); filter: brightness(1.2); }

                .studio-workspace {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 1.5rem;
                    min-height: 0;
                }

                .arrangement-view {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--aether-border);
                    border-radius: 20px;
                    display: flex;
                    overflow: hidden;
                    position: relative;
                }

                .track-list-column {
                    width: 220px;
                    border-right: 1px solid var(--aether-border);
                    display: flex; flex-direction: column;
                }

                .track-header-strip {
                    height: 120px;
                    padding: 1.25rem;
                    border-bottom: 1px solid var(--aether-border);
                    display: flex; flex-direction: column; gap: 1rem;
                    position: relative;
                }
                .track-id-glow {
                    position: absolute; left: 0; top: 0; width: 3px; height: 100%;
                    opacity: 0.6;
                }
                .track-name { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; color: white; }
                .track-controls-small { display: flex; gap: 0.25rem; }
                .ctrl-btn {
                    width: 24px; height: 24px; font-size: 0.6rem; font-weight: 900;
                    background: rgba(255,255,255,0.05); border: 1px solid var(--aether-border);
                    border-radius: 4px; color: var(--aether-text-muted); cursor: pointer;
                }
                .ctrl-btn.active { background: #ef4444; color: white; border-color: #ef4444; }

                .timeline-view-grid {
                    flex: 1;
                    background: repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.02) 50px);
                    position: relative;
                }
                .timeline-track-lane {
                    height: 120px;
                    border-bottom: 1px solid var(--aether-border);
                    display: flex; align-items: center; padding: 0 1rem;
                }
                .audio-region {
                    height: 60px; width: 80%;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    position: relative;
                    animation: slide-in 0.5s ease-out;
                }
                .region-wave {
                    position: absolute; inset: 0;
                    background: repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.05) 11px);
                }

                .timeline-playhead {
                    position: absolute; top: 0; bottom: 0; width: 2px;
                    background: var(--aether-pink);
                    z-index: 10;
                    box-shadow: 0 0 10px var(--aether-pink);
                }

                .studio-sidebar-controls {
                    display: flex; flex-direction: column; gap: 1.5rem;
                }

                .panel-label {
                    font-size: 0.65rem; font-weight: 950; color: var(--aether-text-muted);
                    text-transform: uppercase; letter-spacing: 0.2em;
                    display: flex; align-items: center; gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }

                .mutation-matrix-panel { padding: 1.5rem; }
                .temp-sliders-advanced { display: flex; flex-direction: column; gap: 1.5rem; }
                .slider-row { display: flex; flex-direction: column; gap: 0.5rem; }
                .s-header { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800; color: white; }
                .s-header b { color: var(--aether-cyan); font-family: monospace; }
                .s-desc { font-size: 0.6rem; color: var(--aether-text-muted); font-weight: 600; line-height: 1.4; }

                .intensity-selector-flat {
                    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;
                    margin-top: 1.5rem;
                }
                .int-option {
                    padding: 0.6rem; background: rgba(255,255,255,0.03);
                    border: 1px solid var(--aether-border); border-radius: 6px;
                    font-size: 0.65rem; font-weight: 900; color: var(--aether-text-muted);
                    cursor: pointer; transition: 0.2s;
                }
                .int-option.active {
                    background: var(--aether-cyan-glow); color: white; border-color: var(--aether-cyan);
                }

                .visualizer-telemetry { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
                .visualizer-bars {
                    height: 100px; display: flex; align-items: flex-end; gap: 4px;
                    margin-bottom: 1.5rem; padding: 0 0.5rem;
                }
                .v-bar {
                    flex: 1; background: linear-gradient(to top, var(--aether-violet), var(--aether-pink));
                    border-radius: 2px;
                    opacity: 0.6;
                    animation: bar-dance 1.5s ease-in-out infinite alternate;
                }

                .tel-feed { display: flex; flex-direction: column; gap: 0.5rem; }
                .tel-row { display: flex; justify-content: space-between; font-size: 0.65rem; font-weight: 800; color: var(--aether-text-muted); }
                .tel-row b { color: #4ade80; }

                .studio-master-footer {
                    height: 100px;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: 16px;
                    display: flex; align-items: center; padding: 0 2rem;
                    backdrop-filter: blur(20px);
                }
                .player-module-core { flex: 1; }

                @keyframes bar-dance {
                    from { height: 20%; }
                    to { height: 80%; }
                }
                @keyframes slide-in {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
        </div>
    )
}
