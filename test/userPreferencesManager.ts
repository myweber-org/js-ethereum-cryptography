interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultPreferences();
      }
    }
    return this.getDefaultPreferences();
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      fontSize: 14
    };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
    this.validatePreferences();
    this.savePreferences();
  }

  private validatePreferences(): void {
    if (!['light', 'dark', 'auto'].includes(this.preferences.theme)) {
      this.preferences.theme = 'auto';
    }
    if (typeof this.preferences.notifications !== 'boolean') {
      this.preferences.notifications = true;
    }
    if (typeof this.preferences.fontSize !== 'number' || this.preferences.fontSize < 8 || this.preferences.fontSize > 32) {
      this.preferences.fontSize = 14;
    }
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY,
      JSON.stringify(this.preferences)
    );
  }

  getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }
}

export default UserPreferencesManager;typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notifications: true,
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences() || DEFAULT_PREFERENCES;
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        
        if (!this.validatePreferences(newPreferences)) {
            return false;
        }

        this.preferences = newPreferences;
        this.savePreferences();
        return true;
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private validatePreferences(prefs: UserPreferences): boolean {
        if (!VALID_LANGUAGES.includes(prefs.language)) {
            return false;
        }

        if (prefs.fontSize < MIN_FONT_SIZE || prefs.fontSize > MAX_FONT_SIZE) {
            return false;
        }

        if (prefs.theme !== 'light' && prefs.theme !== 'dark' && prefs.theme !== 'auto') {
            return false;
        }

        return true;
    }

    private loadPreferences(): UserPreferences | null {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (!stored) return null;

            const parsed = JSON.parse(stored);
            return this.validatePreferences(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }

    private savePreferences(): void {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    }
}

export { UserPreferencesManager, type UserPreferences };
```