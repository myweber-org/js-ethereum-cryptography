import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address format')
    .endsWith('.com', 'Email must be from a .com domain'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a reasonable value'),
  
  subscriptionTier: z.enum(['free', 'premium', 'enterprise'], {
    errorMap: () => ({ message: 'Invalid subscription tier selected' })
  }),
  
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Cannot have more than 5 tags'),
  
  metadata: z.record(z.string(), z.any()).optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): { success: boolean; data?: UserProfile; errors?: string[] } {
  const result = UserProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    );
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

export function createDefaultProfile(): Partial<UserProfile> {
  return {
    subscriptionTier: 'free',
    tags: ['new-user'],
    age: 18
  };
}