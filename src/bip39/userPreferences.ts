interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  fontSize: number;
}

function validateUserPreferences(prefs: Partial<UserPreferences>): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (prefs.theme && !validThemes.includes(prefs.theme)) {
    return false;
  }
  
  if (prefs.fontSize && (prefs.fontSize < 12 || prefs.fontSize > 24)) {
    return false;
  }
  
  if (prefs.language && typeof prefs.language !== 'string') {
    return false;
  }
  
  if (prefs.notificationsEnabled && typeof prefs.notificationsEnabled !== 'boolean') {
    return false;
  }
  
  return true;
}

function applyUserPreferences(prefs: UserPreferences): void {
  if (!validateUserPreferences(prefs)) {
    throw new Error('Invalid user preferences');
  }
  
  console.log('Applying user preferences:', prefs);
  
  if (prefs.theme) {
    document.documentElement.setAttribute('data-theme', prefs.theme);
  }
  
  if (prefs.fontSize) {
    document.documentElement.style.fontSize = `${prefs.fontSize}px`;
  }
}

export { UserPreferences, validateUserPreferences, applyUserPreferences };