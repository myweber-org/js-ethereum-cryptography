
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
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
  lastLogin: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with id ${profile.id} already exists`);
    }

    if (!this.isValidEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      throw new Error(`Invalid age value: ${profile.age}`);
    }

    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return null;
    }

    const updatedProfile = { ...existingProfile, ...updates };

    if (updates.email && !this.isValidEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error(`Invalid age value: ${updates.age}`);
    }

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | null {
    return this.profiles.get(id) || null;
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      return false;
    }

    profile.isActive = false;
    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.isActive);
  }

  getProfilesOlderThan(days: number): UserProfile[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return Array.from(this.profiles.values()).filter(
      profile => profile.lastLogin < cutoffDate
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
  lastLogin: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      console.error(`Profile with ID ${profile.id} already exists`);
      return false;
    }

    if (!this.validateEmail(profile.email)) {
      console.error(`Invalid email format: ${profile.email}`);
      return false;
    }

    if (profile.age !== undefined && profile.age < 0) {
      console.error(`Invalid age: ${profile.age}`);
      return false;
    }

    this.profiles.set(profile.id, profile);
    console.log(`Profile added: ${profile.username}`);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      console.error(`Invalid email format: ${updates.email}`);
      return false;
    }

    if (updates.age !== undefined && updates.age < 0) {
      console.error(`Invalid age: ${updates.age}`);
      return false;
    }

    const updatedProfile = { ...profile, ...updates, lastLogin: new Date() };
    this.profiles.set(id, updatedProfile);
    console.log(`Profile updated: ${updatedProfile.username}`);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      return false;
    }

    const updatedProfile = { ...profile, isActive: false, lastLogin: new Date() };
    this.profiles.set(id, updatedProfile);
    console.log(`Profile deactivated: ${updatedProfile.username}`);
    return true;
  }

  listActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const profileManager = new UserProfileManager();

const initialProfile: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date()
};

profileManager.addProfile(initialProfile);
profileManager.updateProfile('user-001', { age: 31 });
const profile = profileManager.getProfile('user-001');
const activeProfiles = profileManager.listActiveProfiles();