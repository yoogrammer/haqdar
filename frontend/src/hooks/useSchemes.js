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

            // Track event (optional)
            if (window.gtag) {
                window.gtag('event', 'schemes_found', {
                    count: response.data.total_schemes,
                    benefit: response.data.total_annual_benefit,
                });
            }

            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.userMessage || 'Something went wrong';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return { results, loading, error, findSchemes, reset };
};