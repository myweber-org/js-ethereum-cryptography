import { z } from 'zod';

const PreferenceSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    frequency: z.enum(['instant', 'daily', 'weekly']).optional()
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    dataSharing: z.boolean().default(false)
  }).optional()
});

export type UserPreferences = z.infer<typeof PreferenceSchema>;

export class PreferenceValidator {
  static validate(input: unknown): UserPreferences {
    try {
      return PreferenceSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }));
        throw new PreferenceValidationError('Invalid preferences format', issues);
      }
      throw error;
    }
  }

  static validatePartial(updates: Partial<unknown>): Partial<UserPreferences> {
    return PreferenceSchema.partial().parse(updates);
  }
}

export class PreferenceValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.name = 'PreferenceValidationError';
  }

  formatIssues(): string {
    return this.issues
      .map(issue => `• ${issue.path}: ${issue.message}`)
      .join('\n');
  }
}

export function sanitizePreferences(prefs: UserPreferences): UserPreferences {
  return {
    ...prefs,
    privacy: {
      profileVisibility: prefs.privacy?.profileVisibility || 'private',
      dataSharing: prefs.privacy?.dataSharing || false
    }
  };
}