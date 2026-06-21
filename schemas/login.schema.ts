import * as z from 'zod';

export const LoginFrontEndSchema = z.object({
  email: z.email().min(1, { message: "Email is required"}),
  password: z.string().min(1, { message: "Password is required"}),
});

export type LoginFrontEndType = z.infer<typeof LoginFrontEndSchema>;
