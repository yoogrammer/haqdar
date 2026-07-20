// src/components/Navbar.jsx
import React from 'react';
import { Scale } from 'lucide-react';

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