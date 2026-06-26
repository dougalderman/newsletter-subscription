import axios from 'axios';

import { getAccessToken } from './authStore';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach token if it exists in memory
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);