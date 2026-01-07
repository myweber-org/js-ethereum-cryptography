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
}