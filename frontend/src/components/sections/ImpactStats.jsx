// src/components/sections/ImpactStats.jsx
import React, { useState, useEffect } from 'react';
import { Users, IndianRupee, Award, TrendingUp } from 'lucide-react';
import CountUp from 'react-countup';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ImpactStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/stats`)
            .then(r => r.json())
            .then(data => {
                if (data.database) {
                    setStats(data.database);
                }
            })
            .catch(() => { });
    }, []);

    if (!stats) return null;

    const formatBenefit = (amount) => {
        if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
        return amount.toLocaleString('en-IN');
    };

    return (
        <section className="impact-stats-section">
            <div className="section-inner">
                <div className="impact-badge">
                    <TrendingUp size={13} />
                    LIVE IMPACT
                </div>

                <h2 className="section-headline">
                    Real families discovering their<br />
                    <span className="accent-text">rightful benefits</span>
                </h2>
                <p className="section-sub">
                    Live data from HaqDar users across India
                </p>

                <div className="impact-grid">
                    <div className="impact-card">
                        <div className="impact-icon">
                            <Users size={24} />
                        </div>
                        <div className="impact-number">
                            <CountUp end={stats.total_users} duration={2.5} separator="," />+
                        </div>
                        <div className="impact-label">Indians Helped</div>
                        <div className="impact-sub">And growing every day</div>
                    </div>

                    <div className="impact-card featured">
                        <div className="impact-icon">
                            <IndianRupee size={24} />
                        </div>
                        <div className="impact-number">
                            ₹{formatBenefit(stats.total_benefit_discovered)}
                        </div>
                        <div className="impact-label">Benefits Discovered</div>
                        <div className="impact-sub">Money families didn't know was theirs</div>
                    </div>

                    <div className="impact-card">
                        <div className="impact-icon">
                            <Award size={24} />
                        </div>
                        <div className="impact-number">
                            <CountUp end={stats.avg_schemes_per_user} duration={2.5} decimals={1} />
                        </div>
                        <div className="impact-label">Average Schemes Found</div>
                        <div className="impact-sub">Per user across all profiles</div>
                    </div>
                </div>

                <div className="impact-quote">
                    "Every user represents a family that now knows their rights."
                </div>
            </div>
        </section>
    );
};

export default ImpactStats;