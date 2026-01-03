interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'PreferenceError';
  }
}

function validateUserPreferences(prefs: UserPreferences): void {
  const validThemes = ['light', 'dark', 'auto'];
  
  if (!validThemes.includes(prefs.theme)) {
    throw new PreferenceError(
      `Theme must be one of: ${validThemes.join(', ')}`,
      'theme'
    );
  }

  if (typeof prefs.notifications !== 'boolean') {
    throw new PreferenceError('Notifications must be a boolean value', 'notifications');
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    throw new PreferenceError('Language cannot be empty', 'language');
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    throw new PreferenceError('Font size must be between 12 and 24', 'fontSize');
  }
}

function updateUserPreferences(prefs: UserPreferences): { success: boolean; error?: string } {
  try {
    validateUserPreferences(prefs);
    
    // Simulate saving to database
    console.log('Saving preferences:', prefs);
    
    return { success: true };
  } catch (error) {
    if (error instanceof PreferenceError) {
      return { 
        success: false, 
        error: `Validation failed for ${error.field}: ${error.message}`
      };
    }
    
    return { 
      success: false, 
      error: 'Unknown validation error occurred'
    };
  }
}

export { UserPreferences, validateUserPreferences, updateUserPreferences, PreferenceError };