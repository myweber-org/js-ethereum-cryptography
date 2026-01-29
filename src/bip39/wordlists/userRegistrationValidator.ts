import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  dateOfBirth: z.date().refine(date => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 13;
  }, 'User must be at least 13 years old')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(data: unknown): UserRegistrationData {
  return userRegistrationSchema.parse(data);
}

export function getValidationErrors(data: unknown): string[] {
  try {
    userRegistrationSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly minPasswordLength: number = 8;

  validate(data: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isStrongPassword(data.password)) {
      errors.push(`Password must be at least ${this.minPasswordLength} characters long and contain uppercase, lowercase, and numbers`);
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  private isValidEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    if (password.length < this.minPasswordLength) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  }
}

export { RegistrationValidator, UserRegistrationData };import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const userRegistrationSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z.string()
        .email('Invalid email address')
        .endsWith('.com', 'Email must be a .com domain'),
    
    password: passwordSchema,
    
    confirmPassword: z.string(),
    
    age: z.number()
        .int('Age must be an integer')
        .min(18, 'You must be at least 18 years old')
        .max(120, 'Age must be reasonable'),
    
    acceptTerms: z.boolean()
        .refine(val => val === true, 'You must accept the terms and conditions'),
    
    subscriptionTier: z.enum(['free', 'basic', 'premium'])
        .default('free')
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationInput {
    return userRegistrationSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
    try {
        userRegistrationSchema.parse(input);
        return [];
    } catch (error) {
        if (error instanceof z.ZodError) {
            return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        }
        return ['Unknown validation error'];
    }
}