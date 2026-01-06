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
}