// src/components/Results.jsx
import React from 'react';
import SchemeCard from './SchemeCard';
import { CheckCircle2, ArrowLeft, Sparkles, TrendingUp, Download } from 'lucide-react';

const Results = ({ results, onBack }) => {
    const {
        user_name,
        total_schemes,
        total_annual_benefit,
        schemes,
        ai_summary,
    } = results;

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    return (
        <div className="res">

            {/* Success Banner */}
            <div className="res-banner">
                <div className="res-banner-icon">
                    <CheckCircle2 size={28} strokeWidth={2.5} />
                </div>
                <div className="res-banner-text">
                    <div className="res-banner-label">Results ready</div>
                    <h1 className="res-banner-title">
                        {user_name}, you qualify for <span className="res-highlight">{total_schemes}</span> schemes
                    </h1>
                </div>
            </div>

            {/* Big Benefit Card */}
            <div className="res-benefit">
                <div className="res-benefit-inner">
                    <div className="res-benefit-label">
                        <TrendingUp size={14} />
                        Total annual benefit you can claim
                    </div>
                    <div className="res-benefit-amount">
                        ₹{formatINR(total_annual_benefit)}
                    </div>
                    <div className="res-benefit-sub">
                        This money is your legal right. Start applying today.
                    </div>
                </div>
            </div>

            {/* AI Summary */}
            <div className="res-ai">
                <div className="res-ai-badge">
                    <Sparkles size={13} />
                    AI Insight
                </div>
                <p className="res-ai-text">{ai_summary}</p>
            </div>

            {/* Schemes Section */}
            <div className="res-schemes">
                <div className="res-schemes-header">
                    <div>
                        <h2 className="res-schemes-title">Your eligible schemes</h2>
                        <p className="res-schemes-sub">Tap any scheme to see how to apply</p>
                    </div>
                    <div className="res-schemes-count">
                        {total_schemes} matches
                    </div>
                </div>

                <div className="res-schemes-list">
                    {schemes.map((scheme, i) => (
                        <SchemeCard key={scheme.id} scheme={scheme} index={i + 1} />
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="res-actions">
                <button className="btn btn-ghost" onClick={onBack}>
                    <ArrowLeft size={16} /> Check for someone else
                </button>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                    <Download size={16} /> Save as PDF
                </button>
            </div>
        </div>
    );
};

export default Results;