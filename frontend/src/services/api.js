import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('[API Error]:', message);
    return Promise.reject(error);
  }
);

/**
 * Post Generation API
 */
export const generationAPI = {
  /**
   * Generate X post using AI
   * @param {string} userInput - User's topic/idea
   * @returns {Promise} API response
   */
  generatePost: async (userInput) => {
    const response = await api.post('/api/generate', { userInput });
    return response.data;
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
