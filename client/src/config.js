// API Configuration
// Use environment variable in production, localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to build API URLs
export const apiUrl = (path) => `${API_BASE_URL}${path}`;