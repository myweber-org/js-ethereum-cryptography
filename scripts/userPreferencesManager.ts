import { BehaviorSubject, Observable } from 'rxjs';

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
  private preferencesSubject: BehaviorSubject<UserPreferences>;
  public preferences$: Observable<UserPreferences>;

  constructor() {
    const saved = this.loadFromStorage();
    this.preferencesSubject = new BehaviorSubject<UserPreferences>(saved);
    this.preferences$ = this.preferencesSubject.asObservable();
  }

  private loadFromStorage(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load preferences from storage:', error);
    }
    return DEFAULT_PREFERENCES;
  }

  private saveToStorage(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.warn('Failed to save preferences to storage:', error);
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.preferencesSubject.getValue();
    const updated = { ...current, ...updates };
    this.preferencesSubject.next(updated);
    this.saveToStorage(updated);
  }

  resetToDefaults(): void {
    this.preferencesSubject.next(DEFAULT_PREFERENCES);
    this.saveToStorage(DEFAULT_PREFERENCES);
  }

  getCurrentPreferences(): UserPreferences {
    return this.preferencesSubject.getValue();
  }
}