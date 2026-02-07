import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

interface User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

class UserRegistrationService {
    private users: Map<string, User> = new Map();

    async register(email: string, password: string): Promise<User> {
        this.validateEmail(email);
        await this.checkEmailExists(email);

        const passwordHash = await this.hashPassword(password);
        const user: User = {
            id: uuidv4(),
            email: email.toLowerCase().trim(),
            passwordHash,
            createdAt: new Date()
        };

        this.users.set(user.id, user);
        return user;
    }

    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    private async checkEmailExists(email: string): Promise<void> {
        const normalizedEmail = email.toLowerCase().trim();
        for (const user of this.users.values()) {
            if (user.email === normalizedEmail) {
                throw new Error('Email already registered');
            }
        }
    }

    private async hashPassword(password: string): Promise<string> {
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async verifyPassword(userId: string, password: string): Promise<boolean> {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return await bcrypt.compare(password, user.passwordHash);
    }
}

export default UserRegistrationService;