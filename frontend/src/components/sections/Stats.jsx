// src/components/sections/Stats.jsx
import React from 'react';
import { TrendingUp, Users, IndianRupee, Award } from 'lucide-react';

const Stats = () => {
    return (
        <section className="stats-section">
            <div className="section-inner">
                <div className="stats-card">
                    <div className="stats-header">
                        <div className="section-eyebrow">IMPACT IN NUMBERS</div>
                        <h2 className="stats-headline">
                            The scale of unclaimed benefits<br />
                            in India is staggering
                        </h2>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-block">
                            <div className="stat-icon">
                                <IndianRupee size={20} strokeWidth={2} />
                            </div>
                            <div className="stat-number">₹20L Cr</div>
                            <div className="stat-desc">Government schemes allocated every year</div>
                        </div>

                        <div className="stat-block">
                            <div className="stat-icon">
                                <Users size={20} strokeWidth={2} />
                            </div>
                            <div className="stat-number">800M+</div>
                            <div className="stat-desc">Indians eligible for at least 5 schemes</div>
                        </div>

                        <div className="stat-block">
                            <div className="stat-icon">
                                <Award size={20} strokeWidth={2} />
                            </div>
                            <div className="stat-number">700+</div>
                            <div className="stat-desc">Central & state schemes in our database</div>
                        </div>

                        <div className="stat-block">
                            <div className="stat-icon">
                                <TrendingUp size={20} strokeWidth={2} />
                            </div>
                            <div className="stat-number">73%</div>
                            <div className="stat-desc">Of eligible Indians never claim their benefits</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;