import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']),
    notifications: z.boolean().default(true),
  }).default({}),
  tags: z.array(z.string()).max(10),
});

type UserProfile = z.infer<typeof userProfileSchema>;

export function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

export function safeValidateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}import { z } from 'zod';

const userProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    notifications: z.boolean().default(true)
  }).default({}),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  return userProfileSchema.parse(data);
}

function safeValidateUserProfile(data: unknown) {
  const result = userProfileSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : null,
    errors: result.success ? null : result.error.format()
  };
}

export { userProfileSchema, validateUserProfile, safeValidateUserProfile };
export type { UserProfile };