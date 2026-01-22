interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class UserRegistrationValidator {
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

  validateRegistration(data: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validatePassword(data.password)) {
      errors.push(`Password must be at least ${this.minPasswordLength} characters long and contain uppercase, lowercase letters and numbers`);
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

const validator = new UserRegistrationValidator();

const testData: UserRegistrationData = {
  email: 'test@example.com',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123'
};

const validationResult = validator.validateRegistration(testData);
console.log('Registration valid:', validationResult.isValid);
if (!validationResult.isValid) {
  console.log('Errors:', validationResult.errors);
}
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const users: Map<string, User> = new Map();

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
};

const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; userId?: string; error?: string }> => {
  if (!username || username.trim().length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long' };
  }

  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be at least 8 characters with one uppercase letter and one number' };
  }

  const existingUser = Array.from(users.values()).find(
    (user) => user.email === email || user.username === username
  );

  if (existingUser) {
    return { success: false, error: 'User with this email or username already exists' };
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userId = uuidv4();

    const newUser: User = {
      id: userId,
      username: username.trim(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    };

    users.set(userId, newUser);

    return { success: true, userId };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed due to server error' };
  }
};

const verifyUserCredentials = async (email: string, password: string): Promise<User | null> => {
  const user = Array.from(users.values()).find((u) => u.email === email.toLowerCase());

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  return isPasswordValid ? user : null;
};

export { registerUser, verifyUserCredentials, User };