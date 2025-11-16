import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
 * Prompt Management APIs
 */
export const promptsAPI = {
  getAll: async () => {
    const response = await api.get('/api/prompts');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/prompts/${id}`);
    return response.data;
  },

  create: async (promptData) => {
    const response = await api.post('/api/prompts', promptData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/api/prompts/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/prompts/${id}`);
    return response.data;
  }
};

/**
 * Post Generation API
 */
export const generationAPI = {
  generatePost: async (data) => {
    const response = await api.post('/api/generate-post', data);
    return response.data;
  }
};

export default api;
