
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

    if (!this.validateEmail(profile.email)) {
      throw new Error('Invalid email format');
    }

    if (profile.age && profile.age < 0) {
      throw new Error('Age cannot be negative');
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return false;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.age && updates.age < 0) {
      throw new Error('Age cannot be negative');
    }

    this.profiles.set(id, { ...existingProfile, ...updates });
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

    profile.isActive = false;
    profile.lastLogin = new Date();
    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.isActive);
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const profileManager = new UserProfileManager();

const newUser: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date()
};

profileManager.addProfile(newUser);
profileManager.updateProfile('user-001', { age: 31 });
const activeUsers = profileManager.getActiveProfiles();