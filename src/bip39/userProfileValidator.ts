import { z } from 'zod';

const userProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Please provide a valid email address'),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please provide a valid age'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().default('en')
  }).optional(),
  
  tags: z
    .array(z.string())
    .max(5, 'You can have at most 5 tags')
    .optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): { success: boolean; data?: UserProfile; errors?: string[] } {
  const result = userProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}

export function createDefaultProfile(): UserProfile {
  return {
    username: '',
    email: '',
    age: 18,
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    },
    tags: []
  };
}import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export { UserProfileSchema, type UserProfile, validateUserProfile };