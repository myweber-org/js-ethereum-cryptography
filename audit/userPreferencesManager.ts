import { BehaviorSubject } from 'rxjs';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notificationsEnabled: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en-US',
  notificationsEnabled: true,
  itemsPerPage: 25
};

const STORAGE_KEY = 'app_user_preferences';

export class UserPreferencesManager {
  private readonly preferencesSubject = new BehaviorSubject<UserPreferences>(this.loadPreferences());
  
  readonly preferences$ = this.preferencesSubject.asObservable();

  get currentPreferences(): UserPreferences {
    return this.preferencesSubject.value;
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.currentPreferences;
    const updated = { ...current, ...updates };
    
    this.savePreferences(updated);
    this.preferencesSubject.next(updated);
  }

  resetToDefaults(): void {
    this.savePreferences(DEFAULT_PREFERENCES);
    this.preferencesSubject.next(DEFAULT_PREFERENCES);
  }

  private loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_PREFERENCES;
      
      const parsed = JSON.parse(stored);
      return this.validatePreferences(parsed) ? parsed : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  private savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  private validatePreferences(obj: any): obj is UserPreferences {
    return (
      obj &&
      typeof obj === 'object' &&
      ['light', 'dark'].includes(obj.theme) &&
      typeof obj.language === 'string' &&
      typeof obj.notificationsEnabled === 'boolean' &&
      typeof obj.itemsPerPage === 'number' &&
      obj.itemsPerPage > 0
    );
  }
}

export const userPreferencesManager = new UserPreferencesManager();interface UserPreferences {
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

    const prefs = data as Record<string, unknown>;
    
    const theme = prefs.theme;
    if (!['light', 'dark', 'auto'].includes(theme as string)) {
      throw new Error('Invalid theme value');
    }

    const notifications = prefs.notifications;
    if (typeof notifications !== 'boolean') {
      throw new Error('Invalid notifications value');
    }

    const language = prefs.language;
    if (typeof language !== 'string' || language.length !== 2) {
      throw new Error('Invalid language value');
    }

    const fontSize = prefs.fontSize;
    if (typeof fontSize !== 'number' || fontSize < 8 || fontSize > 32) {
      throw new Error('Invalid font size value');
    }

    return {
      theme: theme as 'light' | 'dark' | 'auto',
      notifications: notifications as boolean,
      language: language as string,
      fontSize: fontSize as number
    };
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

  public getPreferences(): Readonly<UserPreferences> {
    return { ...this.preferences };
  }

  public resetToDefaults(): void {
    this.preferences = this.getDefaultPreferences();
    this.savePreferences();
  }

  public isDarkMode(): boolean {
    if (this.preferences.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.preferences.theme === 'dark';
  }
}

export { UserPreferencesManager, type UserPreferences };