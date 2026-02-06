
interface UserProfile {
  name: string;
  email: string;
  age: number;
}

class UserProfileValidator {
  private static readonly MIN_AGE = 18;
  private static readonly MAX_AGE = 120;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validate(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.isValidEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isValidAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private static isValidAge(age: number): boolean {
    return Number.isInteger(age) && age >= this.MIN_AGE && age <= this.MAX_AGE;
  }
}

export { UserProfile, UserProfileValidator };import { z } from 'zod';

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true),
  }).default({ theme: 'system', notifications: true }),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  return userProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
  return userProfileSchema.safeParse(input);
}