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