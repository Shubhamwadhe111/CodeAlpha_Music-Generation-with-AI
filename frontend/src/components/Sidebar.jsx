import React from 'react'
import { 
    FileText, Music, Scissors, Compass, LayoutTemplate, 
    User, LogOut, Settings, Zap, TrendingUp, X, Menu,
    Activity, Cpu, ShieldCheck, Gauge, Layers, Command,
    Globe, Layout
} from 'lucide-react'

export function Sidebar({ 
    currentView, 
    onNavigate, 
    isLoggedIn = false, 
    userEmail = null, 
    onToggleSidebar, 
    isCollapsed = false,
    
    // Neural Explorer Handlers
    onMutate,
    onSync,
    onDiagnostics,
    onTerminal,
    onTurbo,
    onDevMode,
    isTurboActive,
    isDevActive
}) {
    return (
        <aside className={`aether-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Scanline Effect */}
            <div className="sidebar-scanline"></div>

            {/* Neural Core Header */}
            <div className="sidebar-header">
                <div className="core-identity">
                    <div className="core-orb-container">
                        <div className="core-orb neural-pulse-active">
                             <Cpu size={24} className="core-icon" />
                        </div>
                        <div className="core-status-ring"></div>
                    </div>
                    {!isCollapsed && (
                        <div className="core-meta">
                            <h2 className="core-name">Aether_Core</h2>
                            <div className="core-ver">
                                <span className="status-dot"></span>
                                <span>v3.2.0-Stable</span>
                            </div>
                        </div>
                    )}
                </div>
                
                <button onClick={onToggleSidebar} className="sidebar-toggle-btn">
                    {isCollapsed ? <Menu size={18} /> : <X size={18} />}
                </button>
            </div>

            {/* Telemetry Matrix (Mini-Stats) */}
            {!isCollapsed && (
                <div className="sidebar-telemetry">
                    <div className="tel-card">
                        <div className="tel-label">CREATIVE_FLUX</div>
                        <div className="tel-visual">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="tel-bar" style={{ 
                                    height: `${20 + Math.random() * 80}%`,
                                    animationDelay: `${i * 0.05}s`
                                }}></div>
                            ))}
                        </div>
                    </div>
                    <div className="tel-row">
                        <div className="tel-stat">
                            <span className="s-label">SYNC</span>
                            <span className="s-val">98%</span>
                        </div>
                        <div className="tel-stat">
                            <span className="s-label">LAT</span>
                            <span className="s-val">12ms</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Grid (TOOLS ONLY) */}
            <nav className="sidebar-nav">
                {!isCollapsed && <div className="nav-label-small">CORE_SYSTEMS</div>}
                
                <div className="nav-group">
                    {[
                        { id: 'dashboard', label: 'Neural Studio', icon: Activity, color: 'var(--aether-cyan)' },
                        { id: 'music-generator', label: 'Advanced Studio', icon: Music, color: 'var(--aether-violet)' },
                        { id: 'stem-splitter', label: 'Deconstructor', icon: Scissors, color: 'var(--aether-pink)' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
                            style={{ '--accent': item.color }}
                        >
                            <div className="btn-icon">
                                <item.icon size={20} />
                            </div>
                            {!isCollapsed && <span className="btn-label">{item.label}</span>}
                            {currentView === item.id && <div className="btn-glow"></div>}
                        </button>
                    ))}
                </div>

                {!isCollapsed && (
                    <>
                        <div className="nav-label-small">NEURAL_EXPLORER_MATRIX</div>
                        <div className="neural-control-console">
                            <div className="hud-matrix-grid">
                                {[
                                    { id: 'discover', icon: Compass, label: 'NAV_DISC', title: 'Discover' },
                                    { id: 'templates', icon: LayoutTemplate, label: 'NAV_TMPL', title: 'Templates' },
                                    { id: 'mutate', icon: Layers, label: 'GEN_MUT', title: 'Mutate', action: onMutate },
                                    { id: 'dev', icon: Settings, label: 'SYS_DEV', title: 'DevMode', action: onDevMode, active: isDevActive },
                                    { id: 'terminal', icon: Command, label: 'SYS_CMD', title: 'Terminal', action: onTerminal },
                                    { id: 'sync', icon: Activity, label: 'SYS_SYN', title: 'Sync', action: onSync },
                                    { id: 'diag', icon: ShieldCheck, label: 'SYS_DIAG', title: 'Diagnostics', action: onDiagnostics },
                                    { id: 'turbo', icon: Gauge, label: 'SYS_OPT', title: 'Turbo', action: onTurbo, active: isTurboActive }
                                ].map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={item.action || (() => onNavigate(item.id))}
                                        className={`hud-btn ${currentView === item.id || item.active ? 'active' : ''}`}
                                        title={item.title}
                                        onMouseEnter={() => {
                                            const readout = document.getElementById('matrix-readout');
                                            if (readout) readout.innerText = `READY: ${item.label}`;
                                        }}
                                        onMouseLeave={() => {
                                            const readout = document.getElementById('matrix-readout');
                                            if (readout) readout.innerText = 'STATUS: IDLE';
                                        }}
                                    >
                                        <item.icon size={14} />
                                    </button>
                                ))}
                            </div>
                            <div id="matrix-readout" className="matrix-label-readout">
                                STATUS: IDLE
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* Pilot Profile (User Footer) */}
            <div className="sidebar-pilot">
                <div className="pilot-card">
                    <div className="pilot-avatar">
                        <User size={20} />
                        <div className="avatar-shield"><ShieldCheck size={10} /></div>
                    </div>
                    {!isCollapsed && (
                        <div className="pilot-info">
                            <div className="pilot-name">PILOT_001</div>
                            <div className="pilot-rank">High Authority</div>
                            <div className="sync-bar">
                                <div className="sync-fill" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .aether-sidebar {
                    width: 260px;
                    height: 100vh;
                    background: var(--aether-glass);
                    border-right: 1px solid var(--aether-border);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0; top: 0;
                    z-index: 100;
                    transition: width var(--duration-slow) var(--ease-aether);
                    overflow: hidden;
                    backdrop-filter: blur(40px);
                }

                .aether-sidebar.collapsed { width: 80px; }

                .sidebar-scanline {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 2px);
                    pointer-events: none;
                    opacity: 0.3;
                }

                .sidebar-header {
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--aether-border);
                }

                .core-identity { display: flex; align-items: center; gap: 1rem; }
                .core-orb-container { position: relative; }
                .core-orb {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    color: white;
                    position: relative;
                    z-index: 2;
                }

                .core-status-ring {
                    position: absolute;
                    inset: -4px;
                    border: 2px solid var(--aether-violet-glow);
                    border-radius: 16px;
                    opacity: 0.3;
                    animation: spin-slow 12s linear infinite;
                }

                .core-meta { overflow: hidden; white-space: nowrap; }
                .core-name { font-size: 1rem; font-weight: 900; letter-spacing: 0.05em; color: white; }
                .core-ver { 
                    font-size: 0.7rem; color: var(--aether-text-muted); 
                    display: flex; align-items: center; gap: 0.5rem;
                    margin-top: 2px;
                }
                .status-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; }

                .sidebar-toggle-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--aether-border);
                    color: var(--aether-text-muted);
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .sidebar-toggle-btn:hover { color: white; background: rgba(255,255,255,0.1); }

                /* Telemetry Section */
                .sidebar-telemetry {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    border-bottom: 1px solid var(--aether-border);
                }

                .tel-card {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--aether-border);
                    border-radius: 8px;
                    padding: 0.75rem;
                }

                .tel-label { font-size: 0.6rem; font-weight: 800; color: var(--aether-text-muted); margin-bottom: 0.5rem; letter-spacing: 0.1em; }
                .tel-visual { display: flex; align-items: flex-end; gap: 2px; height: 24px; }
                .tel-bar {
                    flex: 1; background: var(--aether-violet);
                    animation: tel-pulse 1s ease-in-out infinite alternate;
                }

                @keyframes tel-pulse { from { opacity: 0.4; } to { opacity: 1; } }

                .tel-row { display: flex; gap: 1rem; }
                .tel-stat { display: flex; flex-direction: column; }
                .s-label { font-size: 0.55rem; color: var(--aether-text-muted); font-weight: 700; }
                .s-val { font-size: 0.875rem; font-weight: 800; color: white; }

                /* Navigation Controls */
                .sidebar-nav {
                    flex: 1;
                    padding: 1.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .nav-label-small { 
                    font-size: 0.65rem; font-weight: 900; 
                    color: rgba(255,255,255,0.2); 
                    margin: 0.5rem 0.5rem 0.25rem;
                    letter-spacing: 0.15em;
                }

                .nav-group { display: flex; flex-direction: column; gap: 0.4rem; }

                .nav-btn {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 0.6rem;
                    background: transparent; border: 1px solid transparent;
                    border-radius: 12px; color: var(--aether-text-muted);
                    cursor: pointer; transition: all 0.3s var(--ease-aether);
                    position: relative; width: 100%; text-align: left;
                }

                .nav-btn:hover { background: rgba(255,255,255,0.03); color: white; }

                .nav-btn.active {
                    background: rgba(255,255,255,0.05);
                    border-color: var(--aether-border);
                    color: white;
                }

                .btn-icon {
                    width: 36px; height: 36px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.2);
                    border-radius: 10px;
                    transition: all 0.3s;
                }

                .nav-btn.active .btn-icon {
                    background: var(--accent);
                    color: white;
                    box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.4);
                }

                .btn-label { font-size: 0.875rem; font-weight: 700; }
                .btn-glow {
                    position: absolute; right: 0.75rem;
                    width: 4px; height: 4px;
                    background: var(--accent);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--accent);
                }

                .action-matrix {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.3rem;
                    padding: 0.2rem;
                }

                .matrix-btn {
                    aspect-ratio: 1;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--aether-border);
                    border-radius: 8px;
                    color: var(--aether-text-muted);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s;
                }
                .matrix-btn:hover, .matrix-btn.active { 
                    background: var(--aether-glass-white); 
                    color: var(--aether-cyan); 
                    border-color: var(--aether-cyan); 
                    box-shadow: 0 0 10px var(--aether-cyan-glow);
                }

                /* Pilot Footer */
                .sidebar-pilot {
                    padding: 1.25rem;
                    border-top: 1px solid var(--aether-border);
                }

                .pilot-card {
                    display: flex; align-items: center; gap: 0.75rem;
                    background: rgba(0,0,0,0.2);
                    padding: 0.75rem;
                    border-radius: 12px;
                    border: 1px solid var(--aether-border);
                }

                .pilot-avatar {
                    position: relative;
                    width: 36px; height: 36px;
                    background: linear-gradient(to bottom, #1e293b, #0f172a);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--aether-text-muted);
                }

                .avatar-shield {
                    position: absolute; bottom: -2px; right: -2px;
                    width: 14px; height: 14px;
                    background: var(--aether-cyan);
                    border-radius: 4px;
                    display: flex; align-items: center; justify-content: center;
                    color: black;
                }

                .pilot-info { overflow: hidden; }
                .pilot-name { font-size: 0.8rem; font-weight: 900; color: white; letter-spacing: 0.05em; }
                .pilot-rank { font-size: 0.6rem; color: var(--aether-cyan); font-weight: 800; text-transform: uppercase; }

                .sync-bar {
                    width: 80px; height: 3px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 2px;
                    margin-top: 0.4rem;
                }
                .sync-fill { height: 100%; background: var(--aether-cyan); border-radius: inherit; }
            `}</style>
        </aside>
    )
}
