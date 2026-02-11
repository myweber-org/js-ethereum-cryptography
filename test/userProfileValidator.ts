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
    .min(18, 'User must be at least 18 years old')
    .max(120, 'Please provide a valid age'),
  
  preferences: z.object({
    newsletter: z.boolean(),
    theme: z.enum(['light', 'dark', 'auto']),
    language: z.string().optional()
  }).strict(),
  
  tags: z
    .array(z.string())
    .max(10, 'Cannot have more than 10 tags')
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
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const validateUsername = (username: string): string | null => {
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
};

const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

const validateAge = (age: number | undefined): string | null => {
  if (age !== undefined && (age < 0 || age > 150)) {
    return 'Age must be between 0 and 150';
  }
  return null;
};

export const validateUserProfile = (profile: UserProfile): ValidationResult => {
  const errors: string[] = [];

  const usernameError = validateUsername(profile.username);
  if (usernameError) errors.push(usernameError);

  const emailError = validateEmail(profile.email);
  if (emailError) errors.push(emailError);

  const ageError = validateAge(profile.age);
  if (ageError) errors.push(ageError);

  if (typeof profile.isActive !== 'boolean') {
    errors.push('isActive must be a boolean value');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const createDefaultProfile = (): UserProfile => {
  return {
    id: Date.now(),
    username: '',
    email: '',
    isActive: false
  };
};