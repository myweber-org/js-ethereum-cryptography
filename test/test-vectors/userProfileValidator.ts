import { z } from 'zod';

export const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be reasonable'),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true),
    language: z.string().default('en')
  }).optional(),
  
  createdAt: z.date().default(() => new Date())
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}