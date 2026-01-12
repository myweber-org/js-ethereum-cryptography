import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'system']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['instant', 'daily', 'weekly']).optional(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('system'),
  language: z.string().min(2).max(10).default('en'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
  }),
  createdAt: z.date().default(() => new Date()),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function sanitizePreferences(input: Partial<UserPreferences>): Partial<UserPreferences> {
  const result: Partial<UserPreferences> = {};
  
  if (input.theme && ThemeSchema.safeParse(input.theme).success) {
    result.theme = input.theme;
  }
  
  if (input.language && typeof input.language === 'string') {
    const trimmed = input.language.trim().substring(0, 10);
    if (trimmed.length >= 2) {
      result.language = trimmed;
    }
  }
  
  return result;
}