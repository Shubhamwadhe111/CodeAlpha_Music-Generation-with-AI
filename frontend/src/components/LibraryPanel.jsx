import React from 'react'
import { Disc3, Download, Play } from 'lucide-react'

export function LibraryPanel({ history }) {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="aether-panel library-panel-root animate-fade-in">
            <h3 className="library-title">
                <Disc3 size={20} className="spinning-icon" />
                SYNTHESIS LOG
            </h3>

            <div className="library-list">
                {history.map((item, idx) => {
                    // Extract numerical index for display if possible, or just use chronological order
                    const displayIdx = history.length - idx;
                    return (
                        <div key={idx} className="library-item group">
                            <div className="item-left">
                                <div className="item-index">#{displayIdx}</div>
                                <div className="item-info">
                                    <h4 className="item-name">{item.name}</h4>
                                    <div className="item-meta">
                                        <span className="meta-tag">{item.notes} Nodes</span>
                                        <span className="meta-sep">|</span>
                                        <span className="meta-tag">{item.duration} Length</span>
                                    </div>
                                </div>
                            </div>

                            <div className="item-actions">
                                <a
                                    href={item.data}
                                    download={`${item.name.replace(/ /g, '_')}.mid`}
                                    className="aether-btn item-btn"
                                    title="Download MIDI"
                                >
                                    <Download size={16} />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .library-panel-root {
                    width: 100%;
                    margin-top: 3rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                }

                .library-title {
                    font-size: 1.25rem;
                    font-weight: 950;
                    letter-spacing: 0.05em;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }

                .spinning-icon {
                    color: var(--aether-text-muted);
                    animation: spin-slow 10s linear infinite;
                }

                .library-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .library-item {
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all var(--duration-fast);
                    cursor: pointer;
                }

                .library-item:hover {
                    background: var(--aether-glass-white);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateX(4px);
                }

                .item-left {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                }

                .item-index {
                    width: 36px;
                    height: 36px;
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: monospace;
                    font-size: 0.75rem;
                    color: var(--aether-text-muted);
                    font-weight: 700;
                }

                .item-info {
                    display: flex;
                    flex-direction: column;
                }

                .item-name {
                    font-size: 1rem;
                    font-weight: 800;
                    color: white;
                }

                .item-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-top: 0.25rem;
                }

                .meta-tag {
                    font-size: 0.7rem;
                    color: var(--aether-text-muted);
                    font-family: monospace;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .meta-sep {
                    color: rgba(255, 255, 255, 0.1);
                }

                .item-actions {
                    opacity: 0;
                    transform: translateX(10px);
                    transition: all var(--duration-fast);
                }

                .library-item:hover .item-actions {
                    opacity: 1;
                    transform: translateX(0);
                }

                .item-btn {
                    padding: 0.5rem;
                    border-radius: var(--rounded-sm);
                }

                .item-btn:hover {
                    background: white;
                    color: black;
                }
            `}</style>
        </div>
    )
}
