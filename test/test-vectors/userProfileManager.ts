
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
    if (!profile.email || !emailRegex.test(profile.email)) {
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

const newUser: UserProfile = {
  id: 'user-123',
  username: 'john_doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  lastLogin: new Date()
};

profileManager.addProfile(newUser);
profileManager.updateProfile('user-123', { age: 31 });
const retrievedProfile = profileManager.getProfile('user-123');
const activeProfiles = profileManager.getActiveProfiles();
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  age: number;
  lastUpdated: Date;
}

class UserProfileManager {
  private profiles: Map<string, UserProfile> = new Map();

  updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const existingProfile = this.profiles.get(userId);
    if (!existingProfile) {
      console.error(`User ${userId} not found`);
      return null;
    }

    if (updates.email && !this.validateEmail(updates.email)) {
      throw new Error('Invalid email format');
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      lastUpdated: new Date()
    };

    this.profiles.set(userId, updatedProfile);
    this.logAudit('PROFILE_UPDATE', userId, updates);
    
    return updatedProfile;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private logAudit(action: string, userId: string, details: any): void {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details: JSON.stringify(details)
    };
    console.log('AUDIT_LOG:', auditEntry);
  }

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with id ${profile.id} already exists`);
    }
    this.profiles.set(profile.id, profile);
  }

  getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }
}

const profileManager = new UserProfileManager();
profileManager.addProfile({
  id: 'user-123',
  email: 'user@example.com',
  displayName: 'Test User',
  age: 25,
  lastUpdated: new Date()
});

try {
  const updated = profileManager.updateProfile('user-123', {
    displayName: 'Updated User',
    age: 26
  });
  console.log('Updated profile:', updated);
} catch (error) {
  console.error('Update failed:', error);
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
      throw new Error(`Profile with id ${profile.id} already exists`);
    }

    if (!this.validateEmail(profile.email)) {
      throw new Error(`Invalid email format: ${profile.email}`);
    }

    if (profile.age < 0 || profile.age > 150) {
      throw new Error(`Invalid age value: ${profile.age}`);
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
      throw new Error(`Invalid email format: ${updates.email}`);
    }

    if (updates.age !== undefined && (updates.age < 0 || updates.age > 150)) {
      throw new Error(`Invalid age value: ${updates.age}`);
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
    return true;
  }

  getActiveProfiles(): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.isActive);
  }

  getProfilesOlderThan(minAge: number): UserProfile[] {
    return Array.from(this.profiles.values()).filter(profile => profile.age > minAge);
  }

  private validateEmail(email: string): boolean {
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

const updated = profileManager.updateProfile('user-001', { age: 31 });
if (updated) {
  console.log(`Updated profile: ${updated.username}, Age: ${updated.age}`);
}

const activeProfiles = profileManager.getActiveProfiles();
console.log(`Active profiles: ${activeProfiles.length}`);