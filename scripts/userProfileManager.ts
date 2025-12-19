
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  lastLogin: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with ID ${profile.id} already exists`);
    }

    if (!this.isValidEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age < 0 || profile.age > 150) {
      throw new Error(`Invalid age: ${profile.age}`);
    }

    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): void {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error(`Invalid age: ${updates.age}`);
    }

    this.profiles.set(id, { ...profile, ...updates, lastLogin: new Date() });
  }

  getProfile(id: string): UserProfile | undefined {
    const profile = this.profiles.get(id);
    return profile ? { ...profile } : undefined;
  }

  deactivateProfile(id: string): void {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    this.profiles.set(id, { ...profile, isActive: false });
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .map(profile => ({ ...profile }));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getProfileCount(): number {
    return this.profiles.size;
  }
}

export { UserProfileManager, UserProfile };