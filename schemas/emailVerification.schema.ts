import * as z from 'zod';

export const EmailVerificationFrontEndSchema = z.object({
  email: z.email(),
  otp: z.string().length(6, 'OTP must be exactly 6 characters long')
});

export type EmailVerificationFrontEndType = z.infer<typeof EmailVerificationFrontEndSchema>;

export const EmailVerificationBackEndSchema = z.object({
  email: z.email(),
  otpHash: z.string()
});

export type EmailVerificationBackEndType = z.infer<typeof EmailVerificationBackEndSchema>;