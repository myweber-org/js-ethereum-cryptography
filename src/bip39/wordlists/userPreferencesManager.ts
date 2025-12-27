interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en-US',
  notificationsEnabled: true,
  fontSize: 14
};

class UserPreferencesManager {
  private readonly STORAGE_KEY = 'user_preferences';
  
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return { ...DEFAULT_PREFERENCES };
      
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
  
  private validateAndMerge(data: unknown): UserPreferences {
    const result = { ...DEFAULT_PREFERENCES };
    
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      
      if (obj.theme && ['light', 'dark', 'auto'].includes(obj.theme as string)) {
        result.theme = obj.theme as UserPreferences['theme'];
      }
      
      if (obj.language && typeof obj.language === 'string') {
        result.language = obj.language;
      }
      
      if (typeof obj.notificationsEnabled === 'boolean') {
        result.notificationsEnabled = obj.notificationsEnabled;
      }
      
      if (typeof obj.fontSize === 'number' && obj.fontSize >= 8 && obj.fontSize <= 32) {
        result.fontSize = obj.fontSize;
      }
    }
    
    return result;
  }
}

export const preferencesManager = new UserPreferencesManager();