interface UserProfile {
  email: string;
  age: number;
  username: string;
}

class ProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  static validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 30;
  }

  static validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    if (!this.validateUsername(profile.username)) {
      errors.push('Username must be 3-30 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserProfile, ProfileValidator };import { z } from 'zod';

const userProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z
    .string()
    .email('Please provide a valid email address')
    .endsWith('.com', 'Email must end with .com domain'),
  
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please provide a valid age'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().default('en')
  }).strict(),
  
  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .max(5, 'Cannot have more than 5 tags'),
  
  createdAt: z
    .date()
    .max(new Date(), 'Creation date cannot be in the future')
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
    tags: ['new-user'],
    createdAt: new Date()
  };
}