import { z } from 'zod';

const userProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().default(() => new Date()),
});

type UserProfile = z.infer<typeof userProfileSchema>;

function validateUserProfile(input: unknown): UserProfile {
  try {
    return userProfileSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}

function createDefaultProfile(username: string, email: string): UserProfile {
  return userProfileSchema.parse({
    username,
    email,
  });
}

export { userProfileSchema, validateUserProfile, createDefaultProfile, type UserProfile };