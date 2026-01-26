typescript
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

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMerge(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
        const merged = { ...DEFAULT_PREFERENCES, ...partial };
        
        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = DEFAULT_PREFERENCES.theme;
        }
        
        if (!VALID_LANGUAGES.includes(merged.language)) {
            merged.language = DEFAULT_PREFERENCES.language;
        }
        
        if (typeof merged.notifications !== 'boolean') {
            merged.notifications = DEFAULT_PREFERENCES.notifications;
        }
        
        if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
            merged.fontSize = DEFAULT_PREFERENCES.fontSize;
        }
        
        if (typeof merged.autoSave !== 'boolean') {
            merged.autoSave = DEFAULT_PREFERENCES.autoSave;
        }
        
        return merged;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        try {
            const newPreferences = this.validateAndMerge({ ...this.preferences, ...updates });
            this.preferences = newPreferences;
            localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
            return true;
        } catch (error) {
            console.error('Failed to update preferences:', error);
            return false;
        }
    }

    resetToDefaults(): boolean {
        return this.updatePreferences(DEFAULT_PREFERENCES);
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            return this.updatePreferences(parsed);
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class UserPreferencesManager {
  private static readonly STORAGE_KEY = 'user_preferences';
  private preferences: UserPreferences;

  constructor(defaultPreferences: UserPreferences) {
    this.preferences = this.loadPreferences() || defaultPreferences;
  }

  private loadPreferences(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
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

  private validatePreferences(prefs: UserPreferences): boolean {
    return (
      ['light', 'dark', 'auto'].includes(prefs.theme) &&
      typeof prefs.notifications === 'boolean' &&
      typeof prefs.language === 'string' &&
      prefs.language.length >= 2 &&
      prefs.fontSize >= 8 &&
      prefs.fontSize <= 32
    );
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

  resetToDefaults(defaults: UserPreferences): void {
    this.preferences = defaults;
    this.savePreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };