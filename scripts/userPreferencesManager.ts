interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notificationsEnabled: boolean;
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  fontSize: 16,
  notificationsEnabled: true,
  language: 'en-US'
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences';
  
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
    
    return updated;
  }

  resetToDefaults(): UserPreferences {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to reset preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();