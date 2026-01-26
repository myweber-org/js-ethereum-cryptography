interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  fontSize: 14
};

class PreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  constructor() {
    this.initializePreferences();
  }

  private initializePreferences(): void {
    if (!this.getStoredPreferences()) {
      this.savePreferences(DEFAULT_PREFERENCES);
    }
  }

  getPreferences(): UserPreferences {
    const stored = this.getStoredPreferences();
    return { ...DEFAULT_PREFERENCES, ...stored };
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = this.validatePreferences({ ...current, ...updates });
    this.savePreferences(updated);
    return updated;
  }

  resetToDefaults(): UserPreferences {
    this.savePreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  }

  private validatePreferences(prefs: UserPreferences): UserPreferences {
    const validated = { ...prefs };
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = DEFAULT_PREFERENCES.theme;
    }
    
    if (typeof validated.notifications !== 'boolean') {
      validated.notifications = DEFAULT_PREFERENCES.notifications;
    }
    
    if (typeof validated.language !== 'string' || validated.language.length < 2) {
      validated.language = DEFAULT_PREFERENCES.language;
    }
    
    if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
      validated.fontSize = DEFAULT_PREFERENCES.fontSize;
    }
    
    return validated;
  }

  private getStoredPreferences(): Partial<UserPreferences> | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
}

export const preferencesManager = new PreferencesManager();interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  resultsPerPage: 20
};

function validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const validated: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme)) {
    validated.theme = prefs.theme;
  }

  if (typeof prefs.notifications === 'boolean') {
    validated.notifications = prefs.notifications;
  }

  if (prefs.language && typeof prefs.language === 'string') {
    validated.language = prefs.language;
  }

  if (prefs.resultsPerPage && Number.isInteger(prefs.resultsPerPage) && prefs.resultsPerPage > 0) {
    validated.resultsPerPage = prefs.resultsPerPage;
  }

  return validated;
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  return validatePreferences({ ...existing, ...updates });
}

export { UserPreferences, DEFAULT_PREFERENCES, validatePreferences, mergePreferences };