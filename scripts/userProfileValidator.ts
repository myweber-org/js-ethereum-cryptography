interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateUserProfile(profile: UserProfile): void {
  const errors: string[] = [];

  if (!profile.username || profile.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!profile.email || !emailRegex.test(profile.email)) {
    errors.push('Invalid email format');
  }

  if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
    errors.push('Age must be between 0 and 150');
  }

  if (typeof profile.isActive !== 'boolean') {
    errors.push('isActive must be a boolean value');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Validation failed: ${errors.join('; ')}`);
  }
}

function createUserProfile(data: Partial<UserProfile>): UserProfile {
  const defaultProfile: UserProfile = {
    id: Date.now(),
    username: '',
    email: '',
    isActive: true
  };

  const profile = { ...defaultProfile, ...data };
  validateUserProfile(profile);
  return profile;
}