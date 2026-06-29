// src/components/Navbar.jsx
import React from 'react';
import { Scale, ExternalLink } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* LEFT: Brand */}
                <div className="brand">
                    <div className="brand-mark">
                        <Scale size={16} strokeWidth={2.5} />
                    </div>
                    <div className="brand-text">
                        <div className="brand-name">HaqDar</div>
                        <div className="brand-tagline">हर हक़ मिलना चाहिए</div>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="nav-actions">
                    <a
                        href="https://myscheme.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link"
                    >
                        Data Source
                        <ExternalLink size={13} strokeWidth={2} />
                    </a>

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