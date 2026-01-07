import { z } from "zod";

const UserPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    frequency: z.enum(["immediate", "daily", "weekly"]),
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "private", "friends"]),
    searchIndexing: z.boolean(),
  }),
  language: z.string().min(2).max(5),
});

type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export function validateUserPreferences(input: unknown): UserPreferences {
  try {
    return UserPreferencesSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join(".")}: ${err.message}`);
      throw new Error(`Invalid preferences: ${errorMessages.join(", ")}`);
    }
    throw new Error("Validation failed due to unexpected error");
  }
}

export function createDefaultPreferences(): UserPreferences {
  return {
    theme: "auto",
    notifications: {
      email: true,
      push: false,
      frequency: "daily",
    },
    privacy: {
      profileVisibility: "friends",
      searchIndexing: true,
    },
    language: "en",
  };
}