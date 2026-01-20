import { z } from 'zod';

const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    frequency: z.enum(['immediate', 'daily', 'weekly']).default('daily')
  }),
  privacy: z.object({
    profileVisible: z.boolean().default(true),
    searchIndexed: z.boolean().default(false)
  }),
  language: z.string().min(2).max(5).default('en')
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export class PreferencesManager {
  private preferences: UserPreferences;

  constructor(initialData?: Partial<UserPreferences>) {
    const parsed = UserPreferencesSchema.safeParse(initialData || {});
    
    if (!parsed.success) {
      console.warn('Invalid preferences provided, using defaults:', parsed.error.errors);
      this.preferences = UserPreferencesSchema.parse({});
    } else {
      this.preferences = parsed.data;
    }
  }

  updatePreferences(updates: Partial<UserPreferences>): boolean {
    const merged = { ...this.preferences, ...updates };
    const parsed = UserPreferencesSchema.safeParse(merged);
    
    if (parsed.success) {
      this.preferences = parsed.data;
      return true;
    }
    
    console.error('Invalid preference update:', parsed.error.errors);
    return false;
  }

  getPreferences(): Readonly<UserPreferences> {
    return Object.freeze({ ...this.preferences });
  }

  validateExternalInput(input: unknown): UserPreferences | null {
    const result = UserPreferencesSchema.safeParse(input);
    return result.success ? result.data : null;
  }
}