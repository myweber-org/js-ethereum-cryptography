
interface UserProfile {
  name: string;
  email: string;
  age: number;
  bio?: string;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;

  static validate(profile: UserProfile): string[] {
    const errors: string[] = [];

    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!profile.email || !this.EMAIL_REGEX.test(profile.email)) {
      errors.push('Email must be a valid email address');
    }

    if (profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    if (profile.bio && profile.bio.length > 500) {
      errors.push('Bio must not exceed 500 characters');
    }

    return errors;
  }

  static validateAndThrow(profile: UserProfile): void {
    const errors = this.validate(profile);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

export { UserProfile, UserProfileValidator };