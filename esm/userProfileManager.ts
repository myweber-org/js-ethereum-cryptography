
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

    const validatedUpdates = this.validateUpdates(updates);
    if (!validatedUpdates) {
      console.error(`Invalid updates for user: ${userId}`);
      return null;
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...validatedUpdates,
      lastUpdated: new Date()
    };

    this.profiles.set(userId, updatedProfile);
    this.logAudit(userId, 'PROFILE_UPDATE', validatedUpdates);
    
    return updatedProfile;
  }

  private validateUpdates(updates: Partial<UserProfile>): Partial<UserProfile> | null {
    const validated: Partial<UserProfile> = {};

    if (updates.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return null;
      }
      validated.email = updates.email;
    }

    if (updates.displayName !== undefined) {
      if (updates.displayName.trim().length < 2 || updates.displayName.trim().length > 50) {
        return null;
      }
      validated.displayName = updates.displayName.trim();
    }

    if (updates.age !== undefined) {
      if (updates.age < 0 || updates.age > 150) {
        return null;
      }
      validated.age = updates.age;
    }

    return validated;
  }

  private logAudit(userId: string, action: string, details: any): void {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      details: JSON.stringify(details)
    };
    
    console.log(`AUDIT: ${JSON.stringify(auditEntry)}`);
  }

  addProfile(profile: UserProfile): void {
    this.profiles.set(profile.id, profile);
    this.logAudit(profile.id, 'PROFILE_CREATE', { email: profile.email });
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

const updated = profileManager.updateProfile('user-123', {
  displayName: 'Johnathan Doe',
  age: 31
});

if (updated) {
  console.log(`Profile updated: ${JSON.stringify(updated)}`);
}