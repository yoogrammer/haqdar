// src/components/sections/Categories.jsx
import React from 'react';
import { Home, Heart, GraduationCap, Briefcase, Sprout, ShieldCheck, Baby, Wallet } from 'lucide-react';

const Categories = () => {
    const categories = [
        { icon: Home, name: 'Housing', count: 47, color: '#DC2626', bg: '#FEF2F2' },
        { icon: Heart, name: 'Healthcare', count: 89, color: '#DB2777', bg: '#FDF2F8' },
        { icon: GraduationCap, name: 'Education', count: 124, color: '#2563EB', bg: '#EFF6FF' },
        { icon: Briefcase, name: 'Employment', count: 56, color: '#7C3AED', bg: '#F5F3FF' },
        { icon: Sprout, name: 'Agriculture', count: 78, color: '#16A34A', bg: '#F0FDF4' },
        { icon: ShieldCheck, name: 'Insurance', count: 34, color: '#0891B2', bg: '#ECFEFF' },
        { icon: Baby, name: 'Women & Child', count: 92, color: '#EA580C', bg: '#FFF7ED' },
        { icon: Wallet, name: 'Financial Aid', count: 61, color: '#475569', bg: '#F8FAFC' },
    ];

    return (
        <section className="categories-section">
            <div className="section-inner">
                <div className="section-eyebrow">BENEFIT CATEGORIES</div>
                <h2 className="section-headline">
                    We cover schemes across<br />
                    <span className="accent-text">every life situation</span>
                </h2>
                <p className="section-sub">
                    From housing to healthcare, education to employment — we help you find them all.
                </p>

                <div className="categories-grid">
                    {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <div key={i} className="category-card">
                                <div className="cat-icon" style={{ background: cat.bg, color: cat.color }}>
                                    <Icon size={22} strokeWidth={2} />
                                </div>
                                <div className="cat-info">
                                    <div className="cat-name">{cat.name}</div>
                                    <div className="cat-count">{cat.count} schemes</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Categories;