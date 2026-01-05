import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  }).default({}),
  language: z.string().min(2).max(5).default('en')
}).refine((data) => {
  return !(data.privacy.profileVisibility === 'public' && data.privacy.searchIndexing === false);
}, {
  message: 'Public profiles must be searchable',
  path: ['privacy.searchIndexing']
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}
interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications: true,
  language: 'en-US',
  itemsPerPage: 10
};

const VALID_LANGUAGES = new Set(['en-US', 'es-ES', 'fr-FR', 'de-DE']);
const MIN_ITEMS_PER_PAGE = 5;
const MAX_ITEMS_PER_PAGE = 100;

function validateUserPreferences(input: unknown): UserPreferences {
  if (!input || typeof input !== 'object') {
    return DEFAULT_PREFERENCES;
  }

  const partial = input as Partial<UserPreferences>;
  const result: UserPreferences = { ...DEFAULT_PREFERENCES };

  if (partial.theme && ['light', 'dark', 'auto'].includes(partial.theme)) {
    result.theme = partial.theme;
  }

  if (typeof partial.notifications === 'boolean') {
    result.notifications = partial.notifications;
  }

  if (typeof partial.language === 'string' && VALID_LANGUAGES.has(partial.language)) {
    result.language = partial.language;
  }

  if (typeof partial.itemsPerPage === 'number') {
    result.itemsPerPage = Math.max(
      MIN_ITEMS_PER_PAGE,
      Math.min(MAX_ITEMS_PER_PAGE, partial.itemsPerPage)
    );
  }

  return result;
}

function mergePreferences(
  existing: UserPreferences,
  updates: Partial<UserPreferences>
): UserPreferences {
  const validatedUpdates = validateUserPreferences(updates);
  return { ...existing, ...validatedUpdates };
}

export { UserPreferences, validateUserPreferences, mergePreferences, DEFAULT_PREFERENCES };