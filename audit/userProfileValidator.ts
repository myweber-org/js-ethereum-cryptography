
interface UserProfile {
  email: string;
  username: string;
  age: number;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUserProfile(profile: UserProfile): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!profile.email || !emailRegex.test(profile.email)) {
    throw new ValidationError('Invalid email address format');
  }
  
  if (!profile.username || profile.username.length < 3) {
    throw new ValidationError('Username must be at least 3 characters long');
  }
  
  if (profile.username.length > 20) {
    throw new ValidationError('Username cannot exceed 20 characters');
  }
  
  if (profile.age < 18) {
    throw new ValidationError('User must be at least 18 years old');
  }
  
  if (profile.age > 120) {
    throw new ValidationError('Age must be a reasonable value');
  }
}

export function sanitizeUsername(username: string): string {
  return username.trim().replace(/\s+/g, '_').toLowerCase();
}

export function createUserProfile(
  email: string,
  username: string,
  age: number
): UserProfile {
  const sanitizedUsername = sanitizeUsername(username);
  const profile: UserProfile = { email, username: sanitizedUsername, age };
  
  validateUserProfile(profile);
  return profile;
}