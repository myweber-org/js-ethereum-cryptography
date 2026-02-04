
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  fontSize: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

function validateUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const defaults: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    fontSize: 14
  };

  const validated: UserPreferences = { ...defaults, ...prefs };

  if (!['light', 'dark', 'auto'].includes(validated.theme)) {
    throw new PreferenceValidationError(`Invalid theme: ${validated.theme}`);
  }

  if (typeof validated.notifications !== 'boolean') {
    throw new PreferenceValidationError('Notifications must be boolean');
  }

  if (!validated.language || validated.language.trim().length === 0) {
    throw new PreferenceValidationError('Language cannot be empty');
  }

  if (validated.fontSize < 8 || validated.fontSize > 72) {
    throw new PreferenceValidationError(`Font size ${validated.fontSize} out of range (8-72)`);
  }

  if (!Number.isInteger(validated.fontSize)) {
    throw new PreferenceValidationError('Font size must be integer');
  }

  return validated;
}

function formatValidationResult(prefs: Partial<UserPreferences>): string {
  try {
    const validated = validateUserPreferences(prefs);
    return `Valid preferences: ${JSON.stringify(validated)}`;
  } catch (error) {
    if (error instanceof PreferenceValidationError) {
      return `Validation failed: ${error.message}`;
    }
    return `Unexpected error: ${error}`;
  }
}

export { validateUserPreferences, formatValidationResult, PreferenceValidationError };
export type { UserPreferences };