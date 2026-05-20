import * as z from 'zod';

export const EmailVerificationSchema = z.object({
  email: z.email()
});

export type EmailVerificationType = z.infer<typeof EmailVerificationSchema>;