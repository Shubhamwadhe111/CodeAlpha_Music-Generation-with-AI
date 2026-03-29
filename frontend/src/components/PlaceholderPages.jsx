import { Music, Scissors, Compass, LayoutTemplate, DollarSign, User, LogOut } from 'lucide-react'
import { StudioPage } from './StudioPage'

// Generic Layout wrapper for these placeholder pages
const PageLayout = ({ icon: Icon, title, description }) => (
    <div className="placeholder-page-root animate-fade-in">
        <div className="placeholder-header">
            <div className="header-text">
                <h1 className="placeholder-title">
                    <div className="icon-badge">
                        <Icon size={24} />
                    </div>
                    {title}
                </h1>
                <p className="placeholder-desc">{description}</p>
            </div>

            <div className="header-actions">
                <div className="user-profile-header">
                    <div className="user-profile-summary">
                        <div className="user-avatar-small">
                            <User size={16} />
                        </div>
                        <div className="user-meta">
                            <span className="email-truncated">user@example.com</span>
                            <span className="badge-free">Free</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="placeholder-body">
            <div className="aether-panel construction-card">
                <div className="construction-icon-box">
                    <Icon size={48} />
                </div>
                <h2 className="construction-headline">Under Construction</h2>
                <p className="construction-subtext">
                    The {title} module is currently being optimized by the Aether neural matrix. 
                    Expect high-fidelity tools in a future deployment.
                </p>
                <button className="aether-btn-primary notify-btn">
                    Notify Me When Live
                </button>
            </div>
        </div>

        <style>{`
            .placeholder-page-root {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 3rem 2rem;
                display: flex;
                flex-direction: column;
                gap: 4rem;
            }

            .placeholder-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }

            .placeholder-title {
                font-size: 2.5rem;
                font-weight: 900;
                color: white;
                display: flex;
                align-items: center;
                gap: 1.5rem;
                margin-bottom: 1rem;
                letter-spacing: -0.02em;
            }

            .icon-badge {
                width: 48px;
                height: 48px;
                background: rgba(0, 255, 204, 0.1);
                border: 1px solid rgba(0, 255, 204, 0.3);
                border-radius: var(--rounded-md);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--aether-cyan);
                box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
            }

            .placeholder-desc {
                font-size: 1rem;
                color: var(--aether-text-muted);
                max-width: 700px;
                line-height: 1.6;
            }

            .placeholder-body {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4rem 0;
            }

            .construction-card {
                max-width: 500px;
                padding: 4rem 3rem;
                text-align: center;
                background: rgba(10, 10, 15, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .construction-icon-box {
                width: 96px;
                height: 96px;
                background: rgba(0, 255, 204, 0.05);
                border: 1px solid rgba(0, 255, 204, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--aether-cyan);
                margin-bottom: 2rem;
                box-shadow: 0 0 30px rgba(0, 255, 204, 0.1);
            }

            .construction-headline {
                font-size: 1.5rem;
                font-weight: 900;
                color: white;
                margin-bottom: 1rem;
            }

            .construction-subtext {
                font-size: 0.875rem;
                color: var(--aether-text-muted);
                line-height: 1.8;
                margin-bottom: 2.5rem;
            }

            .notify-btn {
                padding: 1rem 2.5rem;
                font-size: 1rem;
                font-weight: 800;
            }

            /* Ported User Header Styles */
            .header-actions {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .user-profile-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: var(--aether-glass);
                padding: 0.35rem 0.35rem 0.35rem 0.75rem;
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
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--aether-violet), var(--aether-pink));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.1);
            }

            .user-meta {
                display: flex;
                flex-direction: column;
                line-height: 1;
            }

            .email-truncated {
                font-size: 0.75rem;
                font-weight: 700;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: white;
            }

            .badge-free {
                font-size: 0.6rem;
                font-weight: 800;
                text-transform: uppercase;
                color: var(--aether-cyan);
                letter-spacing: 0.05em;
                margin-top: 2px;
            }
        `}</style>
    </div>
)

export const AIMusicGeneratorPage = () => <StudioPage />

export const StemSplitterPage = () => (
    <PageLayout
        icon={Scissors}
        title="Audio Deconstructor"
        description="Upload any mixed audio file and use our advanced isolation models to perfectly separate Vocals, Drums, Bass, and Melody tracks in real-time."
    />
)

export const DiscoverPage = () => (
    <PageLayout
        icon={Compass}
        title="Neural Network"
        description="Browse the top 100 AI-generated masterpieces created by the community. Fork tracks from other creators and mutate them into your own."
    />
)



export const PricingPage = () => (
    <div className="placeholder-page-root animate-fade-in">
        <div className="placeholder-header">
            <div className="header-text">
                <h1 className="placeholder-title">
                    <div className="icon-badge">
                        <DollarSign size={24} />
                    </div>
                    Free for Everyone
                </h1>
                <p className="placeholder-desc">AetherMusic is completely free to use. Create unlimited music with full access to all features.</p>
            </div>
        </div>

        <div className="placeholder-body">
            <div className="aether-panel construction-card">
                <div className="construction-icon-box">
                    <Music size={48} />
                </div>
                <h2 className="construction-headline">100% Free</h2>
                <p className="construction-subtext">
                    All features are completely free. No subscriptions, no limits, no premium tiers. Just create amazing music with AI.
                </p>
                
                <div className="perks-list">
                    <div className="perk-item">
                        <span className="perk-check">✓</span> 
                        <span>Unlimited Generations</span>
                    </div>
                    <div className="perk-item">
                        <span className="perk-check">✓</span> 
                        <span>All AI Models</span>
                    </div>
                    <div className="perk-item">
                        <span className="perk-check">✓</span> 
                        <span>MIDI & Audio Export</span>
                    </div>
                    <div className="perk-item">
                        <span className="perk-check">✓</span> 
                        <span>Zero Hidden Costs</span>
                    </div>
                </div>
            </div>
        </div>

        <style>{`
            .perks-list {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                text-align: left;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.02);
                border-radius: var(--rounded-md);
            }

            .perk-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--aether-text);
            }

            .perk-check {
                color: var(--aether-cyan);
                font-weight: 900;
            }
        `}</style>
    </div>
)
