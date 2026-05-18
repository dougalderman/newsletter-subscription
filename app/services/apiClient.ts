import axios from 'axios';

let accessToken: string = '';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true// Required to send the refresh token cookie.
});

export const setAccessToken = (token: string) => {
  accessToken = token;
};

apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }  
    return config;
  },
  (error) => Promise.reject(error)
);

