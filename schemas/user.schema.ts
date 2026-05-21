import * as z from 'zod';

export const UserSchema = z.preprocess(
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

export type UserType = z.infer<typeof UserSchema>;

