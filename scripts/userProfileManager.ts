
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
      throw new Error(`Profile with id ${profile.id} already exists`);
    }
    
    if (!this.validateEmail(profile.email)) {
      throw new Error('Invalid email format');
    }
    
    if (profile.age < 0 || profile.age > 150) {
      throw new Error('Age must be between 0 and 150');
    }
    
    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      return null;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    
    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error('Invalid email format in update');
    }
    
    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | null {
    return this.profiles.get(id) || null;
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    
    if (!profile) {
      return false;
    }

    this.profiles.set(id, { ...profile, isActive: false });
    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  const updated = profileManager.updateProfile('user-001', { age: 31 });
  
  if (updated) {
    console.log(`Updated profile: ${updated.username}, Age: ${updated.age}`);
  }

  const activeProfiles = profileManager.getActiveProfiles();
  console.log(`Active users: ${activeProfiles.length}`);
  
} catch (error) {
  console.error('Profile operation failed:', error.message);
}
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

  validateProfile(profile: Partial<UserProfile>): profile is UserProfile {
    return (
      typeof profile.id === 'string' &&
      typeof profile.username === 'string' &&
      typeof profile.email === 'string' &&
      this.isValidEmail(profile.email) &&
      typeof profile.preferences?.theme === 'string' &&
      ['light', 'dark'].includes(profile.preferences.theme) &&
      typeof profile.preferences?.notifications === 'boolean'
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addProfile(profile: UserProfile): void {
    if (!this.validateProfile(profile)) {
      throw new Error('Invalid profile data');
    }
    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) return false;

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

  getProfilesByPreference(preference: 'light' | 'dark'): UserProfile[] {
    return Array.from(this.profiles.values()).filter(
      profile => profile.preferences.theme === preference
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

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      return false;
    }

    if (!this.validateEmail(profile.email)) {
      throw new Error('Invalid email format');
    }

    if (profile.age && (profile.age < 0 || profile.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      return false;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.age && (updates.age < 0 || updates.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    this.profiles.set(id, { ...profile, ...updates });
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
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