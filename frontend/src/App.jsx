// src/App.jsx
import React, { useState } from 'react';
import Form from './components/Form';
import ImpactStats from './components/sections/ImpactStats';
import Results from './components/Results';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import VoiceAssistant from './components/VoiceAssistant';
import SocialProof from './components/sections/SocialProof';
import HowItWorks from './components/sections/HowItWorks';
import Categories from './components/sections/Categories';
import Testimonials from './components/sections/Testimonials';
import Stats from './components/sections/Stats';
import FAQ from './components/sections/FAQ';
import SuccessStories from './components/sections/SuccessStories';
import { useSchemes } from './hooks/useSchemes';
import { Mail, ExternalLink, Heart, Bot } from 'lucide-react';
import './App.css';

function App() {
    const { results, loading, error, findSchemes, reset, setResultsDirectly } = useSchemes();
    const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

    const handleVoiceComplete = (data) => {
        setShowVoiceAssistant(false);
        setResultsDirectly(data);
    };

    return (
        <div className="app">
            <Navbar />

            <button
                className="voice-fab"
                onClick={() => setShowVoiceAssistant(true)}
                title="Talk to HaqDar Sahayak"
            >
                <Bot size={24} />
                <span>Talk to AI</span>
            </button>

            {showVoiceAssistant && (
                <VoiceAssistant
                    onClose={() => setShowVoiceAssistant(false)}
                    onComplete={handleVoiceComplete}
                />
            )}

            <div className="page-wrap">
                {!results && (
                    <>
                        <Hero />
                        <SocialProof />
                    </>
                )}

                <main className="container">
                    {!results ? (
                        <Form
                            onSubmit={findSchemes}
                            loading={loading}
                            error={error}
                        />
                    ) : (
                        <Results
                            results={results}
                            onBack={reset}
                        />
                    )}
                </main>

                {!results && (
                    <>
                        <HowItWorks />
                        <Stats />
                        <ImpactStats />
                        <Categories />
                        <SuccessStories />
                        <Testimonials />
                        <FAQ />
                    </>
                )}
            </div>

            <footer className="footer-pro">
                <div className="footer-inner">
                    <div className="footer-grid">
                        <div className="footer-col footer-brand-col">
                            <div className="footer-brand">
                                <div className="brand-mark">⚖️</div>
                                <div>
                                    <div className="footer-brand-name">HaqDar</div>
                                    <div className="footer-brand-tag">हर हक़ मिलना चाहिए</div>
                                </div>
                            </div>
                            <p className="footer-desc">
                                Helping every Indian discover and claim their government benefits.
                                Free. Forever.
                            </p>
                        </div>

                        <div className="footer-col">
                            <div className="footer-col-title">Product</div>
                            <a href="#how">How it works</a>
                            <a href="#schemes">Browse schemes</a>
                            <a href="#categories">Categories</a>
                            <a href="#api">API</a>
                        </div>

                        <div className="footer-col">
                            <div className="footer-col-title">Resources</div>
                            <a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer">MyScheme.gov.in</a>
                            <a href="#blog">Blog</a>
                            <a href="#help">Help Centre</a>
                            <a href="#community">Community</a>
                        </div>

                        <div className="footer-col">
                            <div className="footer-col-title">Company</div>
                            <a href="#about">About</a>
                            <a href="#privacy">Privacy</a>
                            <a href="#terms">Terms</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="footer-copy">
                            © 2025 HaqDar · Made with <Heart size={12} fill="currentColor" /> for Bharat 🇮🇳
                        </div>
                        <div className="footer-social">
                            <a href="mailto:hello@haqdar.in" aria-label="Email">
                                <Mail size={16} />
                            </a>
                            <a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" aria-label="Website">
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;