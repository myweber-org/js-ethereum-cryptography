
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

  addProfile(profile: UserProfile): boolean {
    if (!this.validateProfile(profile)) {
      return false;
    }

    if (this.profiles.has(profile.id)) {
      return false;
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
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

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  removeProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.id || !profile.username || !profile.email) {
      return false;
    }

    if (!this.isValidEmail(profile.email)) {
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

  filterByAge(minAge: number, maxAge: number): UserProfile[] {
    return this.getAllProfiles().filter(profile => {
      return profile.age !== undefined && profile.age >= minAge && profile.age <= maxAge;
    });
  }

  toggleNotifications(userId: string): boolean {
    const profile = this.profiles.get(userId);
    if (!profile) {
      return false;
    }

    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: !profile.preferences.notifications
      }
    };

    this.profiles.set(userId, updatedProfile);
    return true;
  }
}

export { UserProfileManager, UserProfile };
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

  validateProfile(profile: Partial<UserProfile>): string[] {
    const errors: string[] = [];

    if (profile.username && profile.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (profile.email && !this.isValidEmail(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addProfile(profile: UserProfile): boolean {
    const errors = this.validateProfile(profile);
    if (errors.length > 0) {
      console.error('Profile validation failed:', errors);
      return false;
    }

    if (this.profiles.has(profile.id)) {
      console.error('Profile with this ID already exists');
      return false;
    }

    this.profiles.set(profile.id, profile);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      console.error('Profile not found');
      return false;
    }

    const updatedProfile = { ...existingProfile, ...updates };
    const errors = this.validateProfile(updatedProfile);
    if (errors.length > 0) {
      console.error('Update validation failed:', errors);
      return false;
    }

    this.profiles.set(id, updatedProfile);
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

  deactivateInactiveUsers(maxInactiveDays: number): string[] {
    const now = new Date();
    const deactivatedIds: string[] = [];

    this.profiles.forEach((profile, id) => {
      if (profile.isActive) {
        const daysSinceLogin = Math.floor(
          (now.getTime() - profile.lastLogin.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLogin > maxInactiveDays) {
          profile.isActive = false;
          deactivatedIds.push(id);
        }
      }
    });

    return deactivatedIds;
  }
}

export { UserProfileManager, UserProfile };
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
      throw new Error(`Profile with id ${profile.id} already exists`);
    }
    
    this.profiles.set(profile.id, profile);
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      return null;
    }
    
    const updatedProfile = { ...existingProfile, ...updates };
    
    if (!this.validateProfile(updatedProfile)) {
      throw new Error('Invalid update data');
    }
    
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  filterByAge(minAge: number, maxAge: number): UserProfile[] {
    return this.getAllProfiles().filter(profile => 
      profile.age !== undefined && 
      profile.age >= minAge && 
      profile.age <= maxAge
    );
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-123',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

profileManager.addProfile(sampleProfile);

const updatedProfile = profileManager.updateProfile('user-123', {
  age: 31,
  preferences: {
    theme: 'light',
    notifications: false
  }
});

const filteredProfiles = profileManager.filterByAge(25, 35);
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
}

export { UserProfileManager, UserProfile };