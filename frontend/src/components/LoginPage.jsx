import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Music2, LogIn } from 'lucide-react'

export function LoginPage({ onBack, onSwitchToSignUp, onSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            onSuccess() 
        }, 2000)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="auth-page-root">
            {/* Background Decor */}
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>

            <div className="auth-container">
                <div className="auth-grid">
                    
                    {/* Left Column - Marketing */}
                    <div className="auth-promo">
                        {/* Back Arrow */}
                        <button onClick={onBack} className="back-btn group">
                            <ArrowLeft size={16} className="group-hover:translate-x-[-4px] transition-transform" />
                            <span>Return to Dimension</span>
                        </button>

                        <div className="promo-main">
                            <div className="promo-logo">
                                <div className="logo-icon-box">
                                    <Music2 size={28} />
                                </div>
                                <span className="logo-brand">AetherMusic</span>
                            </div>

                            <h1 className="promo-headline">
                                Unlock Your <br />
                                <span className="text-gradient">Sonic Potential</span>
                            </h1>
                            <p className="promo-subtext">
                                Access the world's most advanced AI music generation suite. 
                                Your compositions, your control.
                            </p>

                            <div className="promo-features">
                                <div className="p-feature">
                                    <div className="p-feature-icon green"><Music2 size={18} /></div>
                                    <div className="p-feature-info">
                                        <h4>Saved Sessions</h4>
                                        <p>Pick up exactly where you left off</p>
                                    </div>
                                </div>
                                <div className="p-feature">
                                    <div className="p-feature-icon cyan"><LogIn size={18} /></div>
                                    <div className="p-feature-info">
                                        <h4>Neural Presets</h4>
                                        <p>Save your favorite model configurations</p>
                                    </div>
                                </div>
                            </div>

                            <div className="aether-panel testimonial-card">
                                <p className="testimonial-text">
                                    "The synthesis engine is unlike anything I've used. It's not just a tool, it's a collaborator."
                                </p>
                                <div className="testimonial-user">
                                    <div className="user-avatar">A</div>
                                    <div className="user-info">
                                        <span className="user-name">Alex Chen</span>
                                        <span className="user-role">Lead Producer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="auth-form-column">
                        <div className="form-card-wrapper anim-slide-up">
                            <div className="form-header">
                                <h2>Initialize Session</h2>
                                <p>Provide your credentials to enter the studio</p>
                            </div>

                            <div className="aether-panel auth-panel">
                                <form className="auth-form" onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <label className="input-label">Email Address</label>
                                        <div className="input-wrapper">
                                            <Mail size={16} className="field-icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="field-input"
                                                placeholder="user@aether.ai"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Access Token (Password)</label>
                                        <div className="input-wrapper">
                                            <Lock size={16} className="field-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="field-input"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="toggle-visibility"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-extras">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="aether-checkbox"
                                            />
                                            <span>Persist Session</span>
                                        </label>
                                        <button type="button" className="forgot-link">Lost access?</button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`aether-btn-primary auth-submit-btn ${isLoading ? 'loading' : ''}`}
                                    >
                                        {isLoading ? (
                                            <div className="loader-box">
                                                <div className="dot-loader"></div>
                                                <span>Authenticating...</span>
                                            </div>
                                        ) : (
                                            <div className="btn-content">
                                                <LogIn size={18} />
                                                <span>Initialize Node</span>
                                            </div>
                                        )}
                                    </button>
                                </form>

                                <div className="social-divider">
                                    <span>Or sync with</span>
                                </div>

                                <div className="social-sync-group">
                                    <button className="social-sync-btn"><span className="sync-icon">G</span> Google</button>
                                    <button className="social-sync-btn"><span className="sync-icon">X</span> X (Twitter)</button>
                                </div>
                            </div>

                            <div className="auth-footer-links">
                                <p>New entity? <button onClick={onSwitchToSignUp} className="switch-link">Create Identity →</button></p>
                                <p className="security-notice">🔒 End-to-end encrypted neural handshake</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                .auth-page-root {
                    width: 100%;
                    min-height: 100vh;
                    background: var(--aether-void);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 2rem;
                    overflow: hidden;
                }

                .auth-container {
                    width: 100%;
                    max-width: 1200px;
                    z-index: 10;
                }

                .auth-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                @media (min-width: 1024px) {
                    .auth-grid { grid-template-columns: 1fr 450px; }
                }

                /* Left Promo Side */
                .auth-promo {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .back-btn {
                    background: transparent;
                    border: none;
                    color: var(--aether-text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 700;
                    cursor: pointer;
                    width: fit-content;
                }

                .back-btn:hover { color: white; }

                .promo-logo {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .logo-icon-box {
                    width: 52px;
                    height: 52px;
                    background: var(--aether-glass);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--aether-violet);
                    box-shadow: 0 0 20px var(--aether-violet-glow);
                }

                .logo-brand { font-size: 1.5rem; font-weight: 950; letter-spacing: -0.02em; }

                .promo-headline {
                    font-size: clamp(2.5rem, 5vw, 4.5rem);
                    font-weight: 950;
                    line-height: 1;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.04em;
                }

                .promo-subtext {
                    font-size: 1.25rem;
                    color: var(--aether-text-muted);
                    max-width: 500px;
                    margin-bottom: 3rem;
                    line-height: 1.6;
                }

                .promo-features {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                }

                .p-feature {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .p-feature-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: var(--rounded-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--aether-border);
                }

                .p-feature-icon.green { color: #4ade80; background: rgba(74, 222, 128, 0.1); }
                .p-feature-icon.cyan { color: var(--aether-cyan); background: rgba(34, 211, 238, 0.1); }

                .p-feature-info h4 { font-size: 1rem; font-weight: 800; margin-bottom: 0.1rem; }
                .p-feature-info p { font-size: 0.875rem; color: var(--aether-text-muted); }

                .testimonial-card { padding: 2rem; max-width: 500px; }
                .testimonial-text { font-size: 1rem; font-style: italic; color: var(--aether-text); margin-bottom: 1.5rem; line-height: 1.6; }
                .testimonial-user { display: flex; align-items: center; gap: 1rem; }
                .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(to right, var(--aether-violet), var(--aether-pink)); display: flex; align-items: center; justify-content: center; font-weight: 800; }
                .user-info { display: flex; flex-direction: column; }
                .user-name { font-size: 0.875rem; font-weight: 800; }
                .user-role { font-size: 0.7rem; color: var(--aether-text-muted); font-weight: 600; text-transform: uppercase; }

                /* Right Form side */
                .form-card-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-header h2 { font-size: 1.5rem; font-weight: 900; margin-bottom: 0.5rem; color: white; }
                .form-header p { font-size: 0.875rem; color: var(--aether-text-muted); }

                .auth-panel { padding: 2rem; background: rgba(0,0,0,0.5); border-radius: var(--rounded-lg); }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-label { font-size: 0.75rem; font-weight: 800; color: var(--aether-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .field-icon { position: absolute; left: 1rem; color: var(--aether-text-muted); }
                .field-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.75rem;
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    color: white;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all var(--duration-fast);
                }

                .field-input:focus { border-color: var(--aether-violet); box-shadow: 0 0 15px var(--aether-violet-glow); }

                .toggle-visibility {
                    position: absolute;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    color: var(--aether-text-muted);
                    cursor: pointer;
                }

                .form-extras {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--aether-text-muted);
                    cursor: pointer;
                }

                .forgot-link {
                    background: transparent;
                    border: none;
                    color: var(--aether-violet);
                    font-size: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                }

                .auth-submit-btn {
                    padding: 1rem;
                    font-size: 1rem;
                    font-weight: 800;
                }

                .btn-content { display: flex; align-items: center; justify-content: center; gap: 0.75rem; }

                .social-divider {
                    position: relative;
                    text-align: center;
                    margin: 2rem 0;
                }

                .social-divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: var(--aether-border);
                }

                .social-divider span {
                    position: relative;
                    background: #111;
                    padding: 0 1rem;
                    font-size: 0.7rem;
                    color: var(--aether-text-muted);
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .social-sync-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }

                .social-sync-btn {
                    padding: 0.75rem;
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    border-radius: var(--rounded-md);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all var(--duration-fast);
                }

                .social-sync-btn:hover { background: var(--aether-glass-white); border-color: rgba(255,255,255,0.2); }

                .auth-footer-links {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .auth-footer-links p { font-size: 0.875rem; color: var(--aether-text-muted); }

                .switch-link {
                    background: transparent;
                    border: none;
                    color: var(--aether-pink);
                    font-weight: 800;
                    cursor: pointer;
                    font-size: 0.875rem;
                }

                .security-notice { font-size: 0.7rem !important; opacity: 0.6; }

                .gradient-orb {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    border-radius: 50%;
                    filter: blur(140px);
                    opacity: 0.15;
                    pointer-events: none;
                }

                .orb-1 { top: -200px; left: -200px; background: var(--aether-violet); }
                .orb-2 { bottom: -200px; right: -200px; background: var(--aether-cyan); }
            `}</style>
        </div>
    )
}