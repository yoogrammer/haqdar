// src/components/sections/Testimonials.jsx
import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'Sunita Devi',
            role: 'Farmer · Rajasthan',
            image: 'https://unpkg.com/heroicons@2.0.18/24/solid/user-circle.svg',
            benefit: '₹3,47,000',
            quote: 'मुझे 8 योजनाओं के बारे में पता चला जो मैं कभी नहीं जानती थी। मेरे बच्चों के लिए scholarship भी मिली।',
            quoteEn: 'I learned about 8 schemes I never knew existed. I even got scholarships for my children.',
            schemes: 8,
            verified: true
        },
        {
            name: 'Ramesh Kumar',
            role: 'Street Vendor · Maharashtra',
            image: 'https://unpkg.com/heroicons@2.0.18/24/solid/user-circle.svg',
            benefit: '₹1,20,000',
            quote: 'PM SVANidhi se loan mila aur ab mera business badh raha hai. Sirf 2 din mein paisa mil gaya.',
            quoteEn: 'Got a PM SVANidhi loan and my business is growing. Money came in just 2 days.',
            schemes: 5,
            verified: true
        },
        {
            name: 'Priya Sharma',
            role: 'Mother · Jharkhand',
            image: 'https://unpkg.com/heroicons@2.0.18/24/solid/user-circle.svg',
            benefit: '₹2,05,000',
            quote: 'Pregnancy ke liye ₹5000 mile aur Ayushman Bharat card bhi. Hospital ka kharcha nahi hua.',
            quoteEn: 'Got ₹5000 for pregnancy and an Ayushman Bharat card. No hospital expenses at all.',
            schemes: 6,
            verified: true
        }
    ];

    return (
        <section className="testimonials-section">
            <div className="section-inner">
                <div className="section-eyebrow">REAL STORIES</div>
                <h2 className="section-headline">
                    Families across India are<br />
                    <span className="accent-text">claiming what's theirs</span>
                </h2>

                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonial-card">
                            <div className="t-quote-icon">
                                <Quote size={20} fill="currentColor" />
                            </div>

                            <div className="t-stars">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} size={14} fill="#FBBF24" color="#FBBF24" />
                                ))}
                            </div>

                            <p className="t-quote">"{t.quote}"</p>
                            <p className="t-quote-en">"{t.quoteEn}"</p>

                            <div className="t-author">
                                <img src={t.image} alt={t.name} className="t-avatar" />
                                <div className="t-author-info">
                                    <div className="t-name">
                                        {t.name}
                                        {t.verified && <span className="t-verified">✓ Verified</span>}
                                    </div>
                                    <div className="t-role">{t.role}</div>
                                </div>
                            </div>

                            <div className="t-benefit-bar">
                                <div className="t-stat">
                                    <div className="t-stat-num">{t.schemes}</div>
                                    <div className="t-stat-label">schemes</div>
                                </div>
                                <div className="t-stat-divider" />
                                <div className="t-stat">
                                    <div className="t-stat-num accent">{t.benefit}</div>
                                    <div className="t-stat-label">claimed/year</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;