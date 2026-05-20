import * as z from 'zod';

export const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  phoneNumber: z.string().optional(),
  streetAddress1: z.string(),
  streetAddress2: z.string().optional(),
  city: z.string(),
  county: z.string(),
  state: z.string(),
  zipCode: z.string(),
  subscriber: z.boolean(),
  subscriptionLevel: z.number(),
  verified: z.boolean(),
  adminAuthorized: z.boolean()
});

export type UserType = z.infer<typeof UserSchema>;

