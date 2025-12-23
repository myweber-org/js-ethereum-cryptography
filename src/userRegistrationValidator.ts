
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