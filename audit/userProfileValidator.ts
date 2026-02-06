import { z } from 'zod';

const userProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Please provide a valid email address')
    .endsWith('.com', 'Email must be from a .com domain'),
  
  age: z
    .number()
    .int('Age must be a whole number')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a realistic value'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().default('en')
  }).optional(),
  
  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Cannot have more than 5 tags'),
  
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return userProfileSchema.parse(data);
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

export function createDefaultProfile(username: string, email: string): Partial<UserProfile> {
  return {
    username,
    email,
    preferences: {
      newsletter: true,
      theme: 'auto',
      language: 'en'
    },
    tags: ['new-user']
  };
}