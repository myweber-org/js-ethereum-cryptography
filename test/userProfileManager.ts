
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

    if (!this.isValidEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && profile.age < 0) {
      throw new Error(`Age cannot be negative: ${profile.age}`);
    }

    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): void {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      throw new Error(`Profile with id ${id} not found`);
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && updates.age < 0) {
      throw new Error(`Age cannot be negative: ${updates.age}`);
    }

    this.profiles.set(id, { ...existingProfile, ...updates });
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  removeProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getProfileCount(): number {
    return this.profiles.size;
  }
}

const profileManager = new UserProfileManager();

try {
  profileManager.addProfile({
    id: 'user-001',
    username: 'john_doe',
    email: 'john@example.com',
    age: 30,
    isActive: true,
    lastLogin: new Date()
  });

  profileManager.addProfile({
    id: 'user-002',
    username: 'jane_smith',
    email: 'jane@example.org',
    isActive: false,
    lastLogin: new Date('2024-01-15')
  });

  profileManager.updateProfile('user-001', { age: 31, isActive: false });
  
  const activeUsers = profileManager.getActiveUsers();
  console.log(`Active users: ${activeUsers.length}`);
  console.log(`Total profiles: ${profileManager.getProfileCount()}`);

} catch (error) {
  console.error('Profile operation failed:', error.message);
}