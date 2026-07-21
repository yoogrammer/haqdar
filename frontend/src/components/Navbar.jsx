// src/components/Navbar.jsx
import React from 'react';
import { Scale, ExternalLink, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const Navbar = () => {
    const { isDark, toggle } = useDarkMode();

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="brand">
                    <div className="brand-mark">
                        <Scale size={16} strokeWidth={2.5} />
                    </div>
                    <div className="brand-text">
                        <div className="brand-name">HaqDar</div>
                        <div className="brand-tagline">हर हक़ मिलना चाहिए</div>
                    </div>
                </div>

                <div className="nav-actions">
                    <button className="dark-toggle" onClick={toggle} aria-label="Toggle dark mode">
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <div className="status-pill">
                        <span className="status-dot">
                            <span className="status-dot-pulse"></span>
                        </span>
                        <span>Live</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;