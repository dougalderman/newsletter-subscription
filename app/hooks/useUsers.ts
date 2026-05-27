import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup, verifyEmail } from '../services/usersService';

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