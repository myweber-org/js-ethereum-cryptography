
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
    this.auditLog('PROFILE_UPDATE', userId, updates);
    
    return updatedProfile;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private auditLog(action: string, userId: string, details: object): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details
    };
    console.log('AUDIT_LOG:', JSON.stringify(logEntry));
  }

  addProfile(profile: UserProfile): void {
    if (this.profiles.has(profile.id)) {
      throw new Error(`Profile with id ${profile.id} already exists`);
    }
    this.profiles.set(profile.id, profile);
  }

  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }
}

const profileManager = new UserProfileManager();

profileManager.addProfile({
  id: 'user-123',
  email: 'john@example.com',
  displayName: 'John Doe',
  age: 30,
  lastUpdated: new Date()
});

try {
  const updated = profileManager.updateProfile('user-123', {
    displayName: 'John Smith',
    age: 31
  });
  console.log('Updated profile:', updated);
} catch (error) {
  console.error('Update failed:', error.message);
}