import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnalytics, signup, verifyEmail, login } from '../services/usersService';

// Hook for fetching analytics data (Read)
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics
  });
};

// Hook for signing up a new user (Create)
export const useSignup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: signup
  });
};

// Hook for verifying email (Update)
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: verifyEmail,
  });
};

// Hook for logging in a user (Update)
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login
  });
};
