// src/components/Results.jsx
import React from 'react';
import CountUp from 'react-countup';
import SchemeCard from './SchemeCard';
import { generatePDF } from '../utils/generatePDF';
import { CheckCircle2, ArrowLeft, Sparkles, TrendingUp, Download, Printer, Share2 } from 'lucide-react';

const Results = ({ results, onBack }) => {
    const {
        user_name,
        total_schemes,
        total_annual_benefit,
        schemes,
        ai_summary,
    } = results;

    const handlePrint = () => window.print();
    const handlePDF = () => generatePDF(results);

    const handleWhatsApp = () => {
        const text = `I discovered ${total_schemes} government schemes worth Rs.${total_annual_benefit.toLocaleString('en-IN')}/year using HaqDar!\n\nCheck yours free at: https://haqdar-khaki.vercel.app\n\nHar haq milna chahiye 🇮🇳`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="res">

            {/* TOP BACK BUTTON */}
            <div className="res-top-bar">
                <button className="btn-back-top" onClick={onBack}>
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </button>
            </div>

            {/* Success Banner */}
            <div className="res-banner">
                <div className="res-banner-icon">
                    <CheckCircle2 size={28} strokeWidth={2.5} />
                </div>
                <div className="res-banner-text">
                    <div className="res-banner-label">Results ready</div>
                    <h1 className="res-banner-title">
                        {user_name}, you qualify for{' '}
                        <span className="res-highlight">{total_schemes}</span> schemes
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
                        ₹<CountUp end={total_annual_benefit} duration={2.5} separator="," />
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

            {/* Quick Action Buttons */}
            <div className="res-quick-actions">
                <button className="res-action-btn" onClick={handlePDF}>
                    <Download size={16} />
                    <span>Download PDF</span>
                </button>
                <button className="res-action-btn" onClick={handlePrint}>
                    <Printer size={16} />
                    <span>Print</span>
                </button>
                <button className="res-action-btn whatsapp" onClick={handleWhatsApp}>
                    <Share2 size={16} />
                    <span>WhatsApp</span>
                </button>
            </div>

            {/* Schemes Section */}
            <div className="res-schemes">
                <div className="res-schemes-header">
                    <div>
                        <h2 className="res-schemes-title">Your eligible schemes</h2>
                        <p className="res-schemes-sub">Tap any scheme to see how to apply</p>
                    </div>
                    <div className="res-schemes-count">{total_schemes} matches</div>
                </div>

                <div className="res-schemes-list">
                    {schemes.map((scheme, i) => (
                        <SchemeCard key={scheme.id} scheme={scheme} index={i + 1} />
                    ))}
                </div>
            </div>

            {/* Bottom Back Button */}
            <div className="res-actions">
                <button className="btn btn-ghost" onClick={onBack}>
                    <ArrowLeft size={16} /> Check for someone else
                </button>
            </div>
        </div>
    );
};

export default Results;