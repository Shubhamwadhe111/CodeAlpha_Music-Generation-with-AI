import React from 'react'
import { Activity, Database, Network, Cpu } from 'lucide-react'

export function TelemetryPanel({ activeNotesCount, isGenerating, audioData = [] }) {
    const bars = audioData.slice(0, 24); 
    return (
        <div className="telemetry-panel-root">
            <div className="telemetry-grid">

                {/* Node Status */}
                <div className="aether-panel telemetry-card">
                    <Network size={24} className={`telemetry-icon ${isGenerating ? 'active spinning' : 'inactive'}`} />
                    <span className="telemetry-label">LSTM Nodes</span>
                    <span className="telemetry-value">3x256</span>
                </div>

                {/* Database State */}
                <div className="aether-panel telemetry-card">
                    <Database size={24} className="telemetry-icon violet" />
                    <span className="telemetry-label">Corpus</span>
                    <span className="telemetry-value">Bach Chorale</span>
                </div>

                {/* Network Activity */}
                <div className="aether-panel telemetry-card">
                    <Activity size={24} className={`telemetry-icon ${activeNotesCount > 0 ? 'success pulsing' : 'inactive'}`} />
                    <span className="telemetry-label">Polyphony</span>
                    <span className="telemetry-value">{activeNotesCount}</span>
                </div>

                {/* Engine Status */}
                <div className="aether-panel telemetry-card">
                    <Cpu size={24} className={`telemetry-icon ${isGenerating ? 'active' : 'success'}`} />
                    <span className="telemetry-label">Engine</span>
                    <span className={`telemetry-value ${isGenerating ? 'active' : 'success'}`}>
                        {isGenerating ? 'SYNTH' : 'STABLE'}
                    </span>
                </div>

            </div>

            {/* Realtime Equalizer */}
            <div className="aether-panel equalizer-container">
                {bars.length > 0 ? bars.map((val, i) => {
                    const height = Math.max(4, (val / 255) * 100);
                    return (
                        <div
                            key={i}
                            className="equalizer-bar"
                            style={{ 
                                height: `${height}%`, 
                                opacity: 0.3 + (val / 255) * 0.7 
                            }}
                        ></div>
                    )
                }) : (
                    <div className="equalizer-empty">
                        AWAITING AUDIO STREAM...
                    </div>
                )}
            </div>

            <style>{`
                .telemetry-panel-root {
                    width: 100%;
                }

                .telemetry-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 2rem;
                }

                @media (min-width: 768px) {
                    .telemetry-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .telemetry-card {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.4);
                }

                .telemetry-icon {
                    margin-bottom: 0.75rem;
                    color: var(--aether-text-muted);
                    transition: all var(--duration-fast);
                }

                .telemetry-icon.active { color: var(--aether-cyan); }
                .telemetry-icon.violet { color: var(--aether-violet); }
                .telemetry-icon.success { color: #4ade80; }
                .telemetry-icon.inactive { opacity: 0.5; }

                .telemetry-icon.spinning { animation: spin-slow 4s linear infinite; }
                .telemetry-icon.pulsing { animation: telemetry-pulse 1.5s ease-in-out infinite; }

                .telemetry-label {
                    font-size: 0.65rem;
                    color: var(--aether-text-muted);
                    font-family: monospace;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 0.25rem;
                }

                .telemetry-value {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: white;
                }

                .telemetry-value.active { color: var(--aether-cyan); }
                .telemetry-value.success { color: #4ade80; }

                .equalizer-container {
                    width: 100%;
                    height: 96px;
                    margin-top: 1rem;
                    padding: 1rem;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 3px;
                    background: rgba(0, 0, 0, 0.4);
                }

                .equalizer-bar {
                    flex: 1;
                    background: linear-gradient(to top, var(--aether-violet), var(--aether-cyan));
                    border-radius: 2px 2px 0 0;
                    transition: height 0.1s ease-out;
                }

                .equalizer-empty {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    color: var(--aether-text-muted);
                    font-family: monospace;
                    letter-spacing: 0.1em;
                }

                @keyframes telemetry-pulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.6; }
                }
            `}</style>
        </div>
    )
}
