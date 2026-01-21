
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
    if (this.profiles.has(profile.id)) {
      return false;
    }

    const validationErrors = this.validateProfile(profile);
    if (validationErrors.length > 0) {
      console.warn('Profile validation failed:', validationErrors);
      return false;
    }

    this.profiles.set(profile.id, { ...profile });
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return false;
    }

    const validationErrors = this.validateProfile(updates);
    if (validationErrors.length > 0) {
      console.warn('Update validation failed:', validationErrors);
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    this.profiles.set(id, updatedProfile);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  removeProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  filterProfilesByPreference(preferenceKey: keyof UserProfile['preferences'], value: any): UserProfile[] {
    return this.getAllProfiles().filter(
      profile => profile.preferences[preferenceKey] === value
    );
  }
}

export { UserProfileManager, type UserProfile };
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

    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && profile.age < 0) {
      throw new Error(`Age cannot be negative: ${profile.age}`);
    }

    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return null;
    }

    const updatedProfile = { ...existingProfile, ...updates };

    if (updates.email && !this.validateEmail(updatedProfile.email)) {
      throw new Error(`Invalid email format: ${updatedProfile.email}`);
    }

    if (updates.age !== undefined && updatedProfile.age < 0) {
      throw new Error(`Age cannot be negative: ${updatedProfile.age}`);
    }

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | null {
    return this.profiles.get(id) || null;
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getProfileCount(): number {
    return this.profiles.size;
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
      return false;
    }

    if (!this.validateProfile(profile)) {
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
    const profile = this.profiles.get(id);
    if (!profile) {
      return false;
    }

    return this.updateProfile(id, { isActive: false });
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.username || profile.username.length < 3) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      return false;
    }

    if (profile.lastLogin > new Date()) {
      return false;
    }

    return true;
  }
}

export { UserProfileManager, UserProfile };