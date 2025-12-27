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
        return this.validatePreferences(JSON.parse(stored));
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
      fontSize: 16
    };
  }

  private validatePreferences(data: unknown): UserPreferences {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const prefs = data as Partial<UserPreferences>;
    
    const theme = prefs.theme && ['light', 'dark', 'auto'].includes(prefs.theme) 
      ? prefs.theme 
      : 'auto';
    
    const notifications = typeof prefs.notifications === 'boolean' 
      ? prefs.notifications 
      : true;
    
    const language = typeof prefs.language === 'string' 
      ? prefs.language 
      : 'en';
    
    const fontSize = typeof prefs.fontSize === 'number' && prefs.fontSize >= 8 && prefs.fontSize <= 32
      ? prefs.fontSize
      : 16;

    return { theme, notifications, language, fontSize };
  }

  public getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const newPreferences = { ...this.preferences, ...updates };
    this.preferences = this.validatePreferences(newPreferences);
    this.savePreferences();
  }

  private savePreferences(): void {
    localStorage.setItem(
      UserPreferencesManager.STORAGE_KEY, 
      JSON.stringify(this.preferences)
    );
  }

  public resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  public applyPreferences(): void {
    document.documentElement.setAttribute('data-theme', this.preferences.theme);
    document.documentElement.style.fontSize = `${this.preferences.fontSize}px`;
  }
}

export { UserPreferencesManager, type UserPreferences };