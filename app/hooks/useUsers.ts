import { useMutation } from '@tanstack/react-query';
import { signup, verifyEmail } from '../services/usersService';

// Hook for signing up a new user (Create)
export const useSignup = () => {
  
  return useMutation({
    mutationFn: signup
  });
};

// Hook for verifying email (Update)
export const useVerifyEmail = () => {
  
  return useMutation({
    mutationFn: verifyEmail,
  });
};