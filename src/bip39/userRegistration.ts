interface UserRegistrationData {
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

  static validatePasswordStrength(password: string): string[] {
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

  static validateRegistration(data: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    const passwordErrors = this.validatePasswordStrength(data.password);
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

export { UserRegistrationData, RegistrationValidator };interface UserRegistration {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private readonly MIN_PASSWORD_LENGTH = 8;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validateRegistration(data: UserRegistration): { isValid: boolean; errors: string[] } {
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

  private isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private isStrongPassword(password: string): boolean {
    if (password.length < this.MIN_PASSWORD_LENGTH) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  }
}

export { UserRegistration, RegistrationValidator };
import { User, UserRepository } from './userRepository';
import { ValidationError, DatabaseError } from './errors';

export class UserRegistrationService {
  constructor(private userRepository: UserRepository) {}

  async registerUser(email: string, password: string, name: string): Promise<User> {
    this.validateInput(email, password, name);
    
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser: User = {
      email,
      passwordHash: hashedPassword,
      name,
      createdAt: new Date(),
      isActive: true
    };

    try {
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      throw new DatabaseError('Failed to save user to database');
    }
  }

  private validateInput(email: string, password: string, name: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    if (name.trim().length === 0) {
      throw new ValidationError('Name cannot be empty');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // In a real application, use a proper hashing library like bcrypt
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}import { z } from 'zod';

const UserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  age: z.number().int().min(18).optional()
});

type User = z.infer<typeof UserSchema>;

class UserRegistrationService {
  private registeredUsers: Map<string, User> = new Map();

  async register(userData: unknown): Promise<{ success: boolean; userId?: string; errors?: string[] }> {
    try {
      const validatedData = UserSchema.parse(userData);
      
      if (this.registeredUsers.has(validatedData.email)) {
        return { 
          success: false, 
          errors: ['Email already registered'] 
        };
      }

      const userId = this.generateUserId();
      this.registeredUsers.set(validatedData.email, validatedData);
      
      await this.sendWelcomeEmail(validatedData.email);
      
      return { 
        success: true, 
        userId 
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { 
          success: false, 
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }
      return { 
        success: false, 
        errors: ['Registration failed due to server error'] 
      };
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendWelcomeEmail(email: string): Promise<void> {
    console.log(`Sending welcome email to ${email}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  getRegisteredCount(): number {
    return this.registeredUsers.size;
  }
}

export { UserRegistrationService, UserSchema };
export type { User };