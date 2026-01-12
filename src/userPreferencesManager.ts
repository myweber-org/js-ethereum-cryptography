interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  notificationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  notificationsEnabled: true
};

class UserPreferencesManager {
  private readonly storageKey = 'user_preferences';

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return DEFAULT_PREFERENCES;

    try {
      const parsed = JSON.parse(stored) as Partial<UserPreferences>;
      return { ...DEFAULT_PREFERENCES, ...parsed };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }

  hasStoredPreferences(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();