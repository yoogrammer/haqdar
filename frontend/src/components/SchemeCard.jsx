// src/components/SchemeCard.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, MapPin, ExternalLink } from 'lucide-react';

const categoryStyles = {
    Housing: { color: '#DC2626', bg: '#FEF2F2' },
    Health: { color: '#0891B2', bg: '#ECFEFF' },
    Energy: { color: '#7C3AED', bg: '#F5F3FF' },
    Agriculture: { color: '#16A34A', bg: '#F0FDF4' },
    Livelihood: { color: '#EA580C', bg: '#FFF7ED' },
    Education: { color: '#2563EB', bg: '#EFF6FF' },
    'Women & Child': { color: '#DB2777', bg: '#FDF2F8' },
    Employment: { color: '#475569', bg: '#F8FAFC' },
    Insurance: { color: '#0D9488', bg: '#F0FDFA' },
};

const SchemeCard = ({ scheme, index }) => {
    const [open, setOpen] = useState(false);
    const style = categoryStyles[scheme.category] || { color: '#525252', bg: '#FAFAFA' };

    return (
        <div className={`scheme-card ${open ? 'expanded' : ''}`}>

            {/* Header */}
            <button className="scheme-head" onClick={() => setOpen(!open)}>
                <div className="scheme-left">
                    <div
                        className="category-tag"
                        style={{ color: style.color, background: style.bg }}
                    >
                        {scheme.category}
                    </div>
                    <h3 className="scheme-name">{scheme.name}</h3>
                    <p className="scheme-name-hi">{scheme.name_hindi}</p>
                </div>

                <div className="scheme-right">
                    <div className="scheme-amount">
                        <span className="amt-currency">₹</span>
                        <span className="amt-value">
                            {(scheme.annual_benefit_value / 1000).toFixed(0)}K
                        </span>
                        <span className="amt-period">/yr</span>
                    </div>
                    <div className="chev">
                        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </button>

            {/* Benefit description */}
            <div className="scheme-benefit-line">
                {scheme.benefit}
            </div>

            {/* Expanded */}
            {open && (
                <div className="scheme-expand">
                    <div className="expand-grid">
                        <div className="expand-section">
                            <div className="expand-label">
                                <FileText size={13} />
                                Documents Required
                            </div>
                            <ul className="expand-list">
                                {scheme.documents.map((d, i) => (
                                    <li key={i}>{d}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="expand-section">
                            <div className="expand-label">
                                <MapPin size={13} />
                                Where to Apply
                            </div>
                            <p className="expand-text">{scheme.apply_at}</p>

                            <a
                                href={scheme.apply_online}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="apply-link"
                                style={{ background: style.color }}
                            >
                                Apply Online <ExternalLink size={13} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchemeCard;