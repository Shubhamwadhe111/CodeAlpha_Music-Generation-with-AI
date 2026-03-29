import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Music2, Sparkles } from 'lucide-react'

export function SignUpPage({ onBack, onSwitchToLogin, onSuccess }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
                                Create the <br />
                                <span className="text-gradient">Impossible</span>
                            </h1>
                            <p className="promo-subtext">
                                Join 10,000+ creators who use AetherMusic to break musical boundaries. 
                                Secure your unique neural node today.
                            </p>

                            <div className="promo-features compact">
                                <div className="p-feature">
                                    <div className="p-feature-icon violet"><Sparkles size={18} /></div>
                                    <div className="p-feature-info">
                                        <h4>AI Genesis</h4>
                                        <p>Generate unique patterns in seconds</p>
                                    </div>
                                </div>
                                <div className="p-feature">
                                    <div className="p-feature-icon pink"><User size={18} /></div>
                                    <div className="p-feature-info">
                                        <h4>Shared Workspace</h4>
                                        <p>Collaborate across the multi-verse</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Stats Grid */}
                            <div className="promo-stats-grid">
                                <div className="promo-stat">
                                    <span className="stat-num">50K+</span>
                                    <span className="stat-desc">Tracks</span>
                                </div>
                                <div className="promo-stat">
                                    <span className="stat-num">99%</span>
                                    <span className="stat-desc">Uptime</span>
                                </div>
                                <div className="promo-stat">
                                    <span className="stat-num">24/7</span>
                                    <span className="stat-desc">Live</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="auth-form-column">
                        <div className="form-card-wrapper anim-slide-up">
                            <div className="form-header">
                                <h2>Establish Identity</h2>
                                <p>Create your personal neural node</p>
                            </div>

                            <div className="aether-panel auth-panel">
                                <form className="auth-form" onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <label className="input-label">Identity Name</label>
                                        <div className="input-wrapper">
                                            <User size={16} className="field-icon" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="field-input"
                                                placeholder="Satoshi Nakamoto"
                                            />
                                        </div>
                                    </div>

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

                                    <div className="input-group">
                                        <label className="input-label">Confirm Token</label>
                                        <div className="input-wrapper">
                                            <Lock size={16} className="field-icon" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                className="field-input"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="toggle-visibility"
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-extras">
                                        <label className="checkbox-label">
                                            <input type="checkbox" required className="aether-checkbox" />
                                            <span>Accept Protocol Terms</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`aether-btn-primary auth-submit-btn ${isLoading ? 'loading' : ''}`}
                                    >
                                        {isLoading ? (
                                            <div className="loader-box">
                                                <div className="dot-loader"></div>
                                                <span>Establishing...</span>
                                            </div>
                                        ) : (
                                            <div className="btn-content">
                                                <Sparkles size={18} />
                                                <span>Initialize Identity</span>
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
                                <p>Already registered? <button onClick={onSwitchToLogin} className="switch-link">Sign In here →</button></p>
                                <p className="security-notice">🔒 All neural data is strictly confidential</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
                /* Most styles shared with Login via index.css but keeping specific overrides here */
                
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

                .auth-container { width: 100%; max-width: 1200px; z-index: 10; }

                .auth-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                @media (min-width: 1024px) {
                    .auth-grid { grid-template-columns: 1fr 450px; }
                }

                .auth-promo { display: flex; flex-direction: column; gap: 2rem; }
                .back-btn { background: transparent; border: none; color: var(--aether-text-muted); display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 700; cursor: pointer; width: fit-content; }
                .promo-logo { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .logo-icon-box { width: 44px; height: 44px; background: var(--aether-glass); border: 1px solid var(--aether-border); border-radius: var(--rounded-md); display: flex; align-items: center; justify-content: center; color: var(--aether-violet); box-shadow: 0 0 15px var(--aether-violet-glow); }
                .logo-brand { font-size: 1.25rem; font-weight: 950; letter-spacing: -0.02em; }
                .promo-headline { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 950; line-height: 1; margin-bottom: 1rem; letter-spacing: -0.04em; }
                .promo-subtext { font-size: 1.125rem; color: var(--aether-text-muted); max-width: 500px; margin-bottom: 2rem; line-height: 1.6; }
                
                .promo-features.compact { gap: 1rem; margin-bottom: 2rem; }
                .p-feature { display: flex; align-items: center; gap: 1rem; }
                .p-feature-icon { width: 40px; height: 40px; border-radius: var(--rounded-md); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--aether-border); }
                .p-feature-icon.violet { color: var(--aether-violet); background: rgba(139, 92, 246, 0.1); }
                .p-feature-icon.pink { color: var(--aether-pink); background: rgba(236, 72, 153, 0.1); }
                .p-feature-info h4 { font-size: 0.875rem; font-weight: 800; margin-bottom: 0.1rem; }
                .p-feature-info p { font-size: 0.75rem; color: var(--aether-text-muted); }

                .promo-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--aether-border);
                    max-width: 400px;
                }

                .promo-stat { display: flex; flex-direction: column; }
                .stat-num { font-size: 1.5rem; font-weight: 900; color: var(--aether-cyan); line-height: 1; }
                .stat-desc { font-size: 0.7rem; color: var(--aether-text-muted); font-weight: 700; text-transform: uppercase; margin-top: 0.25rem; }

                /* Form area */
                .form-card-wrapper { display: flex; flex-direction: column; gap: 1rem; }
                .form-header h2 { font-size: 1.25rem; font-weight: 900; margin-bottom: 0.25rem; color: white; }
                .form-header p { font-size: 0.75rem; color: var(--aether-text-muted); }

                .auth-panel { padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: var(--rounded-lg); }
                .auth-form { display: flex; flex-direction: column; gap: 1rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.35rem; }
                .input-label { font-size: 0.65rem; font-weight: 850; color: var(--aether-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .input-wrapper { position: relative; display: flex; align-items: center; }
                .field-icon { position: absolute; left: 0.875rem; color: var(--aether-text-muted); }
                .field-input { width: 100%; padding: 0.65rem 0.875rem 0.65rem 2.5rem; background: var(--aether-void); border: 1px solid var(--aether-border); border-radius: var(--rounded-md); color: white; font-size: 0.825rem; outline: none; transition: all var(--duration-fast); }
                .field-input:focus { border-color: var(--aether-violet); box-shadow: 0 0 12px var(--aether-violet-glow); }
                .toggle-visibility { position: absolute; right: 0.875rem; background: transparent; border: none; color: var(--aether-text-muted); cursor: pointer; }
                .form-extras { display: flex; justify-content: space-between; align-items: center; }
                .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: var(--aether-text-muted); cursor: pointer; }
                .auth-submit-btn { padding: 0.875rem; font-size: 0.875rem; font-weight: 850; }
                .btn-content { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

                .social-divider { position: relative; text-align: center; margin: 1.5rem 0; }
                .social-divider::before { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: var(--aether-border); }
                .social-divider span { position: relative; background: #0c0c11; padding: 0 0.75rem; font-size: 0.65rem; color: var(--aether-text-muted); font-weight: 700; text-transform: uppercase; }
                .social-sync-group { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
                .social-sync-btn { padding:0.65rem; background: var(--aether-void); border: 1px solid var(--aether-border); border-radius: var(--rounded-md); color: white; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.4rem; cursor: pointer; }

                .auth-footer-links { text-align: center; display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
                .auth-footer-links p { font-size: 0.75rem; color: var(--aether-text-muted); }
                .switch-link { background: transparent; border: none; color: var(--aether-cyan); font-weight: 850; cursor: pointer; font-size: 0.75rem; }
                .security-notice { font-size: 0.65rem !important; opacity: 0.6; }

                .gradient-orb { position: absolute; width: 500px; height: 500px; border-radius: 50%; filter: blur(120px); opacity: 0.1; pointer-events: none; }
                .orb-1 { top: -150px; left: -150px; background: var(--aether-pink); }
                .orb-2 { bottom: -150px; right: -150px; background: var(--aether-violet); }
            `}</style>
        </div>
    )
}