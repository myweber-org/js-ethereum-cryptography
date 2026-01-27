import { z } from 'zod';

const UserProfileSchema = z.object({
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
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().default('en')
  }).optional(),
  
  createdAt: z
    .date()
    .max(new Date(), 'Creation date cannot be in the future')
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(data);
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

export function createDefaultProfile(): Partial<UserProfile> {
  return {
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    },
    createdAt: new Date()
  };
}import { z } from 'zod';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean()
  })
});

export function validateUserProfile(data: unknown): UserProfile | null {
  try {
    const result = userProfileSchema.parse(data);
    return result as UserProfile;
  } catch {
    return null;
  }
}

export function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: {
      theme: 'light',
      notifications: true
    }
  };
}import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().regex(/^\d{5}$/, 'Invalid postal code format'),
});

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  address: addressSchema.optional(),
  tags: z.array(z.string()).max(5),
  metadata: z.record(z.string(), z.any()).optional(),
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

function safeValidateUserProfile(data: unknown) {
  const result = userProfileSchema.safeParse(data);
  if (!result.success) {
    console.error('Validation failed:', result.error.format());
  }
  return result;
}

export { userProfileSchema, validateUserProfile, safeValidateUserProfile };
export type { UserProfile };