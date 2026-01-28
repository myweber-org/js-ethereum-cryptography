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

    if (profile.preferences?.theme && !['light', 'dark'].includes(profile.preferences.theme)) {
      errors.push('Theme must be either light or dark');
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

    this.profiles.set(profile.id, profile);
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

  removeProfile(id: string): boolean {
    return this.profiles.delete(id);
  }
}

export { UserProfileManager, type UserProfile };
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

    if (profile.preferences?.theme && !['light', 'dark'].includes(profile.preferences.theme)) {
      errors.push('Theme must be either light or dark');
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
      console.error('Profile update validation failed:', errors);
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