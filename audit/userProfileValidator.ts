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
      errors.push('Username must be 3-30 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export { UserProfile, ProfileValidator };