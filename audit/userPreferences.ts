interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en',
  fontSize: 14
};

function validatePreferences(prefs: Partial<UserPreferences>): boolean {
  if (prefs.theme && !['light', 'dark', 'auto'].includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.fontSize && (prefs.fontSize < 8 || prefs.fontSize > 32)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  return true;
}

function updateUserPreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences | null {
  if (!validatePreferences(updates)) {
    return null;
  }
  
  return {
    ...current,
    ...updates
  };
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

function loadPreferences(): UserPreferences {
  const stored = localStorage.getItem('userPreferences');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (validatePreferences(parsed)) {
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch {
      console.warn('Failed to parse stored preferences');
    }
  }
  return DEFAULT_PREFERENCES;
}

export { UserPreferences, validatePreferences, updateUserPreferences, savePreferences, loadPreferences };