import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean().default(true)
  }).default({ theme: 'system', notifications: true }),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(input: unknown): UserProfile | null {
  const result = UserProfileSchema.safeParse(input);
  if (!result.success) {
    console.error('Validation failed:', result.error.format());
    return null;
  }
  return result.data;
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return {
    id: crypto.randomUUID(),
    username,
    email,
    preferences: { theme: 'system', notifications: true },
    createdAt: new Date()
  };
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };