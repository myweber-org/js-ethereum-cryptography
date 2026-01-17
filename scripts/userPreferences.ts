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

class UserPreferencesService {
  private readonly STORAGE_KEY = 'user_preferences';
  
  getPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    
    try {
      const parsed = JSON.parse(stored);
      return this.validateAndMerge(parsed);
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }
  
  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const merged = { ...current, ...updates };
    const validated = this.validateAndMerge(merged);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validated));
    return validated;
  }
  
  resetToDefaults(): UserPreferences {
    localStorage.removeItem(this.STORAGE_KEY);
    return { ...DEFAULT_PREFERENCES };
  }
  
  private validateAndMerge(data: any): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (typeof data.theme === 'string' && ['light', 'dark', 'auto'].includes(data.theme)) {
      result.theme = data.theme;
    }
    
    if (typeof data.notifications === 'boolean') {
      result.notifications = data.notifications;
    }
    
    if (typeof data.language === 'string' && data.language.length >= 2) {
      result.language = data.language;
    }
    
    if (typeof data.fontSize === 'number' && data.fontSize >= 8 && data.fontSize <= 32) {
      result.fontSize = data.fontSize;
    }
    
    return result;
  }
}

export const userPreferencesService = new UserPreferencesService();