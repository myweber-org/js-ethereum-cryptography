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