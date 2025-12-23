import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  isActive: boolean;
}

class UserRegistrationService {
  private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly minPasswordLength: number = 8;

  validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= this.minPasswordLength &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password);
  }

  async registerUser(email: string, username: string, password: string): Promise<User> {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!this.validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase and number');
    }

    const existingUser = await this.checkUserExists(email, username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const passwordHash = await this.hashPassword(password);
    
    const newUser: User = {
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      passwordHash,
      createdAt: new Date(),
      isActive: true
    };

    await this.saveUserToDatabase(newUser);
    return newUser;
  }

  private async checkUserExists(email: string, username: string): Promise<boolean> {
    // Database query simulation
    return false;
  }

  private async hashPassword(password: string): Promise<string> {
    // Password hashing simulation
    return `hashed_${password}_${Date.now()}`;
  }

  private async saveUserToDatabase(user: User): Promise<void> {
    // Database save operation simulation
    console.log(`User ${user.id} saved to database`);
  }
}

export { UserRegistrationService, User };