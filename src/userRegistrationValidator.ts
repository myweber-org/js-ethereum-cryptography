
interface UserRegistration {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly minPasswordLength: number = 8;

  validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  validatePasswordStrength(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= this.minPasswordLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }

  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  validateRegistration(data: UserRegistration): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validatePasswordStrength(data.password)) {
      errors.push(`Password must be at least ${this.minPasswordLength} characters long and contain uppercase, lowercase, numbers, and special characters`);
    }

    if (!this.validatePasswordMatch(data.password, data.confirmPassword)) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export { RegistrationValidator, UserRegistration };interface UserRegistration {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly minPasswordLength: number = 8;

  validateEmail(email: string): { isValid: boolean; message?: string } {
    if (!email.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    
    if (!this.emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }
    
    return { isValid: true };
  }

  validatePassword(password: string): { isValid: boolean; message?: string } {
    if (!password.trim()) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < this.minPasswordLength) {
      return { 
        isValid: false, 
        message: `Password must be at least ${this.minPasswordLength} characters long` 
      };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return {
        isValid: false,
        message: 'Password must contain uppercase, lowercase, numbers, and special characters'
      };
    }
    
    return { isValid: true };
  }

  validateRegistration(data: UserRegistration): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid && emailValidation.message) {
      errors.push(emailValidation.message);
    }
    
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid && passwordValidation.message) {
      errors.push(passwordValidation.message);
    }
    
    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { RegistrationValidator, UserRegistration };import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;

export function validateUserRegistration(input: unknown): UserRegistrationData {
  return UserRegistrationSchema.parse(input);
}
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

export { RegistrationValidator, UserRegistrationData };import { z } from 'zod';

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
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  age: z.number().int().min(18, 'Must be at least 18 years old').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type UserRegistrationData = z.infer<typeof userRegistrationSchema>;

export function validateUserRegistration(data: unknown): {
  success: boolean;
  data?: UserRegistrationData;
  errors?: Record<string, string[]>;
} {
  const result = userRegistrationSchema.safeParse(data);
  
  if (!result.success) {
    const formattedErrors: Record<string, string[]> = {};
    
    result.error.errors.forEach(error => {
      const path = error.path.join('.');
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(error.message);
    });
    
    return {
      success: false,
      errors: formattedErrors
    };
  }
  
  return {
    success: true,
    data: result.data
  };
}

export function sanitizeUserData(data: UserRegistrationData): Omit<UserRegistrationData, 'confirmPassword' | 'acceptTerms'> {
  const { confirmPassword, acceptTerms, ...sanitizedData } = data;
  return sanitizedData;
}