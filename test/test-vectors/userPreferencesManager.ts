interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 16
};

class UserPreferencesManager {
  private static STORAGE_KEY = 'user_preferences';

  static getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  }

  static updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }

  static resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return DEFAULT_PREFERENCES;
  }

  static subscribe(callback: (prefs: UserPreferences) => void): () => void {
    const handler = (event: StorageEvent) => {
      if (event.key === this.STORAGE_KEY) {
        callback(this.getPreferences());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}

export { UserPreferencesManager, type UserPreferences };