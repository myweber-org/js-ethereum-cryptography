import { z } from 'zod';

const ThemeSchema = z.enum(['light', 'dark', 'auto']);
const NotificationPreferenceSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  frequency: z.enum(['instant', 'daily', 'weekly']).default('daily')
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  theme: ThemeSchema.default('auto'),
  notifications: NotificationPreferenceSchema.default({
    email: true,
    push: false,
    frequency: 'daily'
  }),
  language: z.string().min(2).max(5).default('en'),
  timezone: z.string().optional(),
  createdAt: z.date().default(() => new Date())
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  return UserPreferencesSchema.parse(input);
}

export function safeValidateUserPreferences(input: unknown) {
  return UserPreferencesSchema.safeParse(input);
}