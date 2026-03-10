import { z } from 'zod';

const preferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).default('friends'),
    dataSharing: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
}).refine((data) => {
  if (!data.notifications.email && !data.notifications.push) {
    return false;
  }
  return true;
}, {
  message: 'At least one notification method must be enabled',
  path: ['notifications']
});

export type UserPreferences = z.infer<typeof preferenceSchema>;

export function validatePreferences(input: unknown): UserPreferences {
  return preferenceSchema.parse(input);
}

export function getDefaultPreferences(): UserPreferences {
  return preferenceSchema.parse({});
}