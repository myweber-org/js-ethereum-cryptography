typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notificationsEnabled: boolean;
    fontSize: number;
    autoSaveInterval: number;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private static readonly DEFAULT_PREFERENCES: UserPreferences = {
        theme: 'auto',
        language: 'en',
        notificationsEnabled: true,
        fontSize: 14,
        autoSaveInterval: 30000
    };

    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMerge(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...UserPreferencesManager.DEFAULT_PREFERENCES };
    }

    private validateAndMerge(partial: Partial<UserPreferences>): UserPreferences {
        const merged = { ...UserPreferencesManager.DEFAULT_PREFERENCES, ...partial };
        
        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = 'auto';
        }
        
        if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
            merged.fontSize = 14;
        }
        
        if (typeof merged.autoSaveInterval !== 'number' || merged.autoSaveInterval < 1000 || merged.autoSaveInterval > 300000) {
            merged.autoSaveInterval = 30000;
        }
        
        return merged;
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = this.validateAndMerge({ ...this.preferences, ...updates });
        this.savePreferences();
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): void {
        this.preferences = { ...UserPreferencesManager.DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(UserPreferencesManager.STORAGE_KEY, JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    exportPreferences(): string {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString: string): boolean {
        try {
            const parsed = JSON.parse(jsonString);
            this.updatePreferences(parsed);
            return true;
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }
}

const preferencesManager = new UserPreferencesManager();
export default preferencesManager;
```