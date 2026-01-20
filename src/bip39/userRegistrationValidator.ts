interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validate(data: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isStrongPassword(data.password)) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long and contain uppercase, lowercase, and numbers`);
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private static isStrongPassword(password: string): boolean {
    if (password.length < this.MIN_PASSWORD_LENGTH) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  }
}

export { UserRegistrationData, RegistrationValidator };import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: z.string()
    .email('Invalid email address')
    .endsWith('.com', 'Email must be a .com domain'),
  
  password: passwordSchema,
  
  confirmPassword: z.string(),
  
  birthDate: z.date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old')
    .optional(),
  
  acceptTerms: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type RegistrationData = z.infer<typeof registrationSchema>;

export function validateRegistration(data: unknown): RegistrationData {
  return registrationSchema.parse(data);
}

export function getValidationErrors(data: unknown): string[] {
  try {
    registrationSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const userRegistrationSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    
    email: z.string()
        .email('Invalid email address')
        .endsWith('.com', 'Email must end with .com domain'),
    
    password: passwordSchema,
    
    confirmPassword: z.string(),
    
    age: z.number()
        .int('Age must be an integer')
        .min(18, 'You must be at least 18 years old')
        .max(120, 'Age must be realistic'),
    
    acceptTerms: z.boolean()
        .refine(val => val === true, 'You must accept the terms and conditions'),
    
    subscriptionTier: z.enum(['free', 'premium', 'enterprise'])
        .default('free')
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationData {
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
}import { z } from 'zod';

export const RegistrationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  email: z.string()
    .email('Invalid email address')
    .endsWith('.com', 'Email must be from a .com domain'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),

  confirmPassword: z.string(),
  birthDate: z.date()
    .min(new Date('1900-01-01'), 'Birth date cannot be before 1900')
    .max(new Date(), 'Birth date cannot be in the future')
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})
.refine((data) => {
  const age = new Date().getFullYear() - data.birthDate.getFullYear();
  return age >= 13;
}, {
  message: 'User must be at least 13 years old',
  path: ['birthDate']
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;

export function validateRegistration(input: unknown): RegistrationData {
  return RegistrationSchema.parse(input);
}

export function getValidationErrors(input: unknown): string[] {
  try {
    RegistrationSchema.parse(input);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    }
    return ['Unknown validation error'];
  }
}