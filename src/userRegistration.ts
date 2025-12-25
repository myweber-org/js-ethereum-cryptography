import { User, UserRole } from './user.model';
import { DatabaseService } from './database.service';
import { ValidationError, DuplicateUserError } from './errors';

export class UserRegistrationService {
    private dbService: DatabaseService;

    constructor(dbService: DatabaseService) {
        this.dbService = dbService;
    }

    async registerUser(
        username: string,
        email: string,
        password: string,
        role: UserRole = UserRole.USER
    ): Promise<User> {
        this.validateInput(username, email, password);
        
        const existingUser = await this.dbService.findUserByEmail(email);
        if (existingUser) {
            throw new DuplicateUserError(`User with email ${email} already exists`);
        }

        const hashedPassword = await this.hashPassword(password);
        const newUser: User = {
            id: this.generateUserId(),
            username,
            email,
            passwordHash: hashedPassword,
            role,
            createdAt: new Date(),
            isActive: true
        };

        await this.dbService.saveUser(newUser);
        return newUser;
    }

    private validateInput(username: string, email: string, password: string): void {
        if (!username || username.length < 3) {
            throw new ValidationError('Username must be at least 3 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError('Invalid email format');
        }

        if (!password || password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long');
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

    private generateUserId(): string {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}