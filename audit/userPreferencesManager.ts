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

export const userPreferencesManager = new UserPreferencesManager();