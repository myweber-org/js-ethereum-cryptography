import { z } from 'zod';

const userProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Invalid email address format'),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a reasonable value'),
  
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean(),
    language: z.string().default('en')
  }).optional(),
  
  createdAt: z
    .date()
    .default(() => new Date())
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  try {
    return userProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export function createDefaultProfile(): UserProfile {
  return {
    username: '',
    email: '',
    age: 18,
    preferences: {
      theme: 'auto',
      notifications: true,
      language: 'en'
    },
    createdAt: new Date()
  };
}