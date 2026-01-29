import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true),
  }).default({}),
  tags: z.array(z.string()).max(10),
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

function safeValidateUserProfile(data: unknown) {
  const result = userProfileSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.format()
  };
}

export { userProfileSchema, validateUserProfile, safeValidateUserProfile };
export type { UserProfile };interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly MIN_AGE = 18;
  private readonly MAX_AGE = 120;

  validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name cannot be empty');
    }

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  createValidProfile(name: string, email: string, age: number): UserProfile | null {
    const profile: UserProfile = {
      name: name,
      email: email,
      age: age,
      isActive: true
    };

    const validationResult = this.validateProfile(profile);
    
    if (validationResult.isValid) {
      return profile;
    }
    
    console.warn('Profile creation failed:', validationResult.errors);
    return null;
  }
}

export { UserProfile, UserProfileValidator };import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true)
  }).default({}),
  lastLogin: z.date().optional()
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
    }
    throw error;
  }
}

export function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    username,
    email,
    preferences: {}
  };
}import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(input: unknown): UserProfile {
  return userProfileSchema.parse(input);
}

export function safeValidateUserProfile(input: unknown) {
  return userProfileSchema.safeParse(input);
}