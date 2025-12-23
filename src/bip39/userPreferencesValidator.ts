
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: Partial<UserPreferences>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (prefs.theme !== undefined && !['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme: ${prefs.theme}. Must be 'light', 'dark', or 'auto'.`);
    }

    if (prefs.language !== undefined && !PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}. Supported: ${PreferenceValidator.SUPPORTED_LANGUAGES.join(', ')}`);
    }

    if (prefs.itemsPerPage !== undefined) {
      if (!Number.isInteger(prefs.itemsPerPage)) {
        errors.push('Items per page must be an integer.');
      } else if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
        errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getDefaultPreferences(): UserPreferences {
    return {
      theme: 'auto',
      notifications: true,
      language: 'en',
      itemsPerPage: 20
    };
  }
}

function mergePreferences(existing: UserPreferences, updates: Partial<UserPreferences>): UserPreferences {
  const validation = PreferenceValidator.validate(updates);
  if (!validation.isValid) {
    throw new Error(`Invalid preferences: ${validation.errors.join(' ')}`);
  }
  
  return { ...existing, ...updates };
}

export { UserPreferences, PreferenceValidator, mergePreferences };
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

class PreferenceValidator {
  private static readonly SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de'];
  private static readonly MIN_ITEMS_PER_PAGE = 5;
  private static readonly MAX_ITEMS_PER_PAGE = 100;

  static validate(prefs: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      errors.push(`Invalid theme selection: ${prefs.theme}`);
    }

    if (typeof prefs.notifications !== 'boolean') {
      errors.push('Notifications must be a boolean value');
    }

    if (!PreferenceValidator.SUPPORTED_LANGUAGES.includes(prefs.language)) {
      errors.push(`Unsupported language: ${prefs.language}`);
    }

    if (prefs.itemsPerPage < PreferenceValidator.MIN_ITEMS_PER_PAGE || 
        prefs.itemsPerPage > PreferenceValidator.MAX_ITEMS_PER_PAGE) {
      errors.push(`Items per page must be between ${PreferenceValidator.MIN_ITEMS_PER_PAGE} and ${PreferenceValidator.MAX_ITEMS_PER_PAGE}`);
    }

    return errors;
  }

  static validateAndThrow(prefs: UserPreferences): void {
    const errors = this.validate(prefs);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`);
    }
  }
}

export { UserPreferences, PreferenceValidator };interface UserPreferences {
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

const validateUserPreferences = (prefs: UserPreferences): void => {
  const errors: string[] = [];

  if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
    errors.push('Theme must be light, dark, or auto');
  }

  if (typeof prefs.notifications !== 'boolean') {
    errors.push('Notifications must be a boolean value');
  }

  if (!prefs.language || prefs.language.trim().length === 0) {
    errors.push('Language cannot be empty');
  }

  if (prefs.fontSize < 12 || prefs.fontSize > 24) {
    errors.push('Font size must be between 12 and 24');
  }

  if (errors.length > 0) {
    throw new PreferenceValidationError(`Validation failed: ${errors.join('; ')}`);
  }
};

const examplePreferences: UserPreferences = {
  theme: 'dark',
  notifications: true,
  language: 'en-US',
  fontSize: 16
};

try {
  validateUserPreferences(examplePreferences);
  console.log('Preferences are valid');
} catch (error) {
  if (error instanceof PreferenceValidationError) {
    console.error('Invalid preferences:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  resultsPerPage: number;
}

class PreferenceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreferenceValidationError';
  }
}

const validateUserPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'auto',
    notifications: true,
    language: 'en',
    resultsPerPage: 20
  };

  const validated: UserPreferences = { ...defaultPreferences };

  if (prefs.theme !== undefined) {
    if (!['light', 'dark', 'auto'].includes(prefs.theme)) {
      throw new PreferenceValidationError(`Invalid theme: ${prefs.theme}`);
    }
    validated.theme = prefs.theme;
  }

  if (prefs.notifications !== undefined) {
    if (typeof prefs.notifications !== 'boolean') {
      throw new PreferenceValidationError('Notifications must be boolean');
    }
    validated.notifications = prefs.notifications;
  }

  if (prefs.language !== undefined) {
    if (typeof prefs.language !== 'string' || prefs.language.length !== 2) {
      throw new PreferenceValidationError('Language must be 2-letter code');
    }
    validated.language = prefs.language.toLowerCase();
  }

  if (prefs.resultsPerPage !== undefined) {
    if (!Number.isInteger(prefs.resultsPerPage) || prefs.resultsPerPage < 5 || prefs.resultsPerPage > 100) {
      throw new PreferenceValidationError('Results per page must be integer between 5 and 100');
    }
    validated.resultsPerPage = prefs.resultsPerPage;
  }

  return validated;
};

export { UserPreferences, PreferenceValidationError, validateUserPreferences };