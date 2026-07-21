// src/components/VoiceButton.jsx
import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceButton = ({ onTranscript, language = 'english' }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const isSupported = !!SpeechRecognition;

    if (!isSupported) {
        return (
            <button
                type="button"
                className="voice-btn"
                onClick={() => alert('Voice input requires Google Chrome or Microsoft Edge browser. Please switch browsers.')}
                title="Voice input not supported"
            >
                <Mic size={16} style={{ opacity: 0.4 }} />
            </button>
        );
    }

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isListening) {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (onTranscript) onTranscript(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert('Please allow microphone permission in browser settings.');
            } else if (event.error === 'network') {
                alert('Voice service needs Chrome browser. Brave and some browsers block this. Please use Chrome or Edge.');
            } else if (event.error === 'no-speech') {
                alert('No speech detected. Please try again.');
            }
        };

        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (err) {
            setIsListening(false);
        }
    };

    return (
        <button
            type="button"
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            onClick={handleClick}
            title={language === 'hindi' ? 'बोलकर भरें' : 'Click to speak'}
        >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
    );
};

export default VoiceButton;