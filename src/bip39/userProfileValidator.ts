interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UserProfileValidator {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validate(profile: UserProfile): void {
    if (!profile.id || profile.id <= 0) {
      throw new ValidationError('ID must be a positive integer');
    }

    if (!profile.username || !this.USERNAME_REGEX.test(profile.username)) {
      throw new ValidationError('Username must be 3-20 alphanumeric characters or underscores');
    }

    if (!profile.email || !this.EMAIL_REGEX.test(profile.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      throw new ValidationError('Age must be between 0 and 150');
    }

    if (typeof profile.isActive !== 'boolean') {
      throw new ValidationError('isActive must be a boolean value');
    }
  }

  static validatePartial(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.id !== undefined && profile.id <= 0) {
      errors.push('ID must be a positive integer');
    }

    if (profile.username !== undefined && !this.USERNAME_REGEX.test(profile.username)) {
      errors.push('Username must be 3-20 alphanumeric characters or underscores');
    }

    if (profile.email !== undefined && !this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }

    if (profile.isActive !== undefined && typeof profile.isActive !== 'boolean') {
      errors.push('isActive must be a boolean value');
    }

    return errors;
  }
}

function testValidation() {
  const validProfile: UserProfile = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    age: 25,
    isActive: true
  };

  const invalidProfile: UserProfile = {
    id: -1,
    username: 'ab',
    email: 'invalid-email',
    age: 200,
    isActive: 'yes' as any
  };

  try {
    UserProfileValidator.validate(validProfile);
    console.log('Valid profile passed validation');
  } catch (error) {
    console.error('Unexpected error:', error);
  }

  try {
    UserProfileValidator.validate(invalidProfile);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.message);
    }
  }

  const partialProfile = { username: 'test', email: 'test@example.com' };
  const partialErrors = UserProfileValidator.validatePartial(partialProfile);
  
  if (partialErrors.length === 0) {
    console.log('Partial validation passed');
  } else {
    console.log('Partial validation errors:', partialErrors);
  }
}

export { UserProfile, ValidationError, UserProfileValidator, testValidation };import { z } from 'zod';

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

function validateUserProfile(input: unknown): UserProfile {
  try {
    return userProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => `${e.path}: ${e.message}`).join(', ')}`);
    }
    throw error;
  }
}

export { userProfileSchema, validateUserProfile, type UserProfile };import { z } from 'zod';

const UserProfileSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
    throw new Error('Invalid user profile data');
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({ username, email });
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };