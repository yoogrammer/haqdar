// src/components/SchemeGuide.jsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, AlertCircle, Lightbulb, MapPin, Clock, ExternalLink, Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const SchemeGuide = ({ scheme, onClose }) => {
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [activeTab, setActiveTab] = useState('roadmap');

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const response = await fetch(`${API_URL}/scheme-guide/${scheme.id}`);
                const data = await response.json();
                setGuide(data);

                const saved = localStorage.getItem(`checklist-${scheme.id}`);
                if (saved) {
                    setCheckedItems(new Set(JSON.parse(saved)));
                }
            } catch (error) {
                console.error('Failed to fetch guide:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuide();
    }, [scheme.id]);

    const toggleCheck = (id) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(id)) {
            newChecked.delete(id);
        } else {
            newChecked.add(id);
        }
        setCheckedItems(newChecked);
        localStorage.setItem(`checklist-${scheme.id}`, JSON.stringify([...newChecked]));
    };

    const progress = guide ? Math.round((checkedItems.size / guide.checklist.length) * 100) : 0;

    if (loading) {
        return (
            <div className="sg-overlay">
                <div className="sg-modal sg-loading">
                    <Loader2 size={40} className="spin" />
                    <p>Loading guide...</p>
                </div>
            </div>
        );
    }

    if (!guide) return null;

    return (
        <div className="sg-overlay" onClick={onClose}>
            <div className="sg-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sg-header">
                    <div style={{ flex: 1 }}>
                        <div className="sg-category">{scheme.category}</div>
                        <h2 className="sg-title">{scheme.name}</h2>
                        <p className="sg-title-hi">{scheme.name_hindi}</p>
                    </div>
                    <button className="sg-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sg-info-cards">
                    <div className="sg-info-card">
                        <MapPin size={16} />
                        <div>
                            <div className="sg-info-label">Apply At</div>
                            <div className="sg-info-value">{scheme.apply_at}</div>
                        </div>
                    </div>
                    <div className="sg-info-card">
                        <Clock size={16} />
                        <div>
                            <div className="sg-info-label">Processing</div>
                            <div className="sg-info-value">{guide.estimated_time}</div>
                        </div>
                    </div>
                </div>

                <div className="sg-progress-section">
                    <div className="sg-progress-header">
                        <span>Your Progress</span>
                        <span className="sg-progress-percent">{progress}%</span>
                    </div>
                    <div className="sg-progress-bar">
                        <div className="sg-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="sg-tabs">
                    <button
                        className={`sg-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roadmap')}
                    >
                        📋 Roadmap
                    </button>
                    <button
                        className={`sg-tab ${activeTab === 'checklist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('checklist')}
                    >
                        ✅ Checklist
                    </button>
                    <button
                        className={`sg-tab ${activeTab === 'warnings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('warnings')}
                    >
                        ⚠️ Warnings
                    </button>
                </div>

                <div className="sg-content">
                    {activeTab === 'roadmap' && (
                        <div className="sg-roadmap">
                            {guide.roadmap.map((step) => (
                                <div key={step.step} className="sg-step">
                                    <div className="sg-step-number">{step.step}</div>
                                    <div className="sg-step-content">
                                        <div className="sg-step-title">
                                            <span className="sg-step-icon">{step.icon}</span>
                                            {step.title}
                                        </div>
                                        <p className="sg-step-desc">{step.description}</p>
                                    </div>
                                </div>
                            ))}

                            {scheme.apply_online && (
                                <a
                                    href={scheme.apply_online}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sg-apply-btn"
                                >
                                    Go to Official Portal <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    )}

                    {activeTab === 'checklist' && (
                        <div>
                            <p className="sg-checklist-desc">Track your progress as you apply</p>
                            <div className="sg-checklist">
                                {guide.checklist.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`sg-check-item ${checkedItems.has(item.id) ? 'checked' : ''}`}
                                        onClick={() => toggleCheck(item.id)}
                                    >
                                        {checkedItems.has(item.id) ? (
                                            <CheckCircle2 size={20} className="sg-check-icon done" />
                                        ) : (
                                            <Circle size={20} className="sg-check-icon" />
                                        )}
                                        <span>{item.task}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'warnings' && (
                        <div className="sg-warnings-tab">
                            <div className="sg-warnings-section">
                                <div className="sg-section-title">
                                    <AlertCircle size={16} />
                                    Common Rejection Reasons
                                </div>
                                {guide.common_rejections.map((reason, i) => (
                                    <div key={i} className="sg-warning-item">
                                        <span className="sg-warning-bullet">✗</span>
                                        <span>{reason}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="sg-tips-section">
                                <div className="sg-section-title">
                                    <Lightbulb size={16} />
                                    Smart Tips
                                </div>
                                {guide.tips.map((tip, i) => (
                                    <div key={i} className="sg-tip-item">
                                        <span className="sg-tip-bullet">💡</span>
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemeGuide;