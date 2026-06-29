// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://haqdar-lt5n.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`→ ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`← ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            error.userMessage = 'Request timed out. Please try again.';
        } else if (!error.response) {
            error.userMessage = 'Cannot connect to server. Please check your connection.';
        } else if (error.response.status === 500) {
            error.userMessage = 'Server error. Please try again in a moment.';
        } else {
            error.userMessage = error.response?.data?.detail || 'Something went wrong.';
        }
        return Promise.reject(error);
    }
);

// API methods
export const schemeAPI = {
    findSchemes: (profile) => api.post('/find-schemes', profile),
    getAllSchemes: () => api.get('/schemes'),
    healthCheck: () => api.get('/health'),
};

export default api;