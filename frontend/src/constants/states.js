// src/constants/states.js
export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

// src/constants/occupations.js
export const OCCUPATIONS = [
    { value: 'farmer', label: 'Farmer', hi: 'किसान', emoji: '🌾' },
    { value: 'daily_wage', label: 'Daily Wage', hi: 'मजदूर', emoji: '🛠️' },
    { value: 'street_vendor', label: 'Street Vendor', hi: 'रेहड़ीवाला', emoji: '🛒' },
    { value: 'domestic_worker', label: 'Domestic Worker', hi: 'घरेलू काम', emoji: '🏠' },
    { value: 'student', label: 'Student', hi: 'छात्र', emoji: '📚' },
    { value: 'self_employed', label: 'Self Employed', hi: 'खुद का काम', emoji: '💼' },
    { value: 'unemployed', label: 'Unemployed', hi: 'बेरोजगार', emoji: '🔍' },
    { value: 'salaried', label: 'Salaried', hi: 'नौकरी', emoji: '🏢' },
];

export const INCOME_OPTIONS = [
    { label: 'Below ₹50,000', hi: '₹50,000 से कम', value: 49000 },
    { label: '₹50,000 – ₹1 lakh', hi: '₹50,000 – ₹1 लाख', value: 99000 },
    { label: '₹1 lakh – ₹2 lakh', hi: '₹1 लाख – ₹2 लाख', value: 190000 },
    { label: '₹2 lakh – ₹3 lakh', hi: '₹2 लाख – ₹3 लाख', value: 290000 },
    { label: 'Above ₹3 lakh', hi: '₹3 लाख से ज़्यादा', value: 400000 },
];