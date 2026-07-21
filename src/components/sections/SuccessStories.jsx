// src/components/sections/SuccessStories.jsx
import React from 'react';
import { Star, MapPin, Check } from 'lucide-react';

const SuccessStories = () => {
    const stories = [
        {
            name: 'Sunita Devi',
            location: 'Jaipur, Rajasthan',
            occupation: 'Farmer',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&q=80',
            schemes: 8,
            benefit: '₹3,47,000',
            quote: 'I had no idea I was eligible for so many schemes. HaqDar showed me 8 schemes in just one minute. I applied for PM Awas Yojana and got approval within 3 months. My family finally has a proper house.',
            schemesApplied: ['PM Awas Yojana', 'Ayushman Bharat', 'PM Kisan'],
            verified: true,
        },
        {
            name: 'Ramesh Yadav',
            location: 'Pune, Maharashtra',
            occupation: 'Street Vendor',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
            schemes: 5,
            benefit: '₹1,60,000',
            quote: 'As a street vendor, I never thought the government had anything for me. HaqDar showed me PM SVANidhi loan. I got 10,000 rupees without any guarantee. Now my small shop is growing.',
            schemesApplied: ['PM SVANidhi', 'PM Suraksha Bima', 'Ayushman Bharat'],
            verified: true,
        },
        {
            name: 'Meena Kumari',
            location: 'Ranchi, Jharkhand',
            occupation: 'Homemaker',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80',
            schemes: 6,
            benefit: '₹2,05,000',
            quote: 'When I was pregnant, I found out through HaqDar that I could get 5,000 rupees from PMMVY and free hospital delivery through Janani Suraksha. The money helped me buy medicines and food.',
            schemesApplied: ['PMMVY', 'Janani Suraksha', 'PM Ujjwala'],
            verified: true,
        },
    ];

    return (
        <section className="success-section">
            <div className="section-inner">
                <div className="section-eyebrow">REAL STORIES</div>
                <h2 className="section-headline">
                    Families finding their<br />
                    <span className="accent-text">rightful benefits</span>
                </h2>
                <p className="section-sub">
                    Real people who discovered government schemes they never knew about.
                </p>

                <div className="stories-grid">
                    {stories.map((story, i) => (
                        <div key={i} className="story-card">

                            {/* Stars */}
                            <div className="story-stars">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} size={14} fill="#FBBF24" color="#FBBF24" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="story-quote">"{story.quote}"</p>

                            {/* Author */}
                            <div className="story-author">
                                <img src={story.image} alt={story.name} className="story-avatar" />
                                <div className="story-author-info">
                                    <div className="story-name">
                                        {story.name}
                                        {story.verified && (
                                            <span className="story-verified">
                                                <Check size={10} strokeWidth={3} /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <div className="story-meta">
                                        <MapPin size={11} />
                                        {story.location} · {story.occupation}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className="story-stats">
                                <div className="story-stat">
                                    <div className="story-stat-num">{story.schemes}</div>
                                    <div className="story-stat-label">schemes found</div>
                                </div>
                                <div className="story-stat-divider" />
                                <div className="story-stat">
                                    <div className="story-stat-num accent">{story.benefit}</div>
                                    <div className="story-stat-label">per year</div>
                                </div>
                            </div>

                            {/* Applied Schemes */}
                            <div className="story-applied">
                                <div className="story-applied-label">Schemes applied for:</div>
                                <div className="story-tags">
                                    {story.schemesApplied.map((s, idx) => (
                                        <span key={idx} className="story-tag">{s}</span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SuccessStories;