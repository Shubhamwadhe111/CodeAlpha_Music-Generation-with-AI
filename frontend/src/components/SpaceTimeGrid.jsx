import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function SpaceTimeGrid() {
    const gridRef = useRef(null)

    useEffect(() => {
        const grid = gridRef.current
        let lastScrollY = window.scrollY

        const handleScroll = () => {
            const scrollY = window.scrollY
            const velocity = scrollY - lastScrollY

            // Warp the grid based on scroll velocity
            if (Math.abs(velocity) > 2) {
                gsap.to(grid, {
                    skewY: velocity * 0.05,
                    scaleY: 1 + Math.abs(velocity) * 0.001,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        // Return to normal
                        gsap.to(grid, { skewY: 0, scaleY: 1, duration: 0.8, ease: "elastic.out(1, 0.3)" })
                    }
                })
            }

            lastScrollY = scrollY
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="spacetime-wrap">
            {/* Dynamic Grid */}
            <div ref={gridRef} className="spacetime-grid"></div>

            {/* Background ambient glow matching the aesthetic */}
            <div className="ambient-glow"></div>

            <style>{`
                .spacetime-wrap {
                    position: fixed;
                    inset: 0;
                    z-index: -10;
                    pointer-events: none;
                    background: var(--aether-void);
                }

                .spacetime-grid {
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 255, 204, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 204, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                    transform-origin: center;
                }

                .ambient-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(0, 210, 255, 0.08) 0%, transparent 60%);
                }
            `}</style>
        </div>
    )
}
