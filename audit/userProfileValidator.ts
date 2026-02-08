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