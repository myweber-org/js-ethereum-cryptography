typescript
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notifications: true,
  fontSize: 14
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE'];
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 24;

class UserPreferencesManager {
  private preferences: UserPreferences;

  constructor() {
    this.preferences = this.loadPreferences();
  }

  private loadPreferences(): UserPreferences {
    const stored = localStorage.getItem('userPreferences');
    if (!stored) return { ...DEFAULT_PREFERENCES };

    try {
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  private validatePreferences(data: any): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

    if (data.theme && ['light', 'dark', 'auto'].includes(data.theme)) {
      validated.theme = data.theme;
    }

    if (data.language && VALID_LANGUAGES.includes(data.language)) {
      validated.language = data.language;
    }

    if (typeof data.notifications === 'boolean') {
      validated.notifications = data.notifications;
    }

    if (typeof data.fontSize === 'number') {
      validated.fontSize = Math.max(
        MIN_FONT_SIZE,
        Math.min(MAX_FONT_SIZE, data.fontSize)
      );
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
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
  }

  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
  }

  isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export const userPreferences = new UserPreferencesManager();
```