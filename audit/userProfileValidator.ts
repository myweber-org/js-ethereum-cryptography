import { z } from 'zod';

const emailSchema = z.string().email();
const ageSchema = z.number().int().min(18).max(120);

export interface UserProfile {
  email: string;
  age: number;
  username: string;
}

export class ProfileValidator {
  static validateEmail(email: string): boolean {
    try {
      emailSchema.parse(email);
      return true;
    } catch {
      return false;
    }
  }

  static validateAge(age: number): boolean {
    try {
      ageSchema.parse(age);
      return true;
    } catch {
      return false;
    }
  }

  static validateProfile(profile: UserProfile): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push('Age must be between 18 and 120');
    }

    if (profile.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
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
  
  createdAt: z
    .date()
    .default(() => new Date())
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

export function createDefaultProfile(username: string, email: string): UserProfile {
  return userProfileSchema.parse({
    username,
    email,
    age: 18,
    preferences: {
      newsletter: false,
      theme: 'auto'
    }
  });
}