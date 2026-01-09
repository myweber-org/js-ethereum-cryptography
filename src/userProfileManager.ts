
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
      console.error(`Profile not found for user: ${userId}`);
      return null;
    }

    if (updates.email && !this.isValidEmail(updates.email)) {
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

  private isValidEmail(email: string): boolean {
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

  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }

  registerProfile(profile: Omit<UserProfile, 'lastUpdated'>): void {
    const newProfile: UserProfile = {
      ...profile,
      lastUpdated: new Date()
    };
    this.profiles.set(profile.id, newProfile);
    this.logAudit('PROFILE_CREATE', profile.id, { displayName: profile.displayName });
  }
}