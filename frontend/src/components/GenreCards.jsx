import React from 'react'

export function GenreCards() {
    const genres = [
        { id: 1, title: 'MusicGPT', subtitle: 'TOP 100', icon: '⚡', color: 'linear-gradient(135deg, #7c3aed, #db2777)' },
        { id: 2, title: 'Hip Hop', subtitle: 'URBAN', icon: '🎤', color: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
        { id: 3, title: 'Afro House', subtitle: 'RHYTHM', icon: '🥁', color: 'linear-gradient(135deg, #92400e, #d97706)' },
        { id: 4, title: 'Afrobeat', subtitle: 'VIBES', icon: '🌴', color: 'linear-gradient(135deg, #166534, #22c55e)' }
    ]

    return (
        <div className="genre-cards-container">
            <h2 className="genre-section-title">Explore Genres</h2>
            <div className="genre-grid">
                {genres.map((genre) => (
                    <div key={genre.id} className="genre-card group" style={{ '--card-gradient': genre.color }}>
                        <div className="card-bg"></div>
                        <div className="card-content">
                            <div className="card-top">
                                <span className="card-icon-pill">{genre.icon}</span>
                            </div>
                            <div className="card-bottom">
                                <h3 className="card-title">{genre.title}</h3>
                                <p className="card-subtitle">{genre.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .genre-cards-container {
                    width: 100%;
                    max-width: 1200px;
                    margin-top: 4rem;
                    padding: 0 1rem;
                }

                .genre-section-title {
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 2rem;
                    letter-spacing: -0.02em;
                }

                .genre-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .genre-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }

                .genre-card {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    border-radius: var(--rounded-lg);
                    overflow: hidden;
                    cursor: pointer;
                    background: var(--aether-void);
                    border: 1px solid var(--aether-border);
                    transition: all var(--duration-medium);
                }

                .card-bg {
                    position: absolute;
                    inset: 0;
                    background: var(--card-gradient);
                    opacity: 0.6;
                    transition: transform var(--duration-medium) ease;
                }

                .genre-card:hover .card-bg {
                    transform: scale(1.1);
                    opacity: 0.8;
                }

                .genre-card:hover {
                    border-color: rgba(255, 255, 255, 0.3);
                    transform: translateY(-8px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.5);
                }

                .card-content {
                    position: absolute;
                    inset: 0;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    z-index: 1;
                }

                .card-icon-pill {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                    font-size: 1rem;
                }

                .card-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .card-subtitle {
                    font-size: 2rem;
                    font-weight: 950;
                    color: rgba(255, 255, 255, 0.9);
                    letter-spacing: -0.05em;
                    text-transform: uppercase;
                    line-height: 1;
                }
            `}</style>
        </div>
    )
}
