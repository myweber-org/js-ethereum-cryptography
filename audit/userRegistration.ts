import crypto from 'crypto';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

class UserRegistrationService {
  private users: Map<string, User> = new Map();

  register(email: string, password: string): User | null {
    if (!this.isValidEmail(email)) {
      console.error('Invalid email format');
      return null;
    }

    if (this.users.has(email)) {
      console.error('User already exists');
      return null;
    }

    if (!this.isStrongPassword(password)) {
      console.error('Password does not meet security requirements');
      return null;
    }

    const user: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      passwordHash: this.hashPassword(password),
      createdAt: new Date()
    };

    this.users.set(user.email, user);
    console.log(`User registered successfully: ${user.email}`);
    return user;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[^A-Za-z0-9]/.test(password);
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(email: string, password: string): boolean {
    const user = this.users.get(email.toLowerCase().trim());
    if (!user) return false;

    const [salt, storedHash] = user.passwordHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === storedHash;
  }

  getUserCount(): number {
    return this.users.size;
  }
}

export default UserRegistrationService;