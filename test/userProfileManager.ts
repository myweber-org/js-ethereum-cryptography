
interface UserProfile {
  id: string;
  username: string;
  email: string;
  age?: number;
  isActive: boolean;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  validateProfile(profile: UserProfile): string[] {
    const errors: string[] = [];

    if (!profile.username || profile.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRegex.test(profile.email)) {
      errors.push('Invalid email format');
    }

    if (profile.age !== undefined && (profile.age < 0 || profile.age > 150)) {
      errors.push('Age must be between 0 and 150');
    }

    return errors;
  }

  addProfile(profile: UserProfile): boolean {
    const validationErrors = this.validateProfile(profile);
    
    if (validationErrors.length > 0) {
      console.error('Profile validation failed:', validationErrors);
      return false;
    }

    if (this.profiles.has(profile.id)) {
      console.error(`Profile with ID ${profile.id} already exists`);
      return false;
    }

    this.profiles.set(profile.id, profile);
    console.log(`Profile added successfully: ${profile.username}`);
    return true;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): boolean {
    const existingProfile = this.profiles.get(id);
    
    if (!existingProfile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    const updatedProfile: UserProfile = { ...existingProfile, ...updates };
    const validationErrors = this.validateProfile(updatedProfile);
    
    if (validationErrors.length > 0) {
      console.error('Profile update validation failed:', validationErrors);
      return false;
    }

    this.profiles.set(id, updatedProfile);
    console.log(`Profile updated successfully: ${updatedProfile.username}`);
    return true;
  }

  getProfile(id: string): UserProfile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): UserProfile[] {
    return Array.from(this.profiles.values());
  }

  deactivateProfile(id: string): boolean {
    const profile = this.profiles.get(id);
    
    if (!profile) {
      console.error(`Profile with ID ${id} not found`);
      return false;
    }

    profile.isActive = false;
    this.profiles.set(id, profile);
    console.log(`Profile deactivated: ${profile.username}`);
    return true;
  }
}

const profileManager = new UserProfileManager();

const sampleProfile: UserProfile = {
  id: 'user-001',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
};

profileManager.addProfile(sampleProfile);

const updated = profileManager.updateProfile('user-001', { age: 31 });
if (updated) {
  const profile = profileManager.getProfile('user-001');
  console.log('Updated profile:', profile);
}
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

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      return null;
    }

    const updatedProfile = { ...existingProfile, ...updates };

    if (updates.email && !this.isValidEmail(updatedProfile.email)) {
      throw new Error(`Invalid email format: ${updatedProfile.email}`);
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error(`Invalid age: ${updates.age}`);
    }

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  getProfile(id: string): UserProfile | null {
    return this.profiles.get(id) || null;
  }

  getActiveUsers(): UserProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.isActive)
      .sort((a, b) => b.lastLogin.getTime() - a.lastLogin.getTime());
  }

  removeProfile(id: string): boolean {
    return this.profiles.delete(id);
  }

  getProfileCount(): number {
    return this.profiles.size;
  }

  private isValidEmail(email: string): boolean {
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

try {
  profileManager.addProfile(sampleProfile);
  console.log(`Profile added. Total profiles: ${profileManager.getProfileCount()}`);

  const updated = profileManager.updateProfile('user-123', { age: 31 });
  if (updated) {
    console.log(`Updated profile: ${updated.username}, Age: ${updated.age}`);
  }

  const activeUsers = profileManager.getActiveUsers();
  console.log(`Active users: ${activeUsers.length}`);
} catch (error) {
  console.error('Profile operation failed:', error instanceof Error ? error.message : 'Unknown error');
}