import { z } from 'zod';

const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.boolean()
  }).default({
    theme: 'system',
    notifications: true
  }),
  createdAt: z.date().default(() => new Date())
});

type UserProfile = z.infer<typeof UserProfileSchema>;

function validateUserProfile(data: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed:', error.errors);
    }
    throw new Error('Invalid user profile data');
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return UserProfileSchema.parse({
    username,
    email
  });
}

export { UserProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };