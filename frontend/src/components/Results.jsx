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

    return (
        <div className="results">

            {/* Success Banner */}
            <div className="success-banner">
                <div className="success-icon">
                    <CheckCircle2 size={28} strokeWidth={2.5} />
                </div>
                <div>
                    <div className="success-eyebrow">Results ready</div>
                    <h1 className="success-title">
                        {user_name}, you qualify for <span className="num-highlight">{total_schemes}</span> schemes
                    </h1>
                </div>
            </div>

            {/* Big benefit card */}
            <div className="benefit-hero">
                <div className="benefit-label">
                    <TrendingUp size={14} />
                    Total annual benefit you can claim
                </div>
                <div className="benefit-amount">
                    ₹{total_annual_benefit.toLocaleString('en-IN')}
                </div>
                <div className="benefit-sub">
                    This money is your legal right · Start applying today
                </div>
            </div>

            {/* AI Insight */}
            <div className="ai-insight">
                <div className="ai-badge">
                    <Sparkles size={13} />
                    AI Insight
                </div>
                <p className="ai-text">{ai_summary}</p>
            </div>

            {/* Schemes Section */}
            <div className="schemes-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">Your eligible schemes</h2>
                        <p className="section-sub">Tap any scheme to see how to apply</p>
                    </div>
                    <div className="scheme-count">
                        {total_schemes} matches
                    </div>
                </div>

                <div className="schemes-stack">
                    {schemes.map((scheme, i) => (
                        <SchemeCard key={scheme.id} scheme={scheme} index={i + 1} />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="results-actions">
                <button className="btn btn-ghost" onClick={onBack}>
                    <ArrowLeft size={16} /> Check for someone else
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => window.print()}
                >
                    <Download size={16} /> Save as PDF
                </button>
            </div>
        </div>
    );
};

export default Results;