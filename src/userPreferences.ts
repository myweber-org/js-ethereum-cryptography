interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  
  if (!validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (typeof prefs.notifications !== 'boolean') {
    return false;
  }
  
  if (!validLanguages.includes(prefs.language)) {
    return false;
  }
  
  if (!Number.isInteger(prefs.itemsPerPage) || prefs.itemsPerPage < 1 || prefs.itemsPerPage > 100) {
    return false;
  }
  
  return true;
}

function updateUserPreferences(prefs: UserPreferences): void {
  if (!validateUserPreferences(prefs)) {
    throw new Error('Invalid user preferences');
  }
  
  console.log('Preferences updated successfully:', prefs);
}export interface UserPreferences {
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

export class PreferenceManager {
  private storageKey = 'user_preferences';

  loadPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return DEFAULT_PREFERENCES;
  }

  savePreferences(prefs: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  resetToDefaults(): void {
    localStorage.removeItem(this.storageKey);
  }

  validatePreferences(prefs: UserPreferences): boolean {
    const validThemes = ['light', 'dark', 'auto'];
    return (
      validThemes.includes(prefs.theme) &&
      typeof prefs.language === 'string' &&
      typeof prefs.notificationsEnabled === 'boolean' &&
      prefs.fontSize >= 10 &&
      prefs.fontSize <= 24
    );
  }
}