interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateEmail(email: string): string | null {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!this.EMAIL_REGEX.test(email)) {
      return "Invalid email format";
    }
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) {
      return "Password is required";
    }
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`;
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  }

  static validateRegistration(data: UserRegistrationData): string[] {
    const errors: string[] = [];

    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push(emailError);

    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.push(passwordError);

    if (data.password !== data.confirmPassword) {
      errors.push("Passwords do not match");
    }

    return errors;
  }
}

export { UserRegistrationData, RegistrationValidator };interface UserRegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
}

class RegistrationValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_PASSWORD_LENGTH = 8;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validatePasswordStrength(password: string): string[] {
    const errors: string[] = [];

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`);
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  }

  static validateRegistration(data: UserRegistrationData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format');
    }

    const passwordErrors = this.validatePasswordStrength(data.password);
    errors.push(...passwordErrors);

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserRegistrationData, RegistrationValidator };