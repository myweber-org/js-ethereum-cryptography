
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
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  validateProfile(profile: Partial<UserProfile>): boolean {
    if (!profile.username || profile.username.trim().length < 3) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      return false;
    }

    return true;
  }

  addProfile(id: string, profileData: Partial<UserProfile>): boolean {
    if (this.profiles.has(id)) {
      return false;
    }

    if (!this.validateProfile(profileData)) {
      return false;
    }

    const defaultProfile: UserProfile = {
      id,
      username: profileData.username!,
      email: profileData.email!,
      age: profileData.age,
      preferences: profileData.preferences || {
        theme: 'light',
        notifications: true
      }
    };

    this.profiles.set(id, defaultProfile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return false;
    }

    const mergedProfile = { ...existingProfile, ...updates };
    if (!this.validateProfile(mergedProfile)) {
      return false;
    }

    this.profiles.set(id, mergedProfile as UserProfile);
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

  filterByAge(minAge: number, maxAge: number): UserProfile[] {
    return this.getAllProfiles().filter(profile => {
      return profile.age !== undefined && profile.age >= minAge && profile.age <= maxAge;
    });
  }
}

export { UserProfileManager, UserProfile };