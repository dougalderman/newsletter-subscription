import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { signup, verifyEmail, getAnalytics, login } from '../services/usersService';
import { setAccessToken } from '../services/authStore';

// Hook for signing up a new user (Create)
export const useSignup = () => {
  
  return useMutation({
    mutationFn: signup
  });
};

// Hook for verifying email (Create)
export const useVerifyEmail = () => {
  
  return useMutation({
    mutationFn: verifyEmail,
  });
};

// Hook for fetching analytics data (Read)
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics
  });
};

// Hook for logging in
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    
    onSuccess: (data: any) => {
      // Save token directly into your runtime memory variable.
      setAccessToken(data.token);
      
      // Wipe old cache and trigger fetch for the new user's profile
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
