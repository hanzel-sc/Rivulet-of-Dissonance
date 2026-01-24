// API Configuration
// Change this if your backend runs on a different port
export const API_BASE_URL = "http://localhost:8000";

// Helper function to build API URLs
export const apiUrl = (path) => `${API_BASE_URL}${path}`;
