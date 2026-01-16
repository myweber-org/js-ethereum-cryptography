
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

    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && profile.age < 0) {
      throw new Error(`Age cannot be negative: ${profile.age}`);
    }

    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      return null;
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      id: existingProfile.id
    };

    if (updates.email && !this.validateEmail(updatedProfile.email)) {
      throw new Error(`Invalid email format: ${updatedProfile.email}`);
    }

    if (updates.age !== undefined && updates.age < 0) {
      throw new Error(`Age cannot be negative: ${updates.age}`);
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

    profile.isActive = false;
    profile.lastLogin = new Date();
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
console.log('Updated profile:', updated);

const activeProfiles = profileManager.getActiveProfiles();
console.log('Active profiles:', activeProfiles.length);
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
    
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      return false;
    }
    
    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      return false;
    }
    
    return true;
  }

  addProfile(profile: UserProfile): void {
    if (!this.validateProfile(profile)) {
      throw new Error('Invalid profile data');
    }
    
    if (this.profiles.has(profile.id)) {
      throw new Error('Profile already exists');
    }
    
    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): void {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      throw new Error('Profile not found');
    }
    
    if (!this.validateProfile(updates)) {
      throw new Error('Invalid update data');
    }
    
    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      preferences: {
        ...existingProfile.preferences,
        ...updates.preferences
      }
    };
    
    this.profiles.set(id, updatedProfile);
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  filterByPreference(preferenceKey: keyof UserProfile['preferences'], value: any): UserProfile[] {
    return this.getAllProfiles().filter(profile => 
      profile.preferences[preferenceKey] === value
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
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with id ${profile.id} already exists`);
    }

    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      throw new Error(`Invalid age value: ${profile.age}`);
    }

    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): void {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      throw new Error(`Profile with id ${id} not found`);
    }

    const updatedProfile = { ...existingProfile, ...updates };

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error(`Invalid age value: ${updates.age}`);
    }

    this.profiles.set(id, updatedProfile);
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  deactivateProfile(id: string): void {
    const profile = this.profiles.get(id);
    
    if (profile) {
      this.profiles.set(id, { ...profile, isActive: false });
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };