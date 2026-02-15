
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