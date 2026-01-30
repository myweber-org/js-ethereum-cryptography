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

export { UserPreferencesManager, type UserPreferences };typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notificationsEnabled: true,
    fontSize: 14,
    autoSave: true
};

const STORAGE_KEY = 'user_preferences';

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validatePreferences(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validatePreferences(data: unknown): UserPreferences {
        const validated: UserPreferences = { ...DEFAULT_PREFERENCES };
        
        if (data && typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            
            if (obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'auto') {
                validated.theme = obj.theme;
            }
            
            if (typeof obj.language === 'string') {
                validated.language = obj.language;
            }
            
            if (typeof obj.notificationsEnabled === 'boolean') {
                validated.notificationsEnabled = obj.notificationsEnabled;
            }
            
            if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
                validated.fontSize = obj.fontSize;
            }
            
            if (typeof obj.autoSave === 'boolean') {
                validated.autoSave = obj.autoSave;
            }
        }
        
        return validated;
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): boolean {
        const newPreferences = { ...this.preferences, ...updates };
        const validated = this.validatePreferences(newPreferences);
        
        if (JSON.stringify(validated) !== JSON.stringify(this.preferences)) {
            this.preferences = validated;
            this.savePreferences();
            return true;
        }
        return false;
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            const validated = this.validatePreferences(parsed);
            this.preferences = validated;
            this.savePreferences();
            return true;
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

export { UserPreferencesManager, type UserPreferences };
```