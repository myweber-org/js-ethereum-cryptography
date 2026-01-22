
interface User {
  email: string;
  password: string;
  username: string;
}

class UserValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validatePassword(password: string): string[] {
    const errors: string[] = [];
    
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`);
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
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  }

  static validateUser(user: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!user.email || !this.validateEmail(user.email)) {
      errors.push('Invalid email format');
    }

    if (user.password) {
      errors.push(...this.validatePassword(user.password));
    }

    if (!user.username || user.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

class UserRegistration {
  static register(userData: Partial<User>): { success: boolean; message: string } {
    const validation = UserValidator.validateUser(userData);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: `Registration failed: ${validation.errors.join(', ')}`
      };
    }

    return {
      success: true,
      message: 'User registered successfully'
    };
  }
}

const testUser: Partial<User> = {
  email: 'test@example.com',
  password: 'Password123!',
  username: 'testuser'
};

const result = UserRegistration.register(testUser);
console.log(result);