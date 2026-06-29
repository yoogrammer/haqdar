// src/components/Form.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    User, MapPin, Wallet, FileCheck,
    ArrowLeft, ArrowRight, Search, Loader2,
    Home, Building2, AlertCircle, Check
} from 'lucide-react';
import { INDIAN_STATES } from '../constants/states';
import { OCCUPATIONS, INCOME_OPTIONS } from '../constants/occupations';
import { FORM_CONFIG, LANGUAGES } from '../constants/config';

const INITIAL_FORM_STATE = {
    name: '', age: '', gender: '', state: '',
    residence: '', occupation: '', income: '', caste: '',
    has_bank_account: false, has_ration_card: false,
    has_children: false, is_pregnant: false,
    language: LANGUAGES.ENGLISH,
};

const STEP_ICONS = [User, MapPin, Wallet, FileCheck];

const Form = ({ onSubmit, loading, error: externalError }) => {
    const [step, setStep] = useState(1);
    const [language, setLanguage] = useState(LANGUAGES.ENGLISH);
    const [localError, setLocalError] = useState('');
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    const hi = language === LANGUAGES.HINDI;
    const totalSteps = FORM_CONFIG.TOTAL_STEPS;
    const error = externalError || localError;

    // Load saved data
    useEffect(() => {
        try {
            const saved = localStorage.getItem(FORM_CONFIG.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setFormData(parsed);
                if (parsed.language) setLanguage(parsed.language);
            }
        } catch (e) { /* ignore */ }
    }, []);

    // Save on change
    useEffect(() => {
        try {
            localStorage.setItem(FORM_CONFIG.STORAGE_KEY, JSON.stringify(formData));
        } catch (e) { /* ignore */ }
    }, [formData]);

    const handleChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setLocalError('');
    }, []);

    const handleLanguageChange = useCallback((lang) => {
        setLanguage(lang);
        handleChange('language', lang);
    }, [handleChange]);

    const validateStep = useCallback((stepNum) => {
        const errors = [];
        if (stepNum === 1) {
            if (!formData.name?.trim()) errors.push(hi ? 'नाम जरूरी है' : 'Name is required');
            if (!formData.age) errors.push(hi ? 'उम्र जरूरी है' : 'Age is required');
            else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
                errors.push(hi ? 'सही उम्र दर्ज करें' : 'Enter valid age');
            }
            if (!formData.gender) errors.push(hi ? 'लिंग चुनें' : 'Select gender');
            if (!formData.state) errors.push(hi ? 'राज्य चुनें' : 'Select state');
        }
        if (stepNum === 2) {
            if (!formData.residence) errors.push(hi ? 'रहने का स्थान चुनें' : 'Select residence');
            if (!formData.occupation) errors.push(hi ? 'काम चुनें' : 'Select occupation');
        }
        if (stepNum === 3) {
            if (!formData.income) errors.push(hi ? 'आय चुनें' : 'Select income');
            if (!formData.caste) errors.push(hi ? 'श्रेणी चुनें' : 'Select category');
        }
        return errors;
    }, [formData, hi]);

    const canProceed = useMemo(() => validateStep(step).length === 0, [step, validateStep]);

    const handleSubmit = useCallback(async () => {
        const errors = validateStep(step);
        if (errors.length > 0) {
            setLocalError(errors[0]);
            return;
        }
        const payload = {
            ...formData,
            name: formData.name.trim(),
            age: parseInt(formData.age),
            income: parseInt(formData.income),
            language,
        };
        const result = await onSubmit(payload);
        if (result?.success) {
            try { localStorage.removeItem(FORM_CONFIG.STORAGE_KEY); } catch (e) { }
        }
    }, [formData, language, onSubmit, step, validateStep]);

    const next = useCallback(() => {
        const errors = validateStep(step);
        if (errors.length > 0) { setLocalError(errors[0]); return; }
        setLocalError('');
        step < totalSteps ? setStep(s => s + 1) : handleSubmit();
    }, [step, totalSteps, validateStep, handleSubmit]);

    const back = useCallback(() => {
        setLocalError('');
        setStep(s => Math.max(1, s - 1));
    }, []);

    const stepTitles = useMemo(() => hi
        ? ['व्यक्तिगत जानकारी', 'स्थान और काम', 'आय और श्रेणी', 'अतिरिक्त जानकारी']
        : ['Personal Info', 'Location & Work', 'Income & Category', 'Additional Details'],
        [hi]
    );

    const stepSubtitles = useMemo(() => hi
        ? ['आपके बारे में बताएं', 'आप कहाँ हैं और क्या करते हैं', 'आपकी आर्थिक जानकारी', 'कुछ और विवरण']
        : ['Tell us about yourself', 'Where you live and work', 'Your financial details', 'A few more details'],
        [hi]
    );

    return (
        <div className="form-card">

            {/* HEADER */}
            <header className="form-header">
                {/* Stepper */}
                <nav className="stepper" aria-label="Form progress">
                    {[1, 2, 3, 4].map(n => {
                        const Icon = STEP_ICONS[n - 1];
                        const isActive = step >= n;
                        const isCurrent = step === n;
                        const isDone = step > n;
                        return (
                            <React.Fragment key={n}>
                                <button
                                    type="button"
                                    className={`step-dot ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                                    onClick={() => isDone && setStep(n)}
                                    disabled={!isDone && !isCurrent}
                                    aria-label={`Step ${n}`}
                                >
                                    {isDone ? <Check size={13} strokeWidth={3} /> : <Icon size={13} strokeWidth={2.5} />}
                                </button>
                                {n < totalSteps && <div className={`step-line ${step > n ? 'active' : ''}`} />}
                            </React.Fragment>
                        );
                    })}
                </nav>

                {/* Language toggle */}
                <div className="lang-switch" role="group" aria-label="Language">
                    <button
                        type="button"
                        className={`lang-pill ${language === LANGUAGES.ENGLISH ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(LANGUAGES.ENGLISH)}
                    >EN</button>
                    <span className="lang-divider">|</span>
                    <button
                        type="button"
                        className={`lang-pill ${language === LANGUAGES.HINDI ? 'active' : ''}`}
                        onClick={() => handleLanguageChange(LANGUAGES.HINDI)}
                    >हि</button>
                </div>
            </header>

            {/* BODY */}
            <div className="form-body">
                <div className="step-label">
                    {hi ? `चरण ${step} / ${totalSteps}` : `Step ${step} of ${totalSteps}`}
                </div>
                <h2 className="form-title">{stepTitles[step - 1]}</h2>
                <p className="form-subtitle">{stepSubtitles[step - 1]}</p>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="step-content">
                        <div className="field">
                            <label htmlFor="name">{hi ? 'आपका नाम' : 'Your name'}</label>
                            <input
                                id="name"
                                className="input"
                                type="text"
                                autoComplete="name"
                                placeholder={hi ? 'जैसे: सुनीता देवी' : 'e.g. your name'}
                                value={formData.name}
                                onChange={e => handleChange('name', e.target.value)}
                                maxLength={100}
                            />
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label htmlFor="age">{hi ? 'उम्र' : 'Age'}</label>
                                <input
                                    id="age"
                                    className="input"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={e => handleChange('age', e.target.value)}
                                    min="1" max="120"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="state">{hi ? 'राज्य' : 'State'}</label>
                                <select
                                    id="state"
                                    className="input"
                                    value={formData.state}
                                    onChange={e => handleChange('state', e.target.value)}
                                >
                                    <option value="">{hi ? 'चुनें...' : 'Select...'}</option>
                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label>{hi ? 'लिंग' : 'Gender'}</label>
                            <div className="segmented" role="radiogroup">
                                {[
                                    { v: 'male', l: hi ? 'पुरुष' : 'Male' },
                                    { v: 'female', l: hi ? 'महिला' : 'Female' },
                                    { v: 'other', l: hi ? 'अन्य' : 'Other' },
                                ].map(g => (
                                    <button
                                        key={g.v}
                                        type="button"
                                        role="radio"
                                        aria-checked={formData.gender === g.v}
                                        className={`segment ${formData.gender === g.v ? 'selected' : ''}`}
                                        onClick={() => handleChange('gender', g.v)}
                                    >{g.l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="step-content">
                        <div className="field">
                            <label>{hi ? 'आप कहाँ रहते हैं?' : 'Where do you live?'}</label>
                            <div className="card-choice-group">
                                <button
                                    type="button"
                                    className={`card-choice ${formData.residence === 'rural' ? 'selected' : ''}`}
                                    onClick={() => handleChange('residence', 'rural')}
                                >
                                    <div className="cc-icon"><Home size={18} /></div>
                                    <div>
                                        <div className="cc-title">{hi ? 'गाँव' : 'Village'}</div>
                                        <div className="cc-sub">{hi ? 'ग्रामीण क्षेत्र' : 'Rural area'}</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`card-choice ${formData.residence === 'urban' ? 'selected' : ''}`}
                                    onClick={() => handleChange('residence', 'urban')}
                                >
                                    <div className="cc-icon"><Building2 size={18} /></div>
                                    <div>
                                        <div className="cc-title">{hi ? 'शहर' : 'City'}</div>
                                        <div className="cc-sub">{hi ? 'शहरी क्षेत्र' : 'Urban area'}</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="field">
                            <label>{hi ? 'आपका काम' : 'Your occupation'}</label>
                            <div className="grid-2">
                                {OCCUPATIONS.map(o => (
                                    <button
                                        key={o.value}
                                        type="button"
                                        className={`grid-item ${formData.occupation === o.value ? 'selected' : ''}`}
                                        onClick={() => handleChange('occupation', o.value)}
                                    >
                                        <span className="grid-emoji">{o.emoji}</span>
                                        <span className="grid-label">{hi ? o.hi : o.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="step-content">
                        <div className="field">
                            <label>{hi ? 'सालाना पारिवारिक आय' : 'Annual family income'}</label>
                            <div className="stack">
                                {INCOME_OPTIONS.map(inc => (
                                    <button
                                        key={inc.value}
                                        type="button"
                                        className={`stack-item ${parseInt(formData.income) === inc.value ? 'selected' : ''}`}
                                        onClick={() => handleChange('income', inc.value.toString())}
                                    >
                                        <span>{hi ? inc.hi : inc.label}</span>
                                        {parseInt(formData.income) === inc.value && (
                                            <span className="stack-check"><Check size={14} strokeWidth={3} /></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="field">
                            <label>{hi ? 'जाति वर्ग' : 'Category'}</label>
                            <div className="segmented">
                                {[
                                    { v: 'general', l: 'General', hi: 'सामान्य' },
                                    { v: 'obc', l: 'OBC', hi: 'OBC' },
                                    { v: 'sc', l: 'SC', hi: 'SC' },
                                    { v: 'st', l: 'ST', hi: 'ST' },
                                ].map(c => (
                                    <button
                                        key={c.v}
                                        type="button"
                                        className={`segment ${formData.caste === c.v ? 'selected' : ''}`}
                                        onClick={() => handleChange('caste', c.v)}
                                    >{hi ? c.hi : c.l}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                    <div className="step-content">
                        <p className="field-hint">
                            {hi ? 'जो भी आप पर लागू हो वह चुनें (वैकल्पिक)' : 'Select whatever applies (optional)'}
                        </p>
                        <div className="toggle-list">
                            {[
                                { field: 'has_bank_account', label: 'I have a bank account', hi: 'मेरा बैंक खाता है' },
                                { field: 'has_ration_card', label: 'I have a ration card', hi: 'मेरे पास राशन कार्ड है' },
                                { field: 'has_children', label: 'School-going children', hi: 'पढ़ने वाले बच्चे हैं' },
                                { field: 'is_pregnant', label: 'Pregnant (women only)', hi: 'गर्भवती महिला' },
                            ].map(item => (
                                <div
                                    key={item.field}
                                    className={`toggle-item ${formData[item.field] ? 'on' : ''}`}
                                    onClick={() => handleChange(item.field, !formData[item.field])}
                                >
                                    <span>{hi ? item.hi : item.label}</span>
                                    <div className={`toggle ${formData[item.field] ? 'on' : ''}`}>
                                        <div className="toggle-knob" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="error-alert" role="alert">
                        <AlertCircle size={15} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer className="form-footer">
                {step > 1 ? (
                    <button type="button" className="btn btn-ghost" onClick={back} disabled={loading}>
                        <ArrowLeft size={15} /> {hi ? 'पीछे' : 'Back'}
                    </button>
                ) : <div />}

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={next}
                    disabled={loading || !canProceed}
                >
                    {loading ? (
                        <><Loader2 size={15} className="spin" /> {hi ? 'खोज रहे हैं...' : 'Finding...'}</>
                    ) : step === totalSteps ? (
                        <><Search size={15} /> {hi ? 'योजनाएं खोजें' : 'Find My Schemes'}</>
                    ) : (
                        <>{hi ? 'आगे' : 'Continue'} <ArrowRight size={15} /></>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default React.memo(Form);