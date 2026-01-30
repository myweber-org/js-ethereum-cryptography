import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true)
  }).default({}),
  tags: z.array(z.string()).max(10)
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}typescript
interface UserProfile {
  username: string;
  email: string;
  age: number;
  isActive: boolean;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UserProfileValidator {
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validate(profile: UserProfile): void {
    if (!UserProfileValidator.USERNAME_REGEX.test(profile.username)) {
      throw new ValidationError(
        'Username must be 3-20 characters and contain only letters, numbers, and underscores'
      );
    }

    if (!UserProfileValidator.EMAIL_REGEX.test(profile.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (profile.age < 0 || profile.age > 150) {
      throw new ValidationError('Age must be between 0 and 150');
    }

    if (typeof profile.isActive !== 'boolean') {
      throw new ValidationError('isActive must be a boolean value');
    }
  }
}

function validateUserProfile(profileData: unknown): UserProfile {
  if (
    !profileData ||
    typeof profileData !== 'object' ||
    !('username' in profileData) ||
    !('email' in profileData) ||
    !('age' in profileData) ||
    !('isActive' in profileData)
  ) {
    throw new ValidationError('Invalid profile data structure');
  }

  const profile = profileData as UserProfile;
  UserProfileValidator.validate(profile);
  return profile;
}

export { UserProfile, ValidationError, UserProfileValidator, validateUserProfile };
```