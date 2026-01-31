
interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class UserRegistrationValidator {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly minPasswordLength: number = 8;

  validateEmail(email: string): string[] {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!this.emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  }

  validatePassword(password: string, confirmPassword: string): string[] {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < this.minPasswordLength) {
        errors.push(`Password must be at least ${this.minPasswordLength} characters`);
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
    }
    
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return errors;
  }

  validateRegistration(data: UserRegistrationData): Map<string, string[]> {
    const validationErrors = new Map<string, string[]>();
    
    const emailErrors = this.validateEmail(data.email);
    if (emailErrors.length > 0) {
      validationErrors.set('email', emailErrors);
    }
    
    const passwordErrors = this.validatePassword(data.password, data.confirmPassword);
    if (passwordErrors.length > 0) {
      validationErrors.set('password', passwordErrors);
    }
    
    return validationErrors;
  }
}

export { UserRegistrationValidator, UserRegistrationData };interface UserRegistration {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validatePassword(password: string): string[] {
    const errors: string[] = [];
    
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return errors;
  }

  static validateRegistration(data: UserRegistration): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }
    
    const passwordErrors = this.validatePassword(data.password);
    errors.push(...passwordErrors);
    
    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

export { UserRegistration, RegistrationValidator };