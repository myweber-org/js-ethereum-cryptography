
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
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().default('en')
  }).optional(),
  
  tags: z
    .array(z.string())
    .max(5, 'Cannot have more than 5 tags')
    .optional()
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

export function createDefaultProfile(): Partial<UserProfile> {
  return {
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    },
    tags: []
  };
}interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 18;
  private static readonly MAX_AGE = 120;

  static validate(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    if (typeof profile.isActive !== 'boolean') {
      errors.push('Active status must be a boolean value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createDefaultProfile(): UserProfile {
    return {
      name: '',
      email: '',
      age: 0,
      isActive: false
    };
  }
}

export { UserProfile, UserProfileValidator };interface UserProfile {
  id: string;
  email: string;
  age: number;
  preferences: string[];
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;
  private static readonly MAX_PREFERENCES = 10;

  static validate(profile: Partial<UserProfile>): void {
    if (profile.id !== undefined && !this.isValidId(profile.id)) {
      throw new ValidationError('Invalid user ID format');
    }

    if (profile.email !== undefined && !this.isValidEmail(profile.email)) {
      throw new ValidationError('Email address is malformed');
    }

    if (profile.age !== undefined && !this.isValidAge(profile.age)) {
      throw new ValidationError(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    if (profile.preferences !== undefined && !this.isValidPreferences(profile.preferences)) {
      throw new ValidationError(`Preferences cannot exceed ${this.MAX_PREFERENCES} items`);
    }
  }

  private static isValidId(id: string): boolean {
    return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private static isValidAge(age: number): boolean {
    return Number.isInteger(age) && age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  private static isValidPreferences(preferences: string[]): boolean {
    return Array.isArray(preferences) && 
           preferences.length <= this.MAX_PREFERENCES &&
           preferences.every(pref => typeof pref === 'string' && pref.trim().length > 0);
  }
}

export { UserProfileValidator, ValidationError, UserProfile };