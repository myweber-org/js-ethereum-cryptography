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
  
  constructor() {
    this.ensureDefaults();
  }

  private ensureDefaults(): void {
    const current = this.loadPreferences();
    const merged = { ...DEFAULT_PREFERENCES, ...current };
    this.savePreferences(merged);
  }

  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return { ...DEFAULT_PREFERENCES };
      
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const current = this.loadPreferences();
      const updated = { ...current, ...prefs };
      const validated = this.validatePreferences(updated);
      
      localStorage.setItem(this.storageKey, JSON.stringify(validated));
      return true;
    } catch {
      return false;
    }
  }

  private validatePreferences(prefs: any): UserPreferences {
    const themes: Array<UserPreferences['theme']> = ['light', 'dark', 'auto'];
    
    return {
      theme: themes.includes(prefs.theme) ? prefs.theme : DEFAULT_PREFERENCES.theme,
      language: typeof prefs.language === 'string' ? prefs.language : DEFAULT_PREFERENCES.language,
      notifications: typeof prefs.notifications === 'boolean' ? prefs.notifications : DEFAULT_PREFERENCES.notifications,
      fontSize: typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 24 
        ? prefs.fontSize 
        : DEFAULT_PREFERENCES.fontSize
    };
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
    this.ensureDefaults();
  }

  getCurrentTheme(): UserPreferences['theme'] {
    const prefs = this.loadPreferences();
    if (prefs.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return prefs.theme;
  }
}

export const preferenceManager = new PreferenceManager();
export type { UserPreferences };