import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Please provide a valid email address'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please provide a valid age'),
  
  subscriptionTier: z.enum(['free', 'pro', 'enterprise'], {
    errorMap: () => ({ message: 'Subscription tier must be free, pro, or enterprise' })
  }),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().length(2, 'Language code must be 2 characters')
  }).optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): { success: boolean; data?: UserProfile; errors?: string[] } {
  const result = UserProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

export function createDefaultProfile(): UserProfile {
  return {
    username: 'new_user',
    email: 'user@example.com',
    age: 25,
    subscriptionTier: 'free',
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    }
  };
}