// src/components/sections/FAQ.jsx
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: 'Is HaqDar really free?',
            a: 'Yes, completely free. We don\'t charge any fees, hidden or otherwise. Our mission is to help every Indian access their government benefits. We may partner with NGOs and government bodies to sustain operations.'
        },
        {
            q: 'How accurate is the scheme matching?',
            a: 'We use official data from MyScheme.gov.in (Government of India\'s scheme portal). Our AI cross-references your profile against verified eligibility criteria. Always confirm final eligibility at the official application centre.'
        },
        {
            q: 'Is my personal data safe?',
            a: 'Absolutely. We do not store any personal data. All processing happens in real-time, and your information is never shared with third parties. We comply with India\'s data protection guidelines.'
        },
        {
            q: 'Which languages does HaqDar support?',
            a: 'Currently English and Hindi. We are actively adding Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia in the coming weeks.'
        },
        {
            q: 'Can I apply for schemes through HaqDar?',
            a: 'HaqDar shows you which schemes you qualify for and provides step-by-step guidance. Actual applications happen on official government portals or at Common Service Centres (CSC) — we link you directly to them.'
        },
        {
            q: 'How does the AI work?',
            a: 'Our AI uses Large Language Models to understand your profile in context and provide personalized recommendations and explanations. It is trained on government scheme guidelines and constantly updated.'
        }
    ];

    return (
        <section className="faq-section">
            <div className="section-inner">
                <div className="section-eyebrow">FREQUENTLY ASKED</div>
                <h2 className="section-headline">
                    Everything you need to<br />
                    <span className="accent-text">know about HaqDar</span>
                </h2>

                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`faq-item ${openIndex === i ? 'open' : ''}`}
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                        >
                            <div className="faq-question">
                                <span>{faq.q}</span>
                                <div className="faq-icon">
                                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </div>
                            {openIndex === i && (
                                <div className="faq-answer">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;