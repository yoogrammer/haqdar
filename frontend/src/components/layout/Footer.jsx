// src/components/layout/Footer.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => (
    <footer className="footer">
        <div className="footer-content">
            <div>
                <strong>HaqDar</strong> · Built for Bharat 🇮🇳
            </div>
            <div className="footer-meta">
                Made with <Heart size={12} fill="#DC2626" color="#DC2626" /> ·
                Data from MyScheme.gov.in · Open Source
            </div>
        </div>
    </footer>
);

export default Footer;