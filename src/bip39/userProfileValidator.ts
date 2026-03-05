
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private readonly MIN_AGE = 13;
  private readonly MAX_AGE = 120;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(profile: UserProfile): ValidationResult {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name cannot be empty');
    }

    if (!this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const validator = new UserProfileValidator();
const testProfile: UserProfile = {
  name: 'John Doe',
  email: 'JOHN@EXAMPLE.COM',
  age: 25,
  isActive: true
};

const sanitizedEmail = validator.sanitizeEmail(testProfile.email);
const validationResult = validator.validate({ ...testProfile, email: sanitizedEmail });

console.log('Validation result:', validationResult);import { z } from 'zod';

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
    language: z.string().length(2, 'Language code must be 2 characters')
  }).optional(),
  
  createdAt: z.date().default(() => new Date())
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
  return userProfileSchema.parse({
    username: '',
    email: '',
    age: 18,
    preferences: {
      newsletter: false,
      theme: 'auto',
      language: 'en'
    }
  });
}