// src/hooks/useVoiceInput.js
import { useState, useRef, useCallback } from 'react';

export const useVoiceInput = (language = 'english') => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    const getSupport = () => {
        return typeof window !== 'undefined' &&
            (window.SpeechRecognition || window.webkitSpeechRecognition);
    };

    const isSupported = !!getSupport();

    const startListening = useCallback((onResult) => {
        const SpeechRecognition = getSupport();

        if (!SpeechRecognition) {
            alert('Voice input not supported. Please use Chrome browser.');
            return;
        }

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setError('');
        };

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            if (onResult) onResult(result);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            setIsListening(false);

            switch (event.error) {
                case 'not-allowed':
                    alert('Microphone permission denied. Please allow microphone access.');
                    break;
                case 'no-speech':
                    alert('No speech detected. Please try again.');
                    break;
                case 'network':
                    alert('Voice input requires Google Chrome browser. Brave and some browsers block this service. Please switch to Chrome or Edge.');
                    break;
                case 'audio-capture':
                    alert('No microphone found. Please check your microphone.');
                    break;
                default:
                    alert('Voice input error: ' + event.error);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (e) {
            setIsListening(false);
        }
    }, [language]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { }
            setIsListening(false);
        }
    }, []);

    return {
        isListening,
        isSupported,
        error,
        startListening,
        stopListening,
    };
};