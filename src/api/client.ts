import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const url = error.config?.url || '';

    // For login endpoint, don't redirect - let the component handle the error
    if (url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Handle 401 - Token expired or invalid (only for protected routes)
    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 - Account deactivated
    if (status === 403 && (data?.code === 'ACCOUNT_DEACTIVATED' || data?.code === 'DOCTOR_DEACTIVATED')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.setItem('deactivation_message', data?.message || 'Your account has been deactivated.');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper to get full URL for file downloads
export const getFileUrl = (path: string | null): string => {
  if (!path) return ''
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const BASE_URL = API_BASE.replace('/api', '')
  return `${BASE_URL}${path}`
}

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;
    const status = error.response?.status;

    // Handle 422 validation errors - return all field errors
    if (status === 422 && response?.errors) {
      const errors = response.errors;
      const errorMessages = [];

      // Collect all field errors
      for (const [, messages] of Object.entries(errors)) {
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        }
      }

      if (errorMessages.length > 0) {
        return errorMessages.join('. ');
      }
    }

    if (response?.message) return response.message;
    if (response?.errors) {
      const firstError = Object.values(response.errors)[0];
      if (firstError) {
        return Array.isArray(firstError) ? String(firstError[0]) : String(firstError);
      }
    }
  }
  return 'An unexpected error occurred';
};