import * as z from 'zod';

export const UserFrontEndSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required"}),
  lastName: z.string().min(1, { message: "Last Name is required"}),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
  phoneNumber: z.string().optional(),
  streetAddress1: z.string().min(1, { message: "Street Address 1 is required"}),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, { message: "City is required"}),
  county: z.string().min(1, { message: "County is required"}),
  state: z.string().min(1, { message: "State is required"}),
  zipCode: z.string().min(1, { message: "Zip Code is required"}),
  subscriber: z.boolean(),
  subscriptionLevel: z.string().min(1, { message: "Subscription Level is required"}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Points the error to the confirm field
});

export type UserFrontEndType = z.infer<typeof UserFrontEndSchema>;

export const UserBackendSchema = z.preprocess(
  (val: any) => {
    // Iterate over the object and convert undefined properties to null to prevent MySQL error.
    return Object.fromEntries(
      Object.entries(val).map(([key, value]) => [
        key,
        value === undefined ? null : value  
      ])
    );
  }, z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    passwordHash: z.string(),
    phoneNumber: z.string().nullable(),
    streetAddress1: z.string(),
    streetAddress2: z.string().nullable(),
    city: z.string(),
    county: z.string(),
    state: z.string(),
    zipCode: z.string(),
    subscriber: z.boolean(),
    subscriptionLevel: z.number(),
  })
);

export type UserBackendType = z.infer<typeof UserBackendSchema>;

