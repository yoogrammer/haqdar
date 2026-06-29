// src/components/sections/HowItWorks.jsx
import React from 'react';
import { UserCircle, Sparkles, FileCheck, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: UserCircle,
            title: 'Tell us about yourself',
            description: 'Answer 8 simple questions about your family, income, and situation. Takes just 60 seconds.',
            color: '#0F172A'
        },
        {
            number: '02',
            icon: Sparkles,
            title: 'AI matches your schemes',
            description: 'Our AI scans 700+ government schemes and finds every single one you qualify for.',
            color: '#EA580C'
        },
        {
            number: '03',
            icon: FileCheck,
            title: 'Get step-by-step guide',
            description: 'See exactly what documents you need and where to apply. No middlemen, no confusion.',
            color: '#059669'
        }
    ];

    return (
        <section className="how-it-works">
            <div className="section-inner">
                <div className="section-eyebrow">HOW IT WORKS</div>
                <h2 className="section-headline">
                    Three steps to claim<br />
                    <span className="accent-text">what's already yours</span>
                </h2>

                <div className="steps-grid">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={i} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <div className="step-icon-wrap" style={{ background: step.color }}>
                                    <Icon size={24} color="white" strokeWidth={2} />
                                </div>
                                <h3 className="step-card-title">{step.title}</h3>
                                <p className="step-card-desc">{step.description}</p>
                                {i < steps.length - 1 && (
                                    <div className="step-connector">
                                        <ArrowRight size={18} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;