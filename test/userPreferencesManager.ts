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
    const savedPreferences = this.loadFromStorage();
    const initialPreferences = { ...DEFAULT_PREFERENCES, ...savedPreferences };
    
    this.preferencesSubject = new BehaviorSubject<UserPreferences>(initialPreferences);
    this.preferences$ = this.preferencesSubject.asObservable();
    
    this.preferences$.subscribe(prefs => this.saveToStorage(prefs));
  }

  public updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.preferencesSubject.getValue();
    const updated = { ...current, ...updates };
    
    if (JSON.stringify(current) !== JSON.stringify(updated)) {
      this.preferencesSubject.next(updated);
    }
  }

  public resetToDefaults(): void {
    this.preferencesSubject.next(DEFAULT_PREFERENCES);
  }

  public getCurrentPreferences(): UserPreferences {
    return this.preferencesSubject.getValue();
  }

  private loadFromStorage(): Partial<UserPreferences> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveToStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences to storage:', error);
    }
  }
}