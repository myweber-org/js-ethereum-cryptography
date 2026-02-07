
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  age: number;
  lastUpdated: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(userId);
    if (!existingProfile) {
      console.error(`User ${userId} not found`);
      return null;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      lastUpdated: new Date()
    };

    this.profiles.set(userId, updatedProfile);
    this.auditLog('PROFILE_UPDATE', userId, updates);
    
    return updatedProfile;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private auditLog(action: string, userId: string, details: object): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details
    };
    console.log('AUDIT_LOG:', JSON.stringify(logEntry));
  }

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with id ${profile.id} already exists`);
    }
    this.profiles.set(profile.id, profile);
  }

  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }
}

const profileManager = new UserProfileManager();

profileManager.addProfile({
  id: 'user-123',
  email: 'john@example.com',
  displayName: 'John Doe',
  age: 30,
  lastUpdated: new Date()
});

try {
  const updated = profileManager.updateProfile('user-123', {
    displayName: 'John Smith',
    age: 31
  });
  console.log('Updated profile:', updated);
} catch (error) {
  console.error('Update failed:', error.message);
}
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  addProfile(profile: UserProfile): boolean {
    if (!this.validateProfile(profile)) {
      return false;
    }
    
    if (this.profiles.has(profile.id)) {
      return false;
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    if (!this.validateProfile(updatedProfile)) {
      return false;
    }

    this.profiles.set(id, updatedProfile);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  deactivateProfile(id: string): boolean {
    return this.updateProfile(id, { isActive: false });
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.id || !profile.username || !profile.email) {
      return false;
    }

    if (!this.isValidEmail(profile.email)) {
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive);
  }

  getProfileCount(): number {
    return this.profiles.size;
  }
}

export { UserProfileManager, UserProfile };