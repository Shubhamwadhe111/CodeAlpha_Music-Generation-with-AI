import React from 'react'
import { Sparkles, ArrowRight, Music2, Cpu, Zap, Brain, Activity, UserPlus } from 'lucide-react'

export function HomePage({ onLaunch, onSignUp }) {
    return (
        <div className="aether-homepage">
            
            {/* --- NEURAL MESH BACKDROP --- */}
            <div className="neural-mesh-container">
                <div className="mesh-grid"></div>
                <div className="mesh-glow"></div>
                <svg className="node-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <circle cx="20" cy="30" r="0.5" fill="var(--aether-violet)" opacity="0.5">
                        <animate attributeName="r" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="70" r="0.5" fill="var(--aether-cyan)" opacity="0.5">
                        <animate attributeName="r" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <line x1="20" y1="30" x2="80" y2="70" stroke="var(--aether-border)" strokeWidth="0.1" strokeDasharray="2,2" />
                </svg>
            </div>

            {/* Top Navigation Bar */}
            <div className="home-top-nav glass-header">
                <div className="nav-container">
                    <div className="home-logo">
                        <div className="logo-box">
                            <Music2 size={24} className="logo-icon" />
                        </div>
                        <div className="logo-text-block">
                           <span className="logo-text">AetherMusic</span>
                           <span className="logo-tag">NEURAL_STUDIO</span>
                        </div>
                    </div>
                    
                    <div className="home_nav_actions" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
                            <a href="#features" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--aether-text-muted)' }}>Features</a>
                            <a href="#tech" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--aether-text-muted)' }}>Architecture</a>
                        </div>
                        <button onClick={onSignUp} className="aether-btn home-signup-btn">
                            <UserPlus size={16} />
                            Initialize Pilot
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="home-hero-section">
                <div className="hero-grid-layout">
                    <div className="hero-text-content">
                        {/* Micro-label */}
                        <div className="hero-badge glass-pill">
                            <div className="badge-dot pulse-node"></div>
                            <Sparkles size={16} className="badge-icon" />
                            <span className="badge-text">v2.4 Neural Genesis Online</span>
                        </div>

                        {/* Headline */}
                        <h1 className="hero-title">
                            Infinite Harmony<br />
                            <span className="text-gradient-vibrant">Through AI</span>
                        </h1>

                        {/* Sub-headline */}
                        <p className="hero-subtitle">
                            Harness advanced deep learning to synthesize professional-grade music. 
                            From cinematic soundscapes to electronic pulses, 
                            <span className="text-highlight"> the algorithm is your orchestra.</span>
                        </p>

                        {/* CTA Group */}
                        <div className="hero-actions">
                            <button onClick={onLaunch} className="aether-btn aether-btn-primary hero-launch-btn">
                                <Zap size={24} />
                                Start Creating Free
                                <ArrowRight size={24} className="launch-arrow" />
                            </button>
                            <button className="aether-btn home-demo-btn glass-pill">
                                Watch Dev Demo
                            </button>
                        </div>

                        {/* Live Ticker */}
                        <div className="live-ticker">
                            <Activity size={12} className="ticker-icon" />
                            <span>CURRENT_FLUX: 1.1x</span>
                            <span className="ticker-sep">|</span>
                            <span>ACTIVE_PILOTS: 1,248</span>
                        </div>
                    </div>

                    <div className="hero-visual-content">
                        <div className="studio-preview-card perspective-tilt aether-panel">
                            <div className="preview-top">
                                <div className="dot-group"><span></span><span></span><span></span></div>
                                <div className="preview-title">AETHER_GENERATOR_V2</div>
                            </div>
                            <div className="preview-body">
                                <div className="wave-bars">
                                    {[1,2,3,4,5,6,7,8].map(i => (
                                        <div key={i} className="wave-bar" style={{ height: `${Math.random() * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="home-stats-refined">
                    {[
                        { val: '1.2M', lab: 'Neural Neurons', color: 'violet' },
                        { val: '48Khz', lab: 'Synth Depth', color: 'cyan' },
                        { val: '<10ms', lab: 'Inference Latency', color: 'pink' }
                    ].map((s, i) => (
                        <div key={i} className="stat-card-refined glass-pill">
                            <div className={`stat-v ${s.color}`}>{s.val}</div>
                            <div className="stat-l">{s.lab}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Neural Architecture Section */}
            <div id="tech" className="neural-spine-section">
                <div className="section-header-centered">
                    <h2 className="section-title-refined">Neural Architecture</h2>
                    <p className="section-subtitle-refined">The 4-layer stack that powers every melody.</p>
                </div>

                <div className="spine-grid">
                    {[
                        { title: 'The Input Matrix', desc: 'Raw MIDI datasets parsed into semantic musical tokens.', icon: Brain, color: 'violet' },
                        { title: 'LSTM Layers', desc: 'Predicting the next harmonic step based on temporal memory.', icon: Cpu, color: 'cyan' },
                        { title: 'Harmony Engine', desc: 'Real-time validation against rules of music theory.', icon: Sparkles, color: 'pink' },
                        { title: 'Neural Synthesis', desc: 'Rendering high-fidelity MIDI and audio through JS AudioNodes.', icon: Zap, color: 'green' }
                    ].map((step, i) => (
                        <div key={i} className="spine-card aether-panel">
                            <div className={`spine-icon-box ${step.color}`}>
                                <step.icon size={24} />
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Musical Constellations (Genres) */}
            <div id="features" className="constellations-section">
                <div className="section-header-centered">
                    <h2 className="section-title-refined">Musical Constellations</h2>
                    <p className="section-subtitle-refined">Explore pre-trained neural pathing for major genres.</p>
                </div>

                <div className="constellation-grid">
                    {[
                        { name: 'Digital Dusk', tag: 'Cyberpunk / Dark', color: '#8b5cf6' },
                        { name: 'Solaris', tag: 'Orchestral / Zen', color: '#06b6d4' },
                        { name: 'Neon Glitch', tag: 'Retro / Synth', color: '#ec4899' },
                        { name: 'Deep Void', tag: 'Ambient / Drone', color: '#ef4444' }
                    ].map((c, i) => (
                        <div key={i} className="genre-card glass-pill" style={{ '--accent': c.color }}>
                            <div className="genre-glow" style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 100% 0%, ${c.color}, transparent 60%)`, opacity: 0.1 }}></div>
                            <div className="genre-content">
                                <h3>{c.name}</h3>
                                <span>{c.tag}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className="final-genesis-section">
                <div className="genesis-panel aether-panel">
                    <div className="genesis-grid-lines"></div>
                    <div className="genesis-content">
                        <h2>Ready to Initialise?</h2>
                        <p>Join the thousands of pilots generating music in the cloud.</p>
                        <button onClick={onLaunch} className="aether-btn aether-btn-primary hero-launch-btn">
                            <Zap size={24} />
                            Boot Studio Now
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .aether-homepage {
                    width: 100%;
                    min-height: 100vh;
                    color: white;
                    background: transparent;
                }

                .home-top-nav {
                    position: sticky; top: 0; z-index: 1000;
                    padding: 1rem 1.5rem;
                }
                .glass-header {
                    background: rgba(5,5,10,0.4);
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid var(--aether-border);
                }

                .nav-container {
                    max-width: 1300px;
                    margin: 0 auto;
                    display: flex; justify-content: space-between; align-items: center;
                }

                .logo-text-block { display: flex; flex-direction: column; }
                .logo-text { font-size: 1.15rem; font-weight: 900; letter-spacing: -0.02em; line-height: 1; }
                .logo-tag { font-size: 0.6rem; color: var(--aether-cyan); font-weight: 800; letter-spacing: 0.2em; opacity: 0.8; margin-top: 0.2rem; }

                .home-hero-section {
                    max-width: 1300px; margin: 0 auto;
                    padding: 8rem 2rem 4rem;
                }

                .hero-grid-layout {
                    display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center;
                }

                .hero-badge {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.5rem 1rem; margin-bottom: 2rem;
                }
                .badge-text { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--aether-violet); }

                .hero-title {
                    font-size: clamp(3rem, 6vw, 6rem);
                    font-weight: 950; line-height: 0.95; letter-spacing: -0.04em;
                    margin-bottom: 2rem;
                }

                .hero-subtitle {
                    font-size: 1.25rem; color: var(--aether-text-muted);
                    max-width: 600px; margin-bottom: 3rem; line-height: 1.5;
                }

                .live-ticker {
                    display: flex; align-items: center; gap: 1rem;
                    margin-top: 4rem; padding: 0.75rem 1.25rem;
                    background: rgba(255,255,255,0.02); border-radius: 8px;
                    font-family: monospace; font-size: 0.75rem; color: var(--aether-cyan);
                }

                .studio-preview-card {
                    height: 340px; border-radius: 24px;
                    background: rgba(10,10,20,0.8) !important;
                    display: flex; flex-direction: column; overflow: hidden;
                }
                .preview-top {
                    padding: 1rem; background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid var(--aether-border);
                    display: flex; align-items: center; gap: 1rem;
                }
                .dot-group { display: flex; gap: 0.4rem; }
                .dot-group span { width: 8px; height: 8px; border-radius: 50%; background: var(--aether-border); }
                .preview-title { font-size: 0.65rem; font-weight: 900; opacity: 0.5; letter-spacing: 0.1em; }

                .preview-body { flex:1; display:flex; align-items:center; justify-content:center; padding: 2rem; }
                .wave-bars { display:flex; gap: 0.5rem; height: 60px; align-items: center; }
                .wave-bar { width: 6px; background: var(--aether-cyan); border-radius: 4px; animation: wave-grow 1s ease-in-out infinite alternate; }

                .home-stats-refined {
                    display: flex; gap: 4rem; margin-top: 6rem; border-top: 1px solid var(--aether-border); padding-top: 3rem;
                }
                .stat-card-refined { padding: 1rem 2rem; }
                .stat-v { font-size: 2.5rem; font-weight: 950; line-height: 1; }
                .stat-v.violet { color: var(--aether-violet); }
                .stat-v.cyan { color: var(--aether-cyan); }
                .stat-v.pink { color: var(--aether-pink); }
                .stat-l { font-size: 0.75rem; font-weight: 800; color: var(--aether-text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; }

                .neural-spine-section { max-width: 1300px; margin: 8rem auto; padding: 0 2rem; }
                .section-header-centered { text-align: center; margin-bottom: 5rem; }
                .section-title-refined { font-size: 3.5rem; font-weight: 950; letter-spacing: -0.04em; margin-bottom: 1rem; }
                .section-subtitle-refined { font-size: 1.1rem; color: var(--aether-text-muted); }

                .spine-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
                .spine-card { padding: 2.5rem; }
                .spine-icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
                .spine-icon-box.violet { background: rgba(139, 92, 246, 0.1); color: var(--aether-violet); }
                .spine-icon-box.cyan { background: rgba(34, 211, 238, 0.1); color: var(--aether-cyan); }
                .spine-icon-box.pink { background: rgba(236, 72, 153, 0.1); color: var(--aether-pink); }
                .spine-icon-box.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                .constellations-section { max-width: 1300px; margin: 8rem auto; padding: 0 2rem; }
                .constellation-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.1rem; }
                
                .genre-card {
                    height: 240px; position: relative; overflow: hidden; padding: 2rem;
                    display: flex; align-items: flex-end; cursor: pointer; border: 1px solid var(--aether-border);
                }
                .genre-card:hover { border-color: var(--aether-violet-glow); transform: translateY(-5px); transition: all 0.3s; }
                .genre-content h3 { font-size: 1.25rem; font-weight: 900; margin-bottom: 0.25rem; position: relative; z-index: 10; }
                .genre-content span { font-size: 0.7rem; font-weight: 700; color: var(--aether-text-muted); text-transform: uppercase; position: relative; z-index: 10; }

                .final-genesis-section { max-width: 1300px; margin: 10rem auto; padding: 0 2rem; }
                .genesis-panel {
                    height: 400px; border-radius: 40px; position: relative; overflow: hidden;
                    display: flex; align-items: center; justify-content: center; text-align: center;
                }
                .genesis-grid-lines {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(var(--aether-violet-glow) 1px, transparent 1px);
                    background-size: 40px 40px; opacity: 0.2;
                }
                .genesis-content h2 { font-size: 3.5rem; font-weight: 950; letter-spacing: -0.04em; margin-bottom: 1rem; position: relative; z-index: 10; }
                .genesis-content p { color: var(--aether-text-muted); margin-bottom: 3rem; position: relative; z-index: 10; }

                @keyframes wave-grow {
                    from { transform: scaleY(0.4); opacity: 0.6; }
                    to { transform: scaleY(1.2); opacity: 1; }
                }

                @media (max-width: 1024px) {
                    .hero-grid-layout { grid-template-columns: 1fr; text-align: center; }
                    .hero-visual-content { display: none; }
                    .hero-text-content { display: flex; flex-direction: column; align-items: center; }
                    .constellation-grid { grid-template-columns: repeat(2, 1fr); }
                }

                .badge-dot { width: 8px; height: 8px; background: var(--aether-violet); border-radius: 50%; }
                .pulse-node { animation: pulse 2s infinite; }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    )
}
