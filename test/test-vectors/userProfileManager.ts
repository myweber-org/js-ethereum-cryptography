
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
    this.profiles.set(id, profile);
    console.log(`Profile deactivated for user: ${profile.username}`);
    return true;
  }

  listActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  private validateProfile(profile: UserProfile): boolean {
    if (!profile.id || profile.id.trim() === '') {
      console.error('Profile ID is required');
      return false;
    }

    if (!profile.username || profile.username.trim() === '') {
      console.error('Username is required');
      return false;
    }

    if (!profile.email || !this.isValidEmail(profile.email)) {
      console.error('Valid email is required');
      return false;
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      console.error('Age must be between 0 and 150');
      return false;
    }

    if (profile.lastLogin > new Date()) {
      console.error('Last login date cannot be in the future');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date('2024-01-15')
};

profileManager.addProfile(sampleProfile);
profileManager.updateProfile('user-001', { age: 31 });
const retrievedProfile = profileManager.getProfile('user-001');
const activeProfiles = profileManager.listActiveProfiles();
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
    this.profiles.set(id, profile);
    console.log(`Profile deactivated for user: ${profile.username}`);
    return true;
  }

  listActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  private validateProfile(profile: UserProfile): boolean {
    const errors: string[] = [];

    if (!profile.id || profile.id.trim().length === 0) {
      errors.push('ID is required');
    }

    if (!profile.username || profile.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!profile.email || !this.isValidEmail(profile.email)) {
      errors.push('Valid email is required');
    }

    if (profile.age < 0 || profile.age > 150) {
      errors.push('Age must be between 0 and 150');
    }

    if (errors.length > 0) {
      console.error(`Validation failed for profile ${profile.id}:`, errors);
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date()
};

profileManager.addProfile(sampleProfile);
profileManager.updateProfile('user-001', { age: 31 });
const retrievedProfile = profileManager.getProfile('user-001');
const activeProfiles = profileManager.listActiveProfiles();
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

    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age < 0 || profile.age > 150) {
      throw new Error(`Invalid age value: ${profile.age}`);
    }

    this.profiles.set(profile.id, { ...profile });
  }

  updateProfile(id: string, updates: Partial<UserProfile>): void {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      throw new Error(`Profile with ID ${id} not found`);
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error(`Invalid age value: ${updates.age}`);
    }

    this.profiles.set(id, { ...existingProfile, ...updates });
  }

  getProfile(id: string): UserProfile | undefined {
    const profile = this.profiles.get(id);
    return profile ? { ...profile } : undefined;
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .map(profile => ({ ...profile }));
  }

  deactivateInactiveUsers(daysThreshold: number): string[] {
    const deactivatedIds: string[] = [];
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    this.profiles.forEach((profile, id) => {
      if (profile.lastLogin < thresholdDate && profile.isActive) {
        profile.isActive = false;
        deactivatedIds.push(id);
      }
    });

    return deactivatedIds;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export { UserProfileManager, UserProfile };