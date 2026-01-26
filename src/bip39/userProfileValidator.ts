
interface UserProfile {
  email: string;
  age: number;
  username: string;
}

class ProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  static validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 30;
  }

  static validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    if (!this.validateUsername(profile.username)) {
      errors.push('Username must be between 3 and 30 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserProfile, ProfileValidator };
interface UserProfile {
  email: string;
  username: string;
  age: number;
}

class UserProfileValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly MIN_AGE = 13;
  private static readonly MAX_AGE = 120;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validateUsername(username: string): boolean {
    return this.USERNAME_REGEX.test(username);
  }

  static validateAge(age: number): boolean {
    return age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  static validateProfile(profile: UserProfile): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (!this.validateUsername(profile.username)) {
      errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }

    if (!this.validateAge(profile.age)) {
      errors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static createValidatedProfile(email: string, username: string, age: number): UserProfile | null {
    const profile: UserProfile = { email, username, age };
    const validation = this.validateProfile(profile);
    
    if (validation.isValid) {
      return profile;
    }
    
    console.warn('Profile validation failed:', validation.errors);
    return null;
  }
}

export { UserProfile, UserProfileValidator };