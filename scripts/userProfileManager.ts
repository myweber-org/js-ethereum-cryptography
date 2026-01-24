
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

  validateProfile(profile: Partial<UserProfile>): boolean {
    if (profile.username && profile.username.length < 3) {
      return false;
    }
    
    if (profile.email && !this.isValidEmail(profile.email)) {
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

  addProfile(profile: UserProfile): void {
    if (!this.validateProfile(profile)) {
      throw new Error('Invalid profile data');
    }
    
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with id ${profile.id} already exists`);
    }
    
    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      return false;
    }
    
    if (!this.validateProfile(updates)) {
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

  filterProfilesByPreference(preference: keyof UserProfile['preferences'], value: any): UserProfile[] {
    return this.getAllProfiles().filter(
      profile => profile.preferences[preference] === value
    );
  }
}

export { UserProfileManager, UserProfile };