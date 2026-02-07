
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
      console.error(`Profile not found for user: ${userId}`);
      return null;
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
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
    this.logAudit('PROFILE_UPDATE', userId, updates);
    
    return updatedProfile;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private logAudit(action: string, userId: string, details: any): void {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details: JSON.stringify(details)
    };
    
    console.log('AUDIT_LOG:', auditEntry);
  }

  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }

  registerProfile(profile: Omit<UserProfile, 'lastUpdated'>): void {
    const newProfile: UserProfile = {
      ...profile,
      lastUpdated: new Date()
    };
    this.profiles.set(profile.id, newProfile);
    this.logAudit('PROFILE_CREATE', profile.id, { displayName: profile.displayName });
  }
}
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  validateProfile(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.username && profile.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }

    return errors;
  }

  addProfile(profile: UserProfile): boolean {
    const errors = this.validateProfile(profile);
    if (errors.length > 0) {
      console.error('Profile validation failed:', errors);
      return false;
    }

    if (this.profiles.has(profile.id)) {
      console.error(`Profile with id ${profile.id} already exists`);
      return false;
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      console.error(`Profile with id ${id} not found`);
      return false;
    }

    const errors = this.validateProfile(updates);
    if (errors.length > 0) {
      console.error('Update validation failed:', errors);
      return false;
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      preferences: {
        ...existingProfile.preferences,
        ...updates.preferences,
      },
    };

    this.profiles.set(id, updatedProfile);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }
}

export { UserProfileManager, type UserProfile };