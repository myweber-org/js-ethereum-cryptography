import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Please provide a valid email address')
    .endsWith('.com', 'Email must end with .com domain'),
  
  age: z.number()
    .int('Age must be an integer')
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Age must be a realistic value'),
  
  subscriptionTier: z.enum(['free', 'pro', 'enterprise'], {
    errorMap: () => ({ message: 'Invalid subscription tier selected' })
  }),
  
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Maximum 5 tags allowed'),
  
  settings: z.object({
    newsletter: z.boolean(),
    twoFactorAuth: z.boolean().default(false)
  }).optional()
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return userProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new ValidationError('Profile validation failed', formattedErrors);
    }
    throw error;
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly details: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function createDefaultProfile(): Partial<UserProfile> {
  return {
    subscriptionTier: 'free',
    settings: {
      newsletter: true,
      twoFactorAuth: false
    }
  };
}
interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number;
  bio?: string;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly MAX_BIO_LENGTH = 500;

  static validateUpdate(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.email !== undefined) {
      if (!this.EMAIL_REGEX.test(profile.email)) {
        errors.push('Invalid email format');
      }
    }

    if (profile.username !== undefined) {
      if (!this.USERNAME_REGEX.test(profile.username)) {
        errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      }
    }

    if (profile.age !== undefined) {
      if (!Number.isInteger(profile.age) || profile.age < 0 || profile.age > 150) {
        errors.push('Age must be an integer between 0 and 150');
      }
    }

    if (profile.bio !== undefined) {
      if (profile.bio.length > this.MAX_BIO_LENGTH) {
        errors.push(`Bio must not exceed ${this.MAX_BIO_LENGTH} characters`);
      }
    }

    return errors;
  }

  static validateForCreation(profile: UserProfile): string[] {
    const requiredErrors = this.validateRequiredFields(profile);
    const updateErrors = this.validateUpdate(profile);
    return [...requiredErrors, ...updateErrors];
  }

  private static validateRequiredFields(profile: UserProfile): string[] {
    const errors: string[] = [];

    if (!profile.id || profile.id.trim().length === 0) {
      errors.push('User ID is required');
    }

    if (!profile.email) {
      errors.push('Email is required');
    }

    if (!profile.username) {
      errors.push('Username is required');
    }

    return errors;
  }
}

export { UserProfileValidator, UserProfile };