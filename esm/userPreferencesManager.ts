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

class UserPreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  private validatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const validated: UserPreferences = { ...DEFAULT_PREFERENCES, ...prefs };
    
    if (!['light', 'dark', 'auto'].includes(validated.theme)) {
      validated.theme = 'auto';
    }
    
    if (typeof validated.language !== 'string' || validated.language.length < 2) {
      validated.language = 'en-US';
    }
    
    if (typeof validated.notifications !== 'boolean') {
      validated.notifications = true;
    }
    
    if (typeof validated.fontSize !== 'number' || validated.fontSize < 8 || validated.fontSize > 32) {
      validated.fontSize = 14;
    }
    
    return validated;
  }
  
  savePreferences(prefs: Partial<UserPreferences>): boolean {
    try {
      const validated = this.validatePreferences(prefs);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }
  
  loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.validatePreferences(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return { ...DEFAULT_PREFERENCES };
  }
  
  resetToDefaults(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  getCurrentPreferences(): UserPreferences {
    return this.loadPreferences();
  }
}

export { UserPreferencesManager, type UserPreferences };
```