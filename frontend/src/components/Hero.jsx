// src/components/Hero.jsx
import React from 'react';
import { Sparkles, Users, IndianRupee, Zap } from 'lucide-react';
const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-inner">

                {/* Top Badge */}
                <div className="hero-badge">
                    <Sparkles size={13} strokeWidth={2.5} />
                    <span>AI-powered scheme matching</span>
                    <span className="badge-dot">·</span>
                    <span className="badge-emphasis">India's first</span>
                </div>

                {/* Headline */}
                <h1 className="hero-title">
                    Discover every government benefit{' '}
                    <span className="hero-title-accent">
                        you legally deserve
                    </span>
                    .
                </h1>

                {/* Sub-headline */}
                <p className="hero-sub">
                    700+ schemes. ₹20 lakh crore allocated every year.
                    Find yours in 60 seconds — free, in your language.
                </p>

                {/* Trust Metrics */}
                <div className="trust-metrics">
                    <div className="trust-item">
                        <div className="trust-icon">
                            <Users size={14} strokeWidth={2.25} />
                        </div>
                        <div className="trust-text">
                            <strong>800M+</strong>
                            <span>eligible Indians</span>
                        </div>
                    </div>

                    <div className="trust-divider" />

                    <div className="trust-item">
                        <div className="trust-icon">
                            <IndianRupee size={14} strokeWidth={2.25} />
                        </div>
                        <div className="trust-text">
                            <strong>₹2 lakh+</strong>
                            <span>average benefit</span>
                        </div>
                    </div>

                    <div className="trust-divider" />

                    <div className="trust-item">
                        <div className="trust-icon">
                            <Zap size={14} strokeWidth={2.25} />
                        </div>
                        <div className="trust-text">
                            <strong>60 second</strong>
                            <span>results</span>
                        </div>
                    </div>
                </div>

                {/* Trust Bar with Avatars */}
                <div className="hero-social-proof">
                    <div className="avatar-stack">
                        <img src="https://i.pravatar.cc/40?img=12" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=23" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=45" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=33" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=51" alt="" className="avatar" />
                        <div className="avatar avatar-more">+2k</div>
                    </div>
                    <div className="social-proof-text">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <div className="proof-label">
                            <strong>2,847 families</strong> claimed benefits this week
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;