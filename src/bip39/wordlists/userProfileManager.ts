
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

export { UserProfileManager, UserProfile };