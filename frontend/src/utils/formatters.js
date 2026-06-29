// src/utils/formatters.js

/**
 * Format number as Indian Rupees
 */
export const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format compact (1.2L, 5K)
 */
export const formatCompact = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
};

/**
 * Format with Indian comma system
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Capitalize first letter of each word
 */
export const titleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};