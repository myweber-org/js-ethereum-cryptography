import { User, UserRepository } from './userRepository';
import { ValidationError } from './errors/validationError';

export interface RegistrationData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export class UserRegistrationService {
    constructor(private userRepository: UserRepository) {}

    async register(data: RegistrationData): Promise<User> {
        this.validateRegistrationData(data);

        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const hashedPassword = await this.hashPassword(data.password);
        const user: Omit<User, 'id'> = {
            username: data.username,
            email: data.email,
            passwordHash: hashedPassword,
            createdAt: new Date(),
            isActive: true
        };

        return await this.userRepository.create(user);
    }

    private validateRegistrationData(data: RegistrationData): void {
        const errors: string[] = [];

        if (!data.username || data.username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }

        if (data.password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (data.password !== data.confirmPassword) {
            errors.push('Passwords do not match');
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
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
import { DatabaseClient } from './database';
import { hashPassword, generateSalt } from './crypto';

const UserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

export class UserRegistrationService {
  private db: DatabaseClient;

  constructor(dbClient: DatabaseClient) {
    this.db = dbClient;
  }

  async registerUser(userData: unknown): Promise<{ success: boolean; userId?: string; errors?: string[] }> {
    const validationResult = UserSchema.safeParse(userData);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message);
      return { success: false, errors };
    }

    const { username, email, password } = validationResult.data;
    
    try {
      const existingUser = await this.db.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return { 
          success: false, 
          errors: ['User with this email or username already exists'] 
        };
      }

      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);
      
      const result = await this.db.query(
        `INSERT INTO users (username, email, password_hash, salt, created_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         RETURNING id`,
        [username, email, hashedPassword, salt]
      );

      await this.db.query(
        'INSERT INTO user_profiles (user_id) VALUES ($1)',
        [result.rows[0].id]
      );

      return { 
        success: true, 
        userId: result.rows[0].id 
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        errors: ['Internal server error during registration'] 
      };
    }
  }
}