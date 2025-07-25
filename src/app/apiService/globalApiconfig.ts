import axios from 'axios';
import { trackLogoutReason, debugTokenStatus } from '../utils/tokenUtils';

// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.okpuja.com/api' || 'https://backend.okpuja.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

// Multi-tab token synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('token-updated', (event: any) => {
    const { access, refresh } = event.detail;
    localStorage.setItem('access', access);
    if (refresh) {
      localStorage.setItem('refresh', refresh);
    }
  });

  window.addEventListener('logout', () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    window.location.href = '/login';
  });
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access, refresh } = response.data;
          
          // Store both new tokens (token rotation)
          localStorage.setItem('access', access);
          if (refresh) {
            localStorage.setItem('refresh', refresh);
          }
          
          // Update the authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Notify other tabs about token update
          window.dispatchEvent(new CustomEvent('token-updated', { 
            detail: { access, refresh } 
          }));
          
          processQueue(null, access);
          isRefreshing = false;
          
          // Retry the original request
          return apiClient(originalRequest);
          
        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError);
          
          // Check if it's a network error
          if (!refreshError.response) {
            trackLogoutReason('network_error', refreshError);
          } else if (refreshError.response?.status === 400) {
            trackLogoutReason('invalid_refresh_token', refreshError.response.data);
          } else if (refreshError.response?.status === 401) {
            trackLogoutReason('refresh_token_expired', refreshError.response.data);
          } else {
            trackLogoutReason('refresh_failed', refreshError);
          }
          
          debugTokenStatus();
          
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Clear auth data and redirect to login
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('user');
          
          // Notify other tabs about logout
          window.dispatchEvent(new CustomEvent('logout'));
          
          // Only redirect if we're in the browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        console.error('No refresh token available for token refresh');
        trackLogoutReason('no_refresh_token');
        debugTokenStatus();
        
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        
        // Notify other tabs about logout
        window.dispatchEvent(new CustomEvent('logout'));
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        isRefreshing = false;
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;