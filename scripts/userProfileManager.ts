
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

  updateProfile(id: number, updates: Partial<UserProfile>): boolean {
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
    console.log(`Profile updated for user ID: ${id}`);
    return true;
  }

  getProfile(id: number): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  removeProfile(id: number): boolean {
    if (!this.profiles.has(id)) {
      console.error(`Profile with ID ${id} does not exist`);
      return false;
    }

    this.profiles.delete(id);
    console.log(`Profile removed for user ID: ${id}`);
    return true;
  }

  private validateProfile(profile: UserProfile): boolean {
    if (profile.age < 0 || profile.age > 150) {
      console.error(`Invalid age: ${profile.age}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      console.error(`Invalid email format: ${profile.email}`);
      return false;
    }

    if (profile.username.trim().length < 3) {
      console.error(`Username must be at least 3 characters long`);
      return false;
    }

    return true;
  }

  getActiveUsers(): UserProfile[] {
    return this.getAllProfiles().filter(profile => profile.isActive);
  }

  getUsersByAgeRange(minAge: number, maxAge: number): UserProfile[] {
    return this.getAllProfiles().filter(
      profile => profile.age >= minAge && profile.age <= maxAge
    );
  }
}

export { UserProfile, UserProfileManager };
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
      throw new Error(`Profile with ID ${profile.id} already exists`);
    }
    
    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }
    
    if (profile.age !== undefined && profile.age < 0) {
      throw new Error(`Age cannot be negative: ${profile.age}`);
    }
    
    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      return null;
    }
    
    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }
    
    if (updates.age !== undefined && updates.age < 0) {
      throw new Error(`Age cannot be negative: ${updates.age}`);
    }
    
    const updatedProfile = {
      ...existingProfile,
      ...updates,
      lastLogin: new Date()
    };
    
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
    
    this.profiles.set(id, {
      ...profile,
      isActive: false,
      lastLogin: new Date()
    });
    
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

export { UserProfileManager, UserProfile };