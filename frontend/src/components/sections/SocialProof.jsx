// src/components/sections/SocialProof.jsx
import React from 'react';
import { ShieldCheck, Landmark, Database, FileCheck, Heart, Award } from 'lucide-react';

const SocialProof = () => {
    const sources = [
        { icon: Landmark, name: 'Govt. of India', sub: 'Official' },
        { icon: Database, name: 'MyScheme', sub: 'myscheme.gov.in' },
        { icon: FileCheck, name: 'DigiLocker', sub: 'Verified Data' },
        { icon: Award, name: 'NIC', sub: 'National Informatics' },
        { icon: Heart, name: 'Ayushman Bharat', sub: 'Health Schemes' },
    ];

    return (
        <section className="social-proof-section">
            <div className="proof-container">
                <div className="proof-label-top">
                    <ShieldCheck size={14} />
                    <span>Trusted Data Sources</span>
                </div>

                <div className="proof-logos">
                    {sources.map((source, i) => {
                        const Icon = source.icon;
                        return (
                            <div key={i} className="proof-logo">
                                <div className="proof-logo-icon">
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                                <div className="proof-logo-text">
                                    <div className="logo-name">{source.name}</div>
                                    <div className="logo-sub">{source.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;