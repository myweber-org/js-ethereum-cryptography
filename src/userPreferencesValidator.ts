import { z } from "zod";

const ThemeSchema = z.enum(["light", "dark", "system"]);
const LanguageSchema = z.enum(["en", "es", "fr", "de"]);

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default("system"),
  language: LanguageSchema.default("en"),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  twoFactorEnabled: z.boolean().default(false),
  itemsPerPage: z.number().int().min(5).max(100).default(25),
  lastUpdated: z.date().optional()
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function isPreferencesValid(input: unknown): boolean {
  try {
    UserPreferencesSchema.parse(input);
    return true;
  } catch {
    return false;
  }
}import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    searchIndexing: z.boolean().default(true)
  })
}).refine(
  (data) => !(data.privacy.profileVisibility === 'private' && data.privacy.searchIndexing),
  {
    message: 'Private profiles cannot be indexed by search engines',
    path: ['privacy', 'searchIndexing']
  }
);

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('; ');
      throw new Error(`Invalid preferences: ${errorMessages}`);
    }
    throw error;
  }
}

export function createDefaultPreferences(): UserPreferences {
  return UserPreferencesSchema.parse({});
}