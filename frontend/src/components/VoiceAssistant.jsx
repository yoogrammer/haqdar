// src/components/VoiceAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, User, Loader2, Mic, MicOff, PhoneOff } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const QUESTIONS_EN = [
    { key: 'name', question: "Hi! I am Sahayak. What is your name?" },
    { key: 'age', question: "How old are you?" },
    { key: 'gender', question: "Are you male, female, or other?" },
    { key: 'state', question: "Which state do you live in?" },
    { key: 'residence', question: "Do you live in a village or city?" },
    { key: 'occupation', question: "What is your occupation? For example farmer, student, or salaried?" },
    { key: 'income', question: "What is your yearly family income in rupees?" },
    { key: 'caste', question: "What is your caste category? General, OBC, SC, or ST?" },
];

const QUESTIONS_HI = [
    { key: 'name', question: "नमस्ते! मैं सहायक हूं। आपका नाम क्या है?" },
    { key: 'age', question: "आपकी उम्र कितनी है?" },
    { key: 'gender', question: "आप पुरुष हैं, महिला हैं, या अन्य?" },
    { key: 'state', question: "आप किस राज्य में रहते हैं?" },
    { key: 'residence', question: "आप गाँव में रहते हैं या शहर में?" },
    { key: 'occupation', question: "आप क्या काम करते हैं?" },
    { key: 'income', question: "आपकी सालाना पारिवारिक आय कितनी है?" },
    { key: 'caste', question: "आपकी जाति क्या है? सामान्य, ओबीसी, एससी, या एसटी?" },
];

const VoiceAssistant = ({ onClose, onComplete }) => {
    const [status, setStatus] = useState('idle');
    const [transcript, setTranscript] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [language, setLanguage] = useState('english');
    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const recognitionRef = useRef(null);
    const isMountedRef = useRef(true);
    const currentStepRef = useRef(0);
    const collectedDataRef = useRef({});
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const messagesEndRef = useRef(null);
    const selectedVoiceRef = useRef(null);
    const isProcessingRef = useRef(false);
    const isSpeakingRef = useRef(false);

    const questions = language === 'hindi' ? QUESTIONS_HI : QUESTIONS_EN;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    useEffect(() => {
        isMountedRef.current = true;
        loadBestVoice();
        return () => {
            isMountedRef.current = false;
            cleanup();
        };
    }, []);

    const loadBestVoice = () => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferred = [
                    'Google हिन्दी',
                    'Microsoft Kalpana',
                    'Microsoft Heera',
                    'Google UK English Female',
                    'Microsoft Zira',
                ];
                for (const name of preferred) {
                    const voice = voices.find(v => v.name.includes(name));
                    if (voice) {
                        selectedVoiceRef.current = voice;
                        return;
                    }
                }
                selectedVoiceRef.current =
                    voices.find(v => v.lang === 'en-IN') ||
                    voices.find(v => v.lang === 'hi-IN') ||
                    voices.find(v => v.name.toLowerCase().includes('female')) ||
                    voices[0];
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    };

    const setupAudioVisualization = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                if (!isMountedRef.current) return;
                analyser.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                setAudioLevel(avg);
                requestAnimationFrame(updateLevel);
            };
            updateLevel();
        } catch (e) {
            console.error('Audio setup failed:', e);
        }
    };

    const cleanup = () => {
        window.speechSynthesis.cancel();
        stopRecognition();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            try {
                if (audioContextRef.current.state !== 'closed') {
                    audioContextRef.current.close();
                }
            } catch (e) { }
            audioContextRef.current = null;
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.onend = null;
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.abort();
            } catch (e) { }
            recognitionRef.current = null;
        }
    };

    const handleClose = () => {
        cleanup();
        onClose();
    };

    const speak = (text) => {
        return new Promise((resolve) => {
            if (!isMountedRef.current) { resolve(); return; }

            stopRecognition();
            window.speechSynthesis.cancel();
            isSpeakingRef.current = true;

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
            if (selectedVoiceRef.current) utterance.voice = selectedVoiceRef.current;
            utterance.rate = 1.0;
            utterance.pitch = 1.1;

            utterance.onstart = () => {
                if (isMountedRef.current) setStatus('speaking');
            };
            utterance.onend = () => {
                isSpeakingRef.current = false;
                if (isMountedRef.current) setStatus('idle');
                resolve();
            };
            utterance.onerror = () => {
                isSpeakingRef.current = false;
                if (isMountedRef.current) setStatus('idle');
                resolve();
            };

            window.speechSynthesis.speak(utterance);
        });
    };

    const startListening = () => {
        if (!isMountedRef.current || completed || isMuted || isSpeakingRef.current || isProcessingRef.current) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice not supported. Please use Chrome or Edge.');
            return;
        }

        stopRecognition();

        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let hasResult = false;

        recognition.onstart = () => {
            console.log('Started listening for step', currentStepRef.current);
            if (isMountedRef.current) setStatus('listening');
        };

        recognition.onresult = (event) => {
            if (!isMountedRef.current) return;
            hasResult = true;
            const text = event.results[0][0].transcript.trim();
            console.log('Got result:', text);
            if (text) {
                handleUserResponse(text);
            }
        };

        recognition.onerror = (event) => {
            console.log('Recognition error:', event.error);
            if (!isMountedRef.current) return;
            setStatus('idle');

            // Only retry on no-speech, not other errors
            if (event.error === 'no-speech' && !completed && !isMuted && !isSpeakingRef.current && !isProcessingRef.current) {
                setTimeout(() => {
                    if (isMountedRef.current && !completed && !isMuted && !isSpeakingRef.current && !isProcessingRef.current) {
                        startListening();
                    }
                }, 500);
            }
        };

        recognition.onend = () => {
            console.log('Recognition ended, hasResult:', hasResult);
            if (!isMountedRef.current) return;
            setStatus('idle');

            // Only restart if we didn't get a result and not busy
            if (!hasResult && !completed && !isMuted && !isSpeakingRef.current && !isProcessingRef.current) {
                setTimeout(() => {
                    if (isMountedRef.current && !completed && !isMuted && !isSpeakingRef.current && !isProcessingRef.current) {
                        startListening();
                    }
                }, 500);
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (err) {
            console.error('Start failed:', err);
            if (isMountedRef.current) setStatus('idle');
        }
    };

    const parseAnswer = (key, text) => {
        const lower = text.toLowerCase().trim();

        switch (key) {
            case 'age':
                const ageNums = text.match(/\d+/);
                if (ageNums) return parseInt(ageNums[0]);
                const words = {
                    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
                    'sixty': 60, 'seventy': 70, 'eighty': 80,
                    'बीस': 20, 'तीस': 30, 'चालीस': 40, 'पचास': 50,
                    'साठ': 60, 'सत्तर': 70, 'अस्सी': 80
                };
                for (const [word, num] of Object.entries(words)) {
                    if (lower.includes(word)) return num;
                }
                return 30;

            case 'gender':
                if (lower.includes('female') || lower.includes('महिला') || lower.includes('औरत') || lower.includes('woman')) return 'female';
                if (lower.includes('other') || lower.includes('अन्य')) return 'other';
                return 'male';

            case 'residence':
                if (lower.includes('village') || lower.includes('गाँव') || lower.includes('gaon') || lower.includes('rural')) return 'rural';
                return 'urban';

            case 'occupation':
                if (lower.includes('farmer') || lower.includes('किसान')) return 'farmer';
                if (lower.includes('vendor') || lower.includes('रेहड़ी')) return 'street_vendor';
                if (lower.includes('daily') || lower.includes('मजदूर') || lower.includes('labor')) return 'daily_wage';
                if (lower.includes('domestic') || lower.includes('घरेलू')) return 'domestic_worker';
                if (lower.includes('student') || lower.includes('छात्र')) return 'student';
                if (lower.includes('self') || lower.includes('business') || lower.includes('खुद')) return 'self_employed';
                if (lower.includes('unemployed') || lower.includes('बेरोजगार')) return 'unemployed';
                if (lower.includes('salaried') || lower.includes('job') || lower.includes('नौकरी')) return 'salaried';
                return 'daily_wage';

            case 'income':
                const incomeNums = text.match(/\d+/g);
                if (incomeNums) {
                    let amount = parseInt(incomeNums.join(''));
                    if (lower.includes('lakh') || lower.includes('लाख')) amount = amount * 100000;
                    else if (lower.includes('thousand') || lower.includes('हजार') || lower.includes('हज़ार')) amount = amount * 1000;
                    return amount || 100000;
                }
                return 100000;

            case 'caste':
                if (lower.includes('sc') || lower.includes('scheduled caste')) return 'sc';
                if (lower.includes('st') || lower.includes('scheduled tribe')) return 'st';
                if (lower.includes('obc') || lower.includes('backward')) return 'obc';
                return 'general';

            case 'state':
                return text.trim();

            case 'name':
            default:
                let name = text.trim();
                name = name.replace(/^(my name is|i am|मेरा नाम|main hun|mein hoon)\s+/i, '');
                name = name.replace(/\s+(hai|hun|है|hoon)$/i, '');
                return name.trim();
        }
    };
    const handleUserResponse = async (text) => {
        if (!isMountedRef.current || isProcessingRef.current) return;

        isProcessingRef.current = true;
        stopRecognition();

        setTranscript(prev => [...prev, { role: 'user', text }]);
        setStatus('thinking');

        const currentQ = questions[currentStepRef.current];

        let value = null;
        let isValid = false;

        try {
            const response = await fetch(`${API_URL}/voice-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    field: currentQ.key,
                    language: language,
                }),
            });

            const data = await response.json();
            value = data.value;
            isValid = data.valid && value !== null;
        } catch (error) {
            console.error('Extract error:', error);
            isValid = false;
        }

        // If invalid answer, ask again
        if (!isValid) {
            const retryMessages = {
                english: {
                    age: "I didn't understand. Please tell me your age in years, like 25 or 32.",
                    gender: "Please say male, female, or other.",
                    state: "Please tell me your state, like Maharashtra or Delhi.",
                    residence: "Do you live in a village or a city?",
                    occupation: "Please tell me your work. For example: farmer, student, daily wage worker, or salaried.",
                    income: "Please tell me your yearly income in rupees, like 50 thousand or 2 lakh.",
                    caste: "Please say General, OBC, SC, or ST.",
                },
                hindi: {
                    age: "समझ नहीं आया। कृपया अपनी उम्र बताएं, जैसे 25 या 32 साल।",
                    gender: "कृपया कहें पुरुष, महिला, या अन्य।",
                    state: "कृपया अपना राज्य बताएं, जैसे महाराष्ट्र या दिल्ली।",
                    residence: "आप गाँव में रहते हैं या शहर में?",
                    occupation: "कृपया अपना काम बताएं। जैसे किसान, छात्र, मजदूर, या नौकरी।",
                    income: "कृपया अपनी सालाना आय रुपये में बताएं, जैसे 50 हजार या 2 लाख।",
                    caste: "कृपया कहें सामान्य, ओबीसी, एससी, या एसटी।",
                }
            };

            const retryMsg = retryMessages[language][currentQ.key] || questions[currentStepRef.current].question;

            setTranscript(prev => [...prev, { role: 'ai', text: retryMsg }]);
            await speak(retryMsg);

            isProcessingRef.current = false;

            if (isMountedRef.current && !completed && !isMuted) {
                startListening();
            }
            return;
        }

        // Valid answer - save and move to next
        collectedDataRef.current[currentQ.key] = value;

        console.log('Collected:', currentQ.key, '=', value);
        console.log('Progress:', currentStepRef.current + 1, '/', questions.length);

        const nextStep = currentStepRef.current + 1;
        currentStepRef.current = nextStep;
        setCurrentStep(nextStep);

        if (nextStep >= questions.length) {
            isProcessingRef.current = false;
            await submitResults();
        } else {
            const nextQuestion = questions[nextStep].question;
            setTranscript(prev => [...prev, { role: 'ai', text: nextQuestion }]);
            await speak(nextQuestion);

            isProcessingRef.current = false;

            if (isMountedRef.current && !completed && !isMuted) {
                startListening();
            }
        }
    };

    const submitResults = async () => {
        if (!isMountedRef.current) return;

        setStatus('thinking');

        const processingMsg = language === 'hindi'
            ? 'बहुत बढ़िया! अब मैं आपकी योजनाएं ढूंढ रहा हूं।'
            : 'Great! Now let me find your schemes.';

        setTranscript(prev => [...prev, { role: 'ai', text: processingMsg }]);
        await speak(processingMsg);

        try {
            const data = collectedDataRef.current;
            const payload = {
                name: data.name || 'Friend',
                age: parseInt(data.age) || 30,
                gender: data.gender || 'male',
                state: data.state || 'Maharashtra',
                residence: data.residence || 'rural',
                occupation: data.occupation || 'daily_wage',
                income: parseInt(data.income) || 100000,
                caste: data.caste || 'general',
                has_bank_account: true,
                has_ration_card: true,
                has_children: false,
                is_pregnant: false,
                language: language,
            };

            const response = await fetch(`${API_URL}/find-schemes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (responseData.success && isMountedRef.current) {
                const benefitLakh = (responseData.total_annual_benefit / 100000).toFixed(1);

                let resultMsg;
                if (language === 'hindi') {
                    resultMsg = 'बधाई हो ' + responseData.user_name + '! आप ' + responseData.total_schemes + ' योजनाओं के हकदार हैं। कुल ' + benefitLakh + ' लाख रुपये मिल सकते हैं।';
                } else {
                    resultMsg = 'Congratulations ' + responseData.user_name + '! You qualify for ' + responseData.total_schemes + ' schemes worth ' + benefitLakh + ' lakh rupees per year.';
                }

                setTranscript(prev => [...prev, { role: 'ai', text: resultMsg }]);
                setCompleted(true);
                setStatus('idle');

                await speak(resultMsg);

                if (onComplete && isMountedRef.current) {
                    setTimeout(() => onComplete(responseData), 1500);
                }
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (isMountedRef.current) {
                const errorMsg = language === 'hindi' ? 'माफ करें।' : 'Sorry.';
                setTranscript(prev => [...prev, { role: 'ai', text: errorMsg }]);
                await speak(errorMsg);
            }
        }
    };

    const handleStart = async (lang) => {
        setLanguage(lang);
        setStarted(true);
        currentStepRef.current = 0;
        setCurrentStep(0);
        collectedDataRef.current = {};
        isProcessingRef.current = false;
        isSpeakingRef.current = false;

        await setupAudioVisualization();

        const firstQ = (lang === 'hindi' ? QUESTIONS_HI : QUESTIONS_EN)[0].question;

        setTranscript([{ role: 'ai', text: firstQ }]);

        await new Promise(r => setTimeout(r, 300));
        await speak(firstQ);

        if (isMountedRef.current && !completed) {
            setTimeout(() => startListening(), 300);
        }
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (newMuted) {
            stopRecognition();
            setStatus('idle');
        } else if (!completed && !isSpeakingRef.current && !isProcessingRef.current) {
            setTimeout(() => startListening(), 300);
        }
    };

    const getStatusText = () => {
        if (isMuted) return 'Muted';
        switch (status) {
            case 'listening': return 'Listening...';
            case 'thinking': return 'Processing...';
            case 'speaking': return 'Speaking...';
            default: return 'Ready';
        }
    };

    return (
        <div className="va-overlay">
            <div className="va-modal">
                <div className="va-header">
                    <div className="va-header-left">
                        <div className="va-bot-icon">
                            <Bot size={20} />
                        </div>
                        <div>
                            <div className="va-title">HaqDar Sahayak</div>
                            <div className="va-subtitle">
                                {getStatusText()} {started && !completed && `· Question ${currentStep + 1}/${questions.length}`}
                            </div>
                        </div>
                    </div>
                    <button className="va-close" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                {!started ? (
                    <div className="va-welcome">
                        <div className="va-welcome-icon">
                            <Bot size={48} />
                        </div>
                        <h3>Hi! I'm Sahayak</h3>
                        <p>Answer 8 simple questions by voice to discover your government benefits</p>
                        <div className="va-lang-buttons">
                            <button className="va-lang-btn" onClick={() => handleStart('english')}>
                                Start in English
                            </button>
                            <button className="va-lang-btn" onClick={() => handleStart('hindi')}>
                                हिंदी में शुरू करें
                            </button>
                        </div>
                        <p className="va-hint">
                            Just talk naturally. Works best in Chrome or Edge.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="va-visualizer">
                            <div className={`va-orb ${status}`}>
                                <div className="va-orb-inner" style={{
                                    transform: `scale(${1 + (audioLevel / 300)})`,
                                }}>
                                    <Bot size={48} color="white" />
                                </div>
                                <div className="va-orb-ring" />
                                <div className="va-orb-ring va-orb-ring-2" />
                            </div>
                        </div>

                        <div className="va-messages">
                            {transcript.map((msg, i) => (
                                <div key={i} className={`va-message va-message-${msg.role}`}>
                                    <div className="va-message-icon">
                                        {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className="va-message-text">{msg.text}</div>
                                </div>
                            ))}
                            {status === 'thinking' && (
                                <div className="va-message va-message-ai">
                                    <div className="va-message-icon">
                                        <Bot size={16} />
                                    </div>
                                    <div className="va-message-text">
                                        <Loader2 size={16} className="spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="va-footer-controls">
                            <button
                                className={`va-control-btn ${isMuted ? 'active' : ''}`}
                                onClick={toggleMute}
                                title={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>

                            <button
                                className="va-control-btn end"
                                onClick={handleClose}
                                title="End conversation"
                            >
                                <PhoneOff size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VoiceAssistant;