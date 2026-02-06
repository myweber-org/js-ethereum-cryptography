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
  private readonly STORAGE_KEY = 'user_preferences';

  getPreferences(): UserPreferences {
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

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  hasCustomPreferences(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}

export const preferencesManager = new UserPreferencesManager();