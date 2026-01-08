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
}