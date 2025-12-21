import { z } from 'zod';

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}

export { userProfileSchema, validateUserProfile, safeValidateUserProfile };
export type { UserProfile };