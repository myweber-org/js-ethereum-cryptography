import { User, UserRepository } from './repositories/userRepository';
import { validateEmail, validatePassword } from './utils/validation';

export class UserRegistrationService {
  constructor(private userRepository: UserRepository) {}

  async registerUser(email: string, password: string): Promise<User> {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new Error('Password does not meet security requirements');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: Omit<User, 'id'> = {
      email,
      passwordHash: await this.hashPassword(password),
      createdAt: new Date(),
      isActive: true
    };

    return await this.userRepository.create(newUser);
  }

  private async hashPassword(password: string): Promise<string> {
    // Implementation for password hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validatePassword(password: string): string[] {
    const errors: string[] = [];

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`);
    }

    if (!this.PASSWORD_COMPLEXITY_REGEX.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    return errors;
  }

  static validateRegistration(data: UserRegistrationData): { isValid: boolean; errors: string[] } {
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
      errors
    };
  }
}

export { UserRegistrationData, RegistrationValidator };