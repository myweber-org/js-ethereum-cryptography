import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address')
    .endsWith('.com', 'Email must be a .com domain'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a reasonable value'),
  
  subscriptionTier: z.enum(['free', 'pro', 'enterprise']),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().length(2)
  }).optional(),
  
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
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

function createDefaultProfile(): UserProfile {
  return userProfileSchema.parse({
    username: 'new_user',
    email: 'user@example.com',
    age: 25,
    subscriptionTier: 'free',
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    }
  });
}

export { userProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
    throw new Error('Invalid user profile data');
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: { theme: 'auto', notifications: true },
    createdAt: new Date(),
  };
}

export { UserProfileSchema, type UserProfile, validateUserProfile, createDefaultProfile };