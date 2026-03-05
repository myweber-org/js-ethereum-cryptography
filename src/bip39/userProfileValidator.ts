
interface UserProfile {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileValidator {
  private readonly MIN_AGE = 13;
  private readonly MAX_AGE = 120;
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(profile: UserProfile): ValidationResult {
    const errors: string[] = [];

    if (!profile.name.trim()) {
      errors.push('Name cannot be empty');
    }

    if (!this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const validator = new UserProfileValidator();
const testProfile: UserProfile = {
  name: 'John Doe',
  email: 'JOHN@EXAMPLE.COM',
  age: 25,
  isActive: true
};

const sanitizedEmail = validator.sanitizeEmail(testProfile.email);
const validationResult = validator.validate({ ...testProfile, email: sanitizedEmail });

console.log('Validation result:', validationResult);