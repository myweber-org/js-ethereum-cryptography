
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
      console.error('Update validation failed:', errors);
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
}

export { UserProfileManager, type UserProfile };
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
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

    if (profile.age && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }

    if (profile.preferences?.language && !['en', 'es', 'fr'].includes(profile.preferences.language)) {
      errors.push('Unsupported language');
    }

    return errors;
  }

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      return false;
    }

    const validationErrors = this.validateProfile(profile);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid profile: ${validationErrors.join(', ')}`);
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
      throw new Error(`Invalid updates: ${validationErrors.join(', ')}`);
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

  filterProfilesByAge(minAge: number, maxAge: number): UserProfile[] {
    return this.getAllProfiles().filter(
      profile => profile.age >= minAge && profile.age <= maxAge
    );
  }

  countProfiles(): number {
    return this.profiles.size;
  }
}

export { UserProfileManager, UserProfile };
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  lastLogin: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  addProfile(profile: UserProfile): boolean {
    if (this.profiles.has(profile.id)) {
      console.error(`Profile with ID ${profile.id} already exists`);
      return false;
    }

    if (!this.validateProfile(profile)) {
      return false;
    }

    this.profiles.set(profile.id, profile);
    console.log(`Profile added for user: ${profile.username}`);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    
    if (!this.validateProfile(updatedProfile)) {
      return false;
    }

    this.profiles.set(id, updatedProfile);
    console.log(`Profile updated for user: ${updatedProfile.username}`);
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
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.id || profile.id.trim().length === 0) {
      console.error('Profile ID is required');
      return false;
    }

    if (!profile.username || profile.username.trim().length < 3) {
      console.error('Username must be at least 3 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      console.error('Invalid email format');
      return false;
    }

    if (profile.age < 0 || profile.age > 150) {
      console.error('Age must be between 0 and 150');
      return false;
    }

    return true;
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-123',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date()
};

profileManager.addProfile(sampleProfile);

const updated = profileManager.updateProfile('user-123', { age: 31 });
if (updated) {
  console.log('Profile updated successfully');
}

const activeProfiles = profileManager.getActiveProfiles();
console.log(`Active users: ${activeProfiles.length}`);