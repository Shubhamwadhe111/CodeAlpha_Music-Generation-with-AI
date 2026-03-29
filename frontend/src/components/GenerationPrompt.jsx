import React, { useState } from 'react'
import { Cpu, Terminal, SlidersHorizontal, Zap, Music, Wand2, Sparkles, Clock, Volume2, Mic2, Guitar, Drum, Piano, Headphones } from 'lucide-react'

export function GenerationPrompt({
    isGenerating,
    handleGenerate,
    promptText, setPromptText,
    seqLength, setSeqLength,
    instrument, setInstrument,
    reverb, setReverb,
    delay, setDelay,
    filterCutoff, setFilterCutoff
}) {
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [genre, setGenre] = useState('electronic')
    const [mood, setMood] = useState('energetic')
    const [tempo, setTempo] = useState(120)
    const [key, setKey] = useState('C')
    const [duration, setDuration] = useState(30)
    const [complexity, setComplexity] = useState(5)

    const genres = [
        { id: 'electronic', name: 'Electronic', icon: '🎹', color: 'var(--aether-cyan)' },
        { id: 'classical', name: 'Classical', icon: '🎻', color: 'var(--aether-violet)' },
        { id: 'jazz', name: 'Jazz', icon: '🎷', color: '#f59e0b' },
        { id: 'rock', name: 'Rock', icon: '🎸', color: '#ef4444' },
        { id: 'ambient', name: 'Ambient', icon: '🌊', color: '#10b981' },
        { id: 'hiphop', name: 'Hip Hop', icon: '🎤', color: 'var(--aether-pink)' }
    ]

    const moods = [
        { id: 'energetic', name: 'Energetic', emoji: '⚡' },
        { id: 'calm', name: 'Calm', emoji: '🌙' },
        { id: 'happy', name: 'Happy', emoji: '😊' },
        { id: 'melancholic', name: 'Melancholic', emoji: '🌧️' },
        { id: 'epic', name: 'Epic', emoji: '🔥' },
        { id: 'mysterious', name: 'Mysterious', emoji: '🌌' }
    ]

    return (
        <div className="generation-prompt-root">

            {/* Header */}
            <div className="prompt-header">
                <div className="header-left">
                    <div className="header-icon-box">
                        <Wand2 size={20} className="header-icon" />
                    </div>
                    <div className="header-titles">
                        <h2 className="title-text">AI Music Generator</h2>
                        <div className="status-indicator">
                            <div className="status-dot"></div>
                            <span className="status-label">Model Ready</span>
                        </div>
                    </div>
                </div>
                <div className="model-id">LSTM-512</div>
            </div>

            {/* Genre Selection */}
            <div className="prompt-section">
                <label className="section-label">
                    <Music size={16} />
                    Genre
                </label>
                <div className="genre-grid">
                    {genres.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setGenre(g.id)}
                            className={`genre-btn ${genre === g.id ? 'active' : ''}`}
                            style={{ '--genre-color': g.color }}
                        >
                            <div className="genre-icon">{g.icon}</div>
                            <div className="genre-name">{g.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mood Selection */}
            <div className="prompt-section">
                <label className="section-label">
                    <Sparkles size={16} />
                    Mood
                </label>
                <div className="mood-grid">
                    {moods.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMood(m.id)}
                            className={`mood-btn ${mood === m.id ? 'active' : ''}`}
                        >
                            <div className="mood-emoji">{m.emoji}</div>
                            <div className="mood-name">{m.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Prompt Input */}
            <div className="prompt-section">
                <label className="section-label">
                    <Terminal size={16} />
                    Description (Optional)
                </label>
                <div className="prompt-input-wrapper">
                    <textarea
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        placeholder="Describe your music in detail..."
                        spellCheck="false"
                        className="prompt-textarea"
                    />
                    <div className="input-footer">
                        <span className="footer-tip">AI will enhance your description</span>
                        <span className="footer-counter">{promptText.length}/500</span>
                    </div>
                </div>
            </div>

            {/* Sliders Grid */}
            <div className="controls-row">
                <div className="control-item">
                    <label className="control-label">
                        <Clock size={14} />
                        Tempo: {tempo} BPM
                    </label>
                    <input
                        type="range"
                        min="60"
                        max="180"
                        value={tempo}
                        onChange={(e) => setTempo(e.target.value)}
                        className="aether-range range-purple"
                    />
                </div>

                <div className="control-item">
                    <label className="control-label">
                        <Volume2 size={14} />
                        Duration: {duration}s
                    </label>
                    <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="aether-range range-pink"
                    />
                </div>
            </div>

            {/* Musical Key */}
            <div className="prompt-section">
                <label className="control-label">Musical Key</label>
                <select
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="aether-select"
                >
                    <option value="C">C Major</option>
                    <option value="Cm">C Minor</option>
                    <option value="D">D Major</option>
                    <option value="Dm">D Minor</option>
                    <option value="E">E Major</option>
                    <option value="Em">E Minor</option>
                    <option value="F">F Major</option>
                    <option value="Fm">F Minor</option>
                    <option value="G">G Major</option>
                    <option value="Gm">G Minor</option>
                    <option value="A">A Major</option>
                    <option value="Am">A Minor</option>
                </select>
            </div>

            {/* Complexity */}
            <div className="prompt-section">
                <div className="label-with-value">
                    <label className="control-label">Complexity</label>
                    <span className="value-label">
                        {complexity === 1 ? 'Simple' : complexity <= 3 ? 'Easy' : complexity <= 6 ? 'Medium' : complexity <= 8 ? 'Complex' : 'Very Complex'}
                    </span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="aether-range range-cyan"
                />
            </div>

            {/* Advanced Toggle */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="aether-btn advanced-toggle-btn"
            >
                <SlidersHorizontal size={14} />
                Advanced Settings {showAdvanced ? '▲' : '▼'}
            </button>

            {/* Advanced Panels */}
            {showAdvanced && (
                <div className="advanced-container animate-fade-in">
                    <div className="prompt-section">
                        <label className="control-label">Primary Instrument</label>
                        <select
                            value={instrument}
                            onChange={(e) => setInstrument(e.target.value)}
                            className="aether-select compact"
                        >
                            <option value="acoustic_grand_piano">🎹 Acoustic Grand Piano</option>
                            <option value="electric_piano_1">⚡ Electric Piano</option>
                            <option value="pad_2_warm">🌊 Warm Pad</option>
                            <option value="choir_aahs">👥 Choir</option>
                            <option value="synth_lead">🎛️ Synth Lead</option>
                            <option value="acoustic_guitar">🎸 Acoustic Guitar</option>
                        </select>
                    </div>

                    <div className="label-with-value compact">
                        <label className="control-label">Reverb</label>
                        <span className="value-label">{Math.round(reverb * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={reverb}
                        onChange={(e) => setReverb(e.target.value)}
                        className="aether-range range-purple compact"
                    />

                    <div className="label-with-value compact">
                        <label className="control-label">Note Density</label>
                        <span className="value-label">{seqLength}</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="400"
                        step="10"
                        value={seqLength}
                        onChange={(e) => setSeqLength(e.target.value)}
                        className="aether-range range-pink compact"
                    />
                </div>
            )}

            {/* Generate Button Container */}
            <div className="generate-footer">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`aether-btn aether-btn-primary main-generate-btn ${isGenerating ? 'loading' : ''}`}
                >
                    {isGenerating ? (
                        <div className="loader-box">
                            <div className="dot-loader"></div>
                            <span>Synthesizing...</span>
                        </div>
                    ) : (
                        <>
                            <Zap size={20} />
                            Generate Music
                            <div className="btn-shimmer"></div>
                        </>
                    )}
                </button>
                <p className="footer-meta">
                    Unique {genre} track in {key} @ {tempo} BPM
                </p>
            </div>

            <style>{`
                .generation-prompt-root {
                    width: 100%;
                    height: 100%;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    overflow-y: auto;
                }

                /* Custom Scrollbar for the Panel */
                .generation-prompt-root::-webkit-scrollbar {
                  width: 4px;
                }
                .generation-prompt-root::-webkit-scrollbar-thumb {
                  background: var(--aether-border);
                  border-radius: 2px;
                }

                .prompt-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--aether-border);
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .header-icon-box {
                    width: 40px;
                    height: 40px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid var(--aether-violet-glow);
                    border-radius: var(--rounded-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--aether-violet);
                }

                .title-text {
                    font-size: 1rem;
                    font-weight: 800;
                    color: white;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                }

                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: #4ade80;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #4ade80;
                }

                .status-label {
                    font-size: 0.7rem;
                    color: #4ade80;
                    font-weight: 700;
                }

                .model-id {
                    font-family: monospace;
                    font-size: 0.7rem;
                    color: var(--aether-text-muted);
                }

                .prompt-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .section-label {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: var(--aether-text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .genre-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                }

                .genre-btn {
                    padding: 0.75rem 0.5rem;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    cursor: pointer;
                    transition: all var(--duration-fast);
                    color: var(--aether-text-muted);
                }

                .genre-btn:hover {
                    background: var(--aether-glass-white);
                    border-color: rgba(255,255,255,0.2);
                }

                .genre-btn.active {
                    background: linear-gradient(135deg, var(--genre-color), transparent);
                    border-color: var(--genre-color);
                    color: white;
                    box-shadow: 0 0 15px var(--genre-color);
                }

                .genre-icon { font-size: 1.25rem; margin-bottom: 0.25rem; }
                .genre-name { font-size: 0.7rem; font-weight: 700; }

                .mood-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.5rem;
                }

                .mood-btn {
                    padding: 0.65rem 0.5rem;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-sm);
                    cursor: pointer;
                    transition: all var(--duration-fast);
                }

                .mood-btn:hover { border-color: rgba(255,255,255,0.2); }

                .mood-btn.active {
                    background: rgba(236, 72, 153, 0.1);
                    border-color: var(--aether-pink);
                    box-shadow: 0 0 10px var(--aether-pink-glow);
                }

                .mood-emoji { font-size: 1rem; margin-bottom: 0.15rem; }
                .mood-name { font-size: 0.7rem; color: var(--aether-text-muted); font-weight: 600; }
                .mood-btn.active .mood-name { color: white; }

                .prompt-input-wrapper {
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    overflow: hidden;
                    transition: all var(--duration-fast);
                }

                .prompt-input-wrapper:focus-within {
                    border-color: var(--aether-violet);
                    box-shadow: 0 0 15px var(--aether-violet-glow);
                }

                .prompt-textarea {
                    width: 100%;
                    height: 80px;
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 1rem;
                    font-size: 0.875rem;
                    resize: none;
                    outline: none;
                }

                .input-footer {
                    padding: 0.5rem 1rem;
                    background: rgba(255,255,255,0.02);
                    border-top: 1px solid var(--aether-border);
                    display: flex;
                    justify-content: space-between;
                }

                .footer-tip, .footer-counter {
                    font-size: 0.65rem;
                    color: var(--aether-text-muted);
                }

                .controls-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .control-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .control-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--aether-text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                }

                .label-with-value {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.25rem;
                }

                .value-label {
                    font-size: 0.7rem;
                    font-family: monospace;
                    color: var(--aether-violet);
                }

                .aether-range {
                    width: 100%;
                    height: 4px;
                    background: var(--aether-glass-white);
                    border-radius: 2px;
                    appearance: none;
                    cursor: pointer;
                }

                .aether-range::-webkit-slider-thumb {
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                }

                .range-purple::-webkit-slider-thumb { background: var(--aether-violet); }
                .range-pink::-webkit-slider-thumb { background: var(--aether-pink); }
                .range-cyan::-webkit-slider-thumb { background: var(--aether-cyan); }

                .aether-select {
                    width: 100%;
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    color: white;
                    padding: 0.75rem;
                    border-radius: var(--rounded-md);
                    font-size: 0.875rem;
                    outline: none;
                    cursor: pointer;
                }

                .aether-select:focus { border-color: var(--aether-violet); }

                .advanced-toggle-btn {
                    padding: 0.5rem;
                    font-size: 0.7rem;
                    color: var(--aether-text-muted);
                }

                .advanced-container {
                    padding: 1rem;
                    background: rgba(139, 92, 246, 0.05);
                    border: 1px solid var(--aether-violet-glow);
                    border-radius: var(--rounded-md);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .generate-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .main-generate-btn {
                    padding: 1.25rem;
                    font-size: 1.125rem;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }

                .main-generate-btn.loading {
                    background: var(--aether-glass);
                    color: var(--aether-text-muted);
                    cursor: not-allowed;
                }

                .loader-box {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .dot-loader {
                    width: 16px;
                    height: 16px;
                    border: 3px solid var(--aether-border);
                    border-top-color: var(--aether-violet);
                    border-radius: 50%;
                    animation: spin-slow 1s linear infinite;
                }

                .btn-shimmer {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transform: translateX(-100%);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }

                .footer-meta {
                    font-size: 0.65rem;
                    text-align: center;
                    color: var(--aether-text-muted);
                    font-weight: 500;
                }
            `}</style>
        </div>
    )
}
