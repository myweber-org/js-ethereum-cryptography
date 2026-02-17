interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences?: Partial<UserPreferences>) {
    this.preferences = this.loadPreferences();
    if (defaultPreferences) {
      this.preferences = { ...this.preferences, ...defaultPreferences };
    }
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      language: 'en-US',
      notificationsEnabled: true,
      fontSize: 16
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    try {
      localStorage.setItem(
        UserPreferencesManager.STORAGE_KEY, 
        JSON.stringify(this.preferences)
      );
      this.notifyPreferencesChange(oldPreferences, this.preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      this.preferences = oldPreferences;
      throw new Error('Preferences save failed');
    }
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.updatePreferences(this.getDefaultPreferences());
  }

  validatePreferences(prefs: Partial<UserPreferences>): string[] {
    const errors: string[] = [];

    if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push('Invalid theme value');
    }

    if (prefs.fontSize !== undefined) {
      if (typeof prefs.fontSize !== 'number' || prefs.fontSize < 8 || prefs.fontSize > 72) {
        errors.push('Font size must be between 8 and 72');
      }
    }

    if (prefs.language && typeof prefs.language !== 'string') {
      errors.push('Language must be a string');
    }

    return errors;
  }

  private notifyPreferencesChange(oldPrefs: UserPreferences, newPrefs: UserPreferences): void {
    const changes: string[] = [];

    if (oldPrefs.theme !== newPrefs.theme) {
      changes.push(`Theme changed from ${oldPrefs.theme} to ${newPrefs.theme}`);
    }

    if (oldPrefs.fontSize !== newPrefs.fontSize) {
      changes.push(`Font size changed from ${oldPrefs.fontSize} to ${newPrefs.fontSize}`);
    }

    if (changes.length > 0) {
      console.log('Preferences updated:', changes.join(', '));
    }
  }
}

export { UserPreferencesManager, type UserPreferences };