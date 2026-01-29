interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

function validatePreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  
  if (!validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (!validLanguages.includes(prefs.language)) {
    return false;
  }
  
  if (prefs.itemsPerPage < 5 || prefs.itemsPerPage > 100) {
    return false;
  }
  
  return true;
}

function updateUserPreferences(prefs: UserPreferences): void {
  if (!validatePreferences(prefs)) {
    throw new Error('Invalid preferences provided');
  }
  
  console.log('Preferences updated successfully:', prefs);
}