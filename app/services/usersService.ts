import { apiClient } from './apiClient';

export const signup = async (payload: any) => {
  const data = await apiClient.post('/signup', payload);
  return data;
}

export const verifyEmail = async (payload: any) => {
  const data = await apiClient.post('/verify-email', payload);
  return data;
}