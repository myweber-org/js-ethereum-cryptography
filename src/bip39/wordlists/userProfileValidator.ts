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
    theme: z.enum(['light', 'dark', 'auto'], {
      errorMap: () => ({ message: 'Theme must be light, dark, or auto' })
    }),
    notifications: z.boolean()
  }).optional(),
  
  tags: z
    .array(z.string().min(1))
    .max(5, 'You can have at most 5 tags')
    .optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return userProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

export function createDefaultProfile(): Partial<UserProfile> {
  return {
    preferences: {
      theme: 'auto',
      notifications: true
    },
    tags: []
  };
}import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
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
      throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  const profileData = {
    username,
    email,
    id: crypto.randomUUID()
  };
  
  return UserProfileSchema.parse(profileData);
}

export { UserProfileSchema, type UserProfile, validateUserProfile, createDefaultProfile };import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile | null {
  const result = UserProfileSchema.safeParse(input);
  return result.success ? result.data : null;
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({
    username,
    email
  });
}

export { UserProfileSchema, type UserProfile, validateUserProfile, createDefaultProfile };import { z } from 'zod';

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
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().length(2, 'Language code must be 2 characters')
  }).optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(input);
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
    subscriptionTier: 'free',
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    }
  };
}import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  tags: z.array(z.string()).max(10)
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  return UserProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
  return UserProfileSchema.safeParse(input);
}