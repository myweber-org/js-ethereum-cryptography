import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).default('friends'),
    searchable: z.boolean().default(true)
  }),
  language: z.string().default('en-US'),
  timezone: z.string().default('UTC')
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const DEFAULT_PREFERENCES: UserPreferences = UserPreferencesSchema.parse({});

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function mergePreferences(
  current: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const merged = { ...current, ...updates };
  return validatePreferences(merged);
}

export function isPreferencesValid(prefs: unknown): prefs is UserPreferences {
  return UserPreferencesSchema.safeParse(prefs).success;
}interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

function validateUserPreferences(prefs: UserPreferences): boolean {
  const validThemes = ['light', 'dark', 'auto'];
  const validLanguages = ['en', 'es', 'fr', 'de'];
  const timezoneRegex = /^[A-Za-z_]+\/[A-Za-z_]+$/;

  if (!validThemes.includes(prefs.theme)) {
    return false;
  }

  if (typeof prefs.notifications !== 'boolean') {
    return false;
  }

  if (!validLanguages.includes(prefs.language)) {
    return false;
  }

  if (!timezoneRegex.test(prefs.timezone)) {
    return false;
  }

  return true;
}

function updateUserPreferences(prefs: UserPreferences): void {
  if (validateUserPreferences(prefs)) {
    console.log('Preferences updated successfully');
  } else {
    console.error('Invalid preferences provided');
  }
}