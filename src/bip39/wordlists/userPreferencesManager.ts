
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private defaultPreferences: UserPreferences = {
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    fontSize: 14
  };

  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return { ...this.defaultPreferences, ...JSON.parse(stored) };
      } catch {
        return this.defaultPreferences;
      }
    }
    return this.defaultPreferences;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
  }

  getTheme(): UserPreferences['theme'] {
    return this.getPreferences().theme;
  }

  setTheme(theme: UserPreferences['theme']): void {
    this.updatePreferences({ theme });
  }

  isDarkMode(): boolean {
    const theme = this.getTheme();
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();