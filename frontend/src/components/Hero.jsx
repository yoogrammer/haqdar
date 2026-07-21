// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, Users, IndianRupee, Zap } from 'lucide-react';

const Hero = () => {
    const [liveCount, setLiveCount] = useState(0);

    useEffect(() => {
        const fetchStats = () => {
            fetch('https://haqdar-lt5n.onrender.com/stats')
                .then(r => r.json())
                .then(data => {
                    const count = data.database?.total_submissions || 0;
                    setLiveCount(count);
                })
                .catch(() => setLiveCount(0));
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

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
                    <span className="hero-title-accent">you legally deserve</span>.
                </h1>

                {/* Sub */}
                <p className="hero-sub">
                    700+ schemes. ₹20 lakh crore allocated every year.
                    Find yours in 60 seconds — free, in your language.
                </p>

                {/* Trust Metrics */}
                <div className="trust-metrics">
                    <div className="trust-item">
                        <div className="trust-icon"><Users size={14} strokeWidth={2.25} /></div>
                        <div className="trust-text">
                            <strong>800M+</strong><span>eligible Indians</span>
                        </div>
                    </div>
                    <div className="trust-divider" />
                    <div className="trust-item">
                        <div className="trust-icon"><IndianRupee size={14} strokeWidth={2.25} /></div>
                        <div className="trust-text">
                            <strong>₹2 lakh+</strong><span>average benefit</span>
                        </div>
                    </div>
                    <div className="trust-divider" />
                    <div className="trust-item">
                        <div className="trust-icon"><Zap size={14} strokeWidth={2.25} /></div>
                        <div className="trust-text">
                            <strong>60 second</strong><span>results</span>
                        </div>
                    </div>
                </div>

                {/* Live Counter */}
                {liveCount > 0 && (
                    <div className="live-counter">
                        <div className="live-pulse"></div>
                        <span className="live-text">
                            <strong>{liveCount.toLocaleString('en-IN')}+</strong> people have used HaqDar
                        </span>
                    </div>
                )}

                {/* Social Proof */}
                <div className="hero-social-proof">
                    <div className="avatar-stack">
                        <img src="https://i.pravatar.cc/40?img=12" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=23" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=45" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=33" alt="" className="avatar" />
                        <img src="https://i.pravatar.cc/40?img=51" alt="" className="avatar" />
                    </div>
                    <div className="social-proof-text">
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                        <div className="proof-label">
                            <strong>Trusted</strong> by families across India
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;