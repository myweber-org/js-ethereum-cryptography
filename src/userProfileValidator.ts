typescript
interface UserProfile {
    id: string;
    username: string;
    email: string;
    age?: number;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}

class UserProfileValidator {
    private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly MIN_AGE = 13;
    private static readonly MAX_AGE = 120;

    static validateProfile(profile: Partial<UserProfile>): string[] {
        const errors: string[] = [];

        if (profile.username !== undefined) {
            if (!this.USERNAME_REGEX.test(profile.username)) {
                errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
            }
        }

        if (profile.email !== undefined) {
            if (!this.EMAIL_REGEX.test(profile.email)) {
                errors.push('Invalid email format');
            }
        }

        if (profile.age !== undefined) {
            if (!Number.isInteger(profile.age) || profile.age < this.MIN_AGE || profile.age > this.MAX_AGE) {
                errors.push(`Age must be an integer between ${this.MIN_AGE} and ${this.MAX_AGE}`);
            }
        }

        if (profile.preferences !== undefined) {
            if (!['light', 'dark'].includes(profile.preferences.theme)) {
                errors.push('Theme must be either "light" or "dark"');
            }
        }

        return errors;
    }

    static validateForUpdate(profile: Partial<UserProfile>): { isValid: boolean; errors: string[] } {
        const errors = this.validateProfile(profile);
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export { UserProfile, UserProfileValidator };
```