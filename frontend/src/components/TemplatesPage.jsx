import React, { useState, useEffect } from 'react'
import { 
    LayoutTemplate, Zap, Radio, SlidersHorizontal, 
    Waves, Cpu, Play, Search, Filter, 
    Sparkles, ArrowUpRight, User, Loader2
} from 'lucide-react'

export function TemplatesPage({ onLaunchTemplate }) {
    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/templates')
                const data = await response.json()
                if (data.success) {
                    setTemplates(data.templates)
                }
            } catch (error) {
                console.error("Failed to fetch constellations:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTemplates()
    }, [])

    const filteredTemplates = templates.filter(tpl => 
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="templates-root animate-fade-in">
            {/* Page Header */}
            <header className="templates-header">
                <div className="header-text">
                    <h1 className="header-title">
                        <div className="icon-badge">
                            <LayoutTemplate size={24} />
                        </div>
                        Constellations
                    </h1>
                    <p className="header-desc">
                        Select a pre-configured neural matrix to instantly initialize your creative focus.
                    </p>
                </div>

                <div className="header-actions">
                    <div className="search-bar-container">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Find a Constellation..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="templates-search-input"
                        />
                    </div>
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

            {/* Template Grid */}
            <div className="template-grid-container">
                {loading ? (
                    <div className="loading-state">
                        <Loader2 size={48} className="animate-spin text-cyan" />
                        <p>Initializing Neural Matrices...</p>
                    </div>
                ) : filteredTemplates.length > 0 ? (
                    <div className="templates-grid">
                        {filteredTemplates.map(tpl => (
                            <div key={tpl.id} className="template-card">
                                <div className="template-visual">
                                     <div className="constellation-orb" style={{ background: `radial-gradient(circle, ${tpl.color} 0%, transparent 70%)` }}>
                                        <div className="inner-pulse" style={{ borderColor: tpl.color }}></div>
                                     </div>
                                     <div className="genre-tag" style={{ borderLeft: `2px solid ${tpl.color}` }}>{tpl.genre}</div>
                                </div>

                                <div className="template-info">
                                    <h3 className="template-name">{tpl.name}</h3>
                                    <p className="template-desc">{tpl.description}</p>
                                    
                                    <div className="param-pills">
                                        {tpl.stats.map(stat => (
                                            <span key={stat} className="stat-pill">#{stat}</span>
                                        ))}
                                    </div>

                                    <div className="template-details">
                                        <div className="param-row">
                                            <span className="p-label">SEQ_LEN</span>
                                            <span className="p-val">{tpl.params.seqLength}</span>
                                        </div>
                                        <div className="param-row">
                                            <span className="p-label">FILTER</span>
                                            <span className="p-val">{tpl.params.filterCutoff}Hz</span>
                                        </div>
                                    </div>

                                    <button 
                                        className="aether-btn-primary launch-btn"
                                        onClick={() => onLaunchTemplate(tpl)}
                                    >
                                        Launch Matrix <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Sparkles size={48} className="text-muted" />
                        <h3>No Constellations Found</h3>
                        <p>Adjust your search to find other neural pathways.</p>
                    </div>
                )}
            </div>

            <style>{`
                .templates-root {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 1rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .templates-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .icon-badge {
                    width: 44px;
                    height: 44px;
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: var(--rounded-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--aether-violet);
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
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .search-bar-container {
                    position: relative;
                    width: 300px;
                }

                .templates-search-input {
                    width: 100%;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-full);
                    padding: 0.65rem 1rem 0.65rem 2.5rem;
                    color: white;
                    font-size: 0.875rem;
                    outline: none;
                }

                .search-icon {
                    position: absolute;
                    left: 0.85rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--aether-text-muted);
                }

                .templates-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .template-card {
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .template-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(255,255,255,0.25);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.4);
                }

                .template-visual {
                    height: 180px;
                    background: rgba(0,0,0,0.3);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .constellation-orb {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    filter: blur(20px);
                    opacity: 0.5;
                }

                .inner-pulse {
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px; height: 40px;
                    border: 2px solid white;
                    border-radius: 50%;
                    animation: pulse-ring 2s infinite;
                }

                @keyframes pulse-ring {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }

                .genre-tag {
                    position: absolute;
                    bottom: 1rem; left: 1rem;
                    font-size: 0.65rem; font-weight: 800;
                    text-transform: uppercase;
                    padding-left: 0.75rem;
                    letter-spacing: 0.05em;
                }

                .template-info {
                    padding: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .template-name { font-size: 1.25rem; font-weight: 800; }
                .template-desc { 
                    font-size: 0.875rem; 
                    color: var(--aether-text-muted); 
                    line-height: 1.5;
                    min-height: 60px;
                }

                .param-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .stat-pill { 
                    font-size: 0.65rem; 
                    background: rgba(255,255,255,0.05); 
                    padding: 0.25rem 0.5rem; 
                    border-radius: 4px;
                    color: var(--aether-cyan);
                    font-weight: 700;
                }

                .template-details {
                    background: rgba(255,255,255,0.02);
                    padding: 0.75rem;
                    border-radius: 8px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .param-row { display: flex; flex-direction: column; gap: 0.25rem; }
                .p-label { font-size: 0.6rem; color: var(--aether-text-muted); font-weight: 800; text-transform: uppercase; }
                .p-val { font-size: 0.875rem; font-weight: 700; font-family: monospace; color: white; }

                .launch-btn {
                    margin-top: 0.5rem;
                    width: 100%;
                    padding: 0.85rem;
                    font-size: 0.875rem;
                    font-weight: 800;
                }

                .loading-state, .empty-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    min-height: 300px; gap: 1rem; color: var(--aether-text-muted);
                }

                /* User Profile Mock Port */
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
            `}</style>
        </div>
    )
}
