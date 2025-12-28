interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    searchable: boolean;
  };
}

function validateUserPreferences(prefs: any): prefs is UserPreferences {
  const validThemes = ['light', 'dark', 'system'];
  const validFrequencies = ['instant', 'daily', 'weekly'];
  const validVisibilities = ['public', 'private', 'friends'];

  return (
    typeof prefs === 'object' &&
    prefs !== null &&
    validThemes.includes(prefs.theme) &&
    typeof prefs.notifications === 'object' &&
    typeof prefs.notifications.email === 'boolean' &&
    typeof prefs.notifications.push === 'boolean' &&
    validFrequencies.includes(prefs.notifications.frequency) &&
    typeof prefs.privacy === 'object' &&
    validVisibilities.includes(prefs.privacy.profileVisibility) &&
    typeof prefs.privacy.searchable === 'boolean'
  );
}

function saveUserPreferences(prefs: UserPreferences): void {
  if (!validateUserPreferences(prefs)) {
    throw new Error('Invalid user preferences structure');
  }
  
  const serialized = JSON.stringify(prefs);
  localStorage.setItem('userPreferences', serialized);
}

function loadUserPreferences(): UserPreferences | null {
  const stored = localStorage.getItem('userPreferences');
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return validateUserPreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'system',
    notifications: {
      email: true,
      push: false,
      frequency: 'daily'
    },
    privacy: {
      profileVisibility: 'public',
      searchable: true
    }
  };
}