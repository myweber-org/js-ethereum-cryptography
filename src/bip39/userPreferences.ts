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

class PreferenceManager {
  private readonly storageKey = 'user_preferences';
  
  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.loadPreferences();
    const merged = { ...current, ...prefs };
    const validated = this.validatePreferences(merged);
    
    localStorage.setItem(this.storageKey, JSON.stringify(validated));
    return validated;
  }

  resetPreferences(): UserPreferences {
    localStorage.removeItem(this.storageKey);
    return { ...DEFAULT_PREFERENCES };
  }

  private validatePreferences(prefs: any): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (prefs && typeof prefs === 'object') {
      if (['light', 'dark', 'auto'].includes(prefs.theme)) {
        result.theme = prefs.theme;
      }
      
      if (typeof prefs.language === 'string' && prefs.language.length >= 2) {
        result.language = prefs.language;
      }
      
      if (typeof prefs.notifications === 'boolean') {
        result.notifications = prefs.notifications;
      }
      
      if (typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32) {
        result.fontSize = Math.round(prefs.fontSize);
      }
    }
    
    return result;
  }
}

export const preferenceManager = new PreferenceManager();
export type { UserPreferences };