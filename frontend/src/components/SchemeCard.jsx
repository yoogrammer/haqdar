// src/components/SchemeCard.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, MapPin, ExternalLink, Check } from 'lucide-react';

const categoryStyles = {
    Housing: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    Health: { color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
    Energy: { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
    Agriculture: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    Livelihood: { color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
    Education: { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    'Women & Child': { color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8' },
    Employment: { color: '#475569', bg: '#F8FAFC', border: '#E2E8F0' },
    Insurance: { color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
};

const SchemeCard = ({ scheme, index }) => {
    const [open, setOpen] = useState(false);
    const style = categoryStyles[scheme.category] || { color: '#475569', bg: '#F8FAFC', border: '#E2E8F0' };

    const formatAmount = (amount) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
        return `₹${amount}`;
    };

    return (
        <div
            className={`sc ${open ? 'sc-open' : ''}`}
            style={{ '--sc-color': style.color, '--sc-bg': style.bg, '--sc-border': style.border }}
        >
            {/* Top Row */}
            <button className="sc-header" onClick={() => setOpen(!open)} type="button">
                <div className="sc-left">
                    <div className="sc-index" style={{ background: style.color }}>
                        {index}
                    </div>
                    <div className="sc-info">
                        <span className="sc-tag" style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}>
                            {scheme.category}
                        </span>
                        <h3 className="sc-name">{scheme.name}</h3>
                        <p className="sc-name-hi">{scheme.name_hindi}</p>
                    </div>
                </div>

                <div className="sc-right">
                    <div className="sc-amount">
                        <span className="sc-amount-value">{formatAmount(scheme.annual_benefit_value)}</span>
                        <span className="sc-amount-label">/year</span>
                    </div>
                    <div className="sc-toggle">
                        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </button>

            {/* Benefit Line */}
            <div className="sc-benefit">
                <div className="sc-benefit-dot" style={{ background: style.color }}></div>
                <span>{scheme.benefit_hindi || scheme.benefit}</span>
            </div>

            {/* Expanded Details */}
            {open && (
                <div className="sc-details">
                    <div className="sc-details-grid">

                        {/* Documents */}
                        <div className="sc-section">
                            <div className="sc-section-title">
                                <FileText size={14} />
                                <span>Documents Required</span>
                            </div>
                            <div className="sc-section-title-hi">जरूरी कागजात</div>
                            <ul className="sc-doc-list">
                                {(scheme.documents_hindi || scheme.documents).map((doc, i) => (
                                    <li key={i}>
                                        <Check size={12} strokeWidth={3} />
                                        <span>{doc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Where to Apply */}
                        <div className="sc-section">
                            <div className="sc-section-title">
                                <MapPin size={14} />
                                <span>Where to Apply</span>
                            </div>
                            <div className="sc-section-title-hi">कहाँ जाएं</div>
                            <p className="sc-apply-text">
                                {scheme.apply_at_hindi || scheme.apply_at}
                            </p>

                            <a
                                href={scheme.apply_online}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sc-apply-btn"
                                style={{ background: style.color }}
                            >
                                Apply Online
                                <ExternalLink size={13} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchemeCard;