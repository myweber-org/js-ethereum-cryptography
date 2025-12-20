
interface UserProfile {
  id: number;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<number, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

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

  updateProfile(id: number, updates: Partial<UserProfile>): boolean {
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

  getProfile(id: number): UserProfile | undefined {
    return this.profiles.get(id);
  }

  deactivateProfile(id: number): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      return false;
    }

    return this.updateProfile(id, { isActive: false });
  }

  private validateProfile(profile: UserProfile): boolean {
    if (profile.age < 0 || profile.age > 150) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      return false;
    }

    if (profile.username.trim().length === 0) {
      return false;
    }

    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.isActive);
  }

  getProfilesByAgeRange(minAge: number, maxAge: number): UserProfile[] {
    return Array.from(this.profiles.values()).filter(
      profile => profile.age >= minAge && profile.age <= maxAge
    );
  }
}

export { UserProfileManager, UserProfile };