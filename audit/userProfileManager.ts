
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  age?: number;
  lastUpdated: Date;
}

class UserProfileManager {
  private readonly MIN_DISPLAY_NAME_LENGTH = 2;
  private readonly MAX_DISPLAY_NAME_LENGTH = 50;
  private readonly MIN_AGE = 13;
  private readonly MAX_AGE = 120;

  constructor(private auditLogger: (action: string, details: object) => void) {}

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateDisplayName(displayName: string): boolean {
    return displayName.length >= this.MIN_DISPLAY_NAME_LENGTH && 
           displayName.length <= this.MAX_DISPLAY_NAME_LENGTH;
  }

  validateAge(age?: number): boolean {
    if (age === undefined) return true;
    return Number.isInteger(age) && age >= this.MIN_AGE && age <= this.MAX_AGE;
  }

  updateProfile(currentProfile: UserProfile, updates: Partial<UserProfile>): UserProfile | null {
    const validationErrors: string[] = [];

    if (updates.email && !this.validateEmail(updates.email)) {
      validationErrors.push('Invalid email format');
    }

    if (updates.displayName && !this.validateDisplayName(updates.displayName)) {
      validationErrors.push(`Display name must be between ${this.MIN_DISPLAY_NAME_LENGTH} and ${this.MAX_DISPLAY_NAME_LENGTH} characters`);
    }

    if (updates.age !== undefined && !this.validateAge(updates.age)) {
      validationErrors.push(`Age must be between ${this.MIN_AGE} and ${this.MAX_AGE} or undefined`);
    }

    if (validationErrors.length > 0) {
      this.auditLogger('PROFILE_UPDATE_FAILED', {
        userId: currentProfile.id,
        errors: validationErrors,
        attemptedUpdates: updates
      });
      return null;
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      lastUpdated: new Date()
    };

    this.auditLogger('PROFILE_UPDATED', {
      userId: currentProfile.id,
      changes: updates,
      timestamp: updatedProfile.lastUpdated
    });

    return updatedProfile;
  }

  createProfile(id: string, email: string, displayName: string, age?: number): UserProfile | null {
    if (!this.validateEmail(email) || !this.validateDisplayName(displayName) || !this.validateAge(age)) {
      return null;
    }

    const profile: UserProfile = {
      id,
      email,
      displayName,
      age,
      lastUpdated: new Date()
    };

    this.auditLogger('PROFILE_CREATED', {
      userId: id,
      timestamp: profile.lastUpdated
    });

    return profile;
  }
}

const mockAuditLogger = (action: string, details: object) => {
  console.log(`[AUDIT] ${action}:`, details);
};

const profileManager = new UserProfileManager(mockAuditLogger);

const initialProfile = profileManager.createProfile(
  'user-123',
  'user@example.com',
  'John Doe',
  30
);

if (initialProfile) {
  const updatedProfile = profileManager.updateProfile(initialProfile, {
    displayName: 'Johnathan Doe',
    age: 31
  });
  
  if (updatedProfile) {
    console.log('Profile updated successfully:', updatedProfile);
  }
}