
interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class UserRegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateRegistration(data: UserRegistrationData): string[] {
    const errors: string[] = [];

    if (!data.username.trim()) {
      errors.push('Username is required');
    }

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!this.isStrongPassword(data.password)) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long and contain uppercase, lowercase, and numbers`);
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  private static isStrongPassword(password: string): boolean {
    if (password.length < this.MIN_PASSWORD_LENGTH) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  }
}

function registerUser(registrationData: UserRegistrationData): void {
  const validationErrors = UserRegistrationValidator.validateRegistration(registrationData);
  
  if (validationErrors.length > 0) {
    console.error('Registration failed:');
    validationErrors.forEach(error => console.error(`- ${error}`));
    return;
  }

  console.log('User registration successful!');
  console.log(`Username: ${registrationData.username}`);
  console.log(`Email: ${registrationData.email}`);
}

const testUser: UserRegistrationData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123'
};

registerUser(testUser);