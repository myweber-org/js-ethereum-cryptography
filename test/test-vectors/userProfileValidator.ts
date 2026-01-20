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
}import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const userProfileUpdateSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format').optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  preferences: z.object({
    newsletter: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    language: z.string().length(2).optional()
  }).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

export function validateUserProfileUpdate(input: unknown): UserProfileUpdateInput {
  return userProfileUpdateSchema.parse(input);
}import { z } from 'zod';

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true)
  }).default({ theme: 'auto', notifications: true }),
  lastActive: z.date().optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  return userProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
  return userProfileSchema.safeParse(input);
}