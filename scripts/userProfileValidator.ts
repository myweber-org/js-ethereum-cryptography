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
}import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  return UserProfileSchema.parse(input);
}

function safeValidateUserProfile(input: unknown) {
  return UserProfileSchema.safeParse(input);
}

export { UserProfileSchema, type UserProfile, validateUserProfile, safeValidateUserProfile };