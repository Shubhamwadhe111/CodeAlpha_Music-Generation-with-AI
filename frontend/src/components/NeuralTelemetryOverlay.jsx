import React, { useEffect, useState } from 'react'
import { Activity, Cpu, Database, Zap } from 'lucide-react'

export function NeuralTelemetryOverlay() {
    const [stats, setStats] = useState({
        inference: 8,
        vram: 1.2,
        nodes: 4200,
        fidelity: 98
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                inference: 8 + Math.random() * 2,
                vram: 1.2 + Math.random() * 0.1,
                nodes: 4200 + Math.floor(Math.random() * 50),
                fidelity: 97 + Math.random() * 2
            }))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="neural-telemetry-overlay">
            <div className="telemetry-header">
                <div className="header-label">SYSTEM_TELEMETRY</div>
                <div className="header-status">LIVE</div>
            </div>
            
            <div className="telemetry-grid">
                <div className="tel-stat-item">
                    <div className="tel-icon-box"><Zap size={14} /></div>
                    <div className="tel-data">
                        <span>INFERENCE</span>
                        <b>{stats.inference.toFixed(1)}ms</b>
                    </div>
                </div>
                <div className="tel-stat-item">
                    <div className="tel-icon-box"><Database size={14} /></div>
                    <div className="tel-data">
                        <span>VRAM_ALLOC</span>
                        <b>{stats.vram.toFixed(2)}GB</b>
                    </div>
                </div>
                <div className="tel-stat-item">
                    <div className="tel-icon-box"><Cpu size={14} /></div>
                    <div className="tel-data">
                        <span>CORE_NODES</span>
                        <b>{(stats.nodes / 1000).toFixed(1)}k</b>
                    </div>
                </div>
                <div className="tel-stat-item">
                    <div className="tel-icon-box"><Activity size={14} /></div>
                    <div className="tel-data">
                        <span>FIDELITY</span>
                        <b>{stats.fidelity.toFixed(1)}%</b>
                    </div>
                </div>
            </div>

            <div className="telemetry-footer">
                <div className="tel-pulse"></div>
                <span>KERNEL_STABLE</span>
            </div>

            <style>{`
                .neural-telemetry-overlay {
                    position: fixed;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 240px;
                    background: rgba(10, 10, 20, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--aether-border);
                    border-radius: 16px;
                    padding: 1.25rem;
                    z-index: 5000;
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                    animation: slide-in-top 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .telemetry-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 1.5rem; border-bottom: 1px solid var(--aether-border);
                    padding-bottom: 0.75rem;
                }
                .header-label { font-size: 0.65rem; font-weight: 950; letter-spacing: 0.1em; color: var(--aether-text-muted); }
                .header-status { font-size: 0.6rem; font-weight: 900; color: #4ade80; background: rgba(74, 222, 128, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px; }

                .telemetry-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
                .tel-stat-item { display: flex; align-items: center; gap: 1rem; }
                .tel-icon-box { width: 32px; height: 32px; background: rgba(255,255,255,0.03); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--aether-cyan); }
                .tel-data { display: flex; flex-direction: column; }
                .tel-data span { font-size: 0.55rem; font-weight: 800; color: var(--aether-text-muted); text-transform: uppercase; }
                .tel-data b { font-size: 0.9rem; font-weight: 900; color: white; font-family: monospace; }

                .telemetry-footer {
                    margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid var(--aether-border);
                    display: flex; align-items: center; gap: 0.5rem; font-size: 0.6rem; font-weight: 800; color: var(--aether-text-muted);
                }
                .tel-pulse { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; animation: blink 2s infinite; }

                @keyframes slide-in-top {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
            `}</style>
        </div>
    )
}
