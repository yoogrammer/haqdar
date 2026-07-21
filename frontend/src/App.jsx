// src/App.jsx
import React from 'react';
import Form from './components/Form';
import Results from './components/Results';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import SocialProof from './components/sections/SocialProof';
import HowItWorks from './components/sections/HowItWorks';
import Categories from './components/sections/Categories';
import Testimonials from './components/sections/Testimonials';
import Stats from './components/sections/Stats';
import FAQ from './components/sections/FAQ';
import { useSchemes } from './hooks/useSchemes';
import { Mail, ExternalLink } from 'lucide-react';

import './App.css';

function App() {
    const { results, loading, error, findSchemes, reset } = useSchemes();

    return (
        <div className="app">
            <Navbar />

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
                        <Categories />

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
                        <div>© 2026 HaqDar. Built for Bharat 🇮🇳</div>
                        <div className="footer-social">
                            <a href="#email" aria-label="Email"><Mail size={16} /></a>
                            <a href="#external" aria-label="Website"><ExternalLink size={16} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
