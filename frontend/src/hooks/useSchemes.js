// src/hooks/useSchemes.js
import { useState, useCallback } from 'react';
import { schemeAPI } from '../services/api';

export const useSchemes = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const findSchemes = useCallback(async (profile) => {
        setLoading(true);
        setError(null);

        try {
            const response = await schemeAPI.findSchemes(profile);
            setResults(response.data);

            if (window.gtag) {
                window.gtag('event', 'schemes_found', {
                    count: response.data.total_schemes,
                    benefit: response.data.total_annual_benefit,
                });
            }

            return { success: true, data: response.data };
        } catch (err) {
            let errorMessage = 'Something went wrong. Please try again.';

            try {
                if (typeof err === 'string') {
                    errorMessage = err;
                } else if (err?.userMessage && typeof err.userMessage === 'string') {
                    errorMessage = err.userMessage;
                } else if (err?.response?.data?.detail) {
                    const detail = err.response.data.detail;
                    if (typeof detail === 'string') {
                        errorMessage = detail;
                    } else if (Array.isArray(detail)) {
                        // Pydantic validation errors
                        errorMessage = detail.map(d => {
                            if (typeof d === 'string') return d;
                            if (d?.msg) return d.msg;
                            return 'Invalid input';
                        }).join(', ');
                    } else if (typeof detail === 'object') {
                        errorMessage = detail?.msg || 'Invalid input. Please check your details.';
                    }
                } else if (err?.message && typeof err.message === 'string') {
                    errorMessage = err.message;
                }
            } catch (e) {
                errorMessage = 'Something went wrong. Please try again.';
            }

            setError(errorMessage);
            console.error('Find schemes failed:', err);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const setResultsDirectly = useCallback((data) => {
        setResults(data);
    }, []);

    const reset = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return { results, loading, error, findSchemes, reset, setResultsDirectly };
};