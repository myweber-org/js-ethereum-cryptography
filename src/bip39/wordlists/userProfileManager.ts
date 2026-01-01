
interface UserProfile {
  id: number;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<number, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with ID ${profile.id} already exists`);
    }
    
    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && profile.age < 0) {
      throw new Error(`Age cannot be negative: ${profile.age}`);
    }

    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: number, updates: Partial<UserProfile>): void {
    const profile = this.profiles.get(id);
    
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && updates.age < 0) {
      throw new Error(`Age cannot be negative: ${updates.age}`);
    }

    this.profiles.set(id, { ...profile, ...updates });
  }

  getProfile(id: number): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };interface UserProfile {
  id: string;
  email: string;
  username: string;
  age?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  validateProfile(data: Partial<UserProfile>): data is UserProfile {
    const requiredFields = ['id', 'email', 'username', 'preferences'] as const;
    return requiredFields.every(field => 
      data[field] !== undefined && 
      (field !== 'preferences' || this.validatePreferences(data.preferences))
    );
  }

  private validatePreferences(prefs?: any): prefs is UserProfile['preferences'] {
    return (
      prefs &&
      typeof prefs === 'object' &&
      ['light', 'dark'].includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean'
    );
  }

  addProfile(profileData: Partial<UserProfile>): boolean {
    if (!this.validateProfile(profileData)) {
      console.error('Invalid profile data structure');
      return false;
    }

    if (this.profiles.has(profileData.id!)) {
      console.error(`Profile with id ${profileData.id} already exists`);
      return false;
    }

    this.profiles.set(profileData.id!, profileData as UserProfile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existing = this.profiles.get(id);
    if (!existing) {
      console.error(`Profile ${id} not found`);
      return false;
    }

    const updatedProfile = { ...existing, ...updates };
    if (!this.validateProfile(updatedProfile)) {
      console.error('Updated profile data is invalid');
      return false;
    }

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