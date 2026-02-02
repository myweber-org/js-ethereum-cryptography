import { z } from 'zod';

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
  address: addressSchema,
  tags: z.array(z.string()).max(5),
  metadata: z.record(z.string(), z.any()).optional(),
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true)
  }).default({ theme: 'auto', notifications: true })
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile | null {
  const result = UserProfileSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    username,
    email,
    preferences: {
      theme: 'auto',
      notifications: true
    }
  };
}import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Please provide a valid email address'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please provide a valid age'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().optional()
  }).strict(),
  
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Cannot have more than 5 tags')
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

export function createDefaultProfile(): UserProfile {
  return {
    username: '',
    email: '',
    age: 18,
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: undefined
    },
    tags: []
  };
}interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  preferences: string[];
}

class UserProfileValidator {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MAX_PREFERENCES = 10;

  static validate(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.username !== undefined) {
      if (!this.USERNAME_REGEX.test(profile.username)) {
        errors.push('Username must be 3-20 alphanumeric characters or underscores');
      }
    }

    if (profile.email !== undefined) {
      if (!this.EMAIL_REGEX.test(profile.email)) {
        errors.push('Invalid email format');
      }
    }

    if (profile.age !== undefined) {
      if (profile.age < 0 || profile.age > 150) {
        errors.push('Age must be between 0 and 150');
      }
    }

    if (profile.preferences !== undefined) {
      if (!Array.isArray(profile.preferences)) {
        errors.push('Preferences must be an array');
      } else if (profile.preferences.length > this.MAX_PREFERENCES) {
        errors.push(`Cannot have more than ${this.MAX_PREFERENCES} preferences`);
      }
    }

    return errors;
  }

  static validateForUpdate(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
    const errors = this.validate(profile);
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserProfile, UserProfileValidator };