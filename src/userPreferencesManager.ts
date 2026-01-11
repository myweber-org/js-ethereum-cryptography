typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    notificationsEnabled: boolean;
    language: string;
}

class UserPreferencesManager {
    private static readonly STORAGE_KEY = 'user_preferences';
    private preferences: UserPreferences;
    private listeners: Array<(prefs: UserPreferences) => void> = [];

    constructor(defaultPreferences: UserPreferences) {
        this.preferences = this.loadPreferences() || defaultPreferences;
    }

    private loadPreferences(): UserPreferences | null {
        try {
            const stored = localStorage.getItem(UserPreferencesManager.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    private savePreferences(): void {
        try {
            localStorage.setItem(
                UserPreferencesManager.STORAGE_KEY,
                JSON.stringify(this.preferences)
            );
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
        this.notifyListeners();
    }

    resetToDefaults(defaults: UserPreferences): void {
        this.preferences = { ...defaults };
        localStorage.removeItem(UserPreferencesManager.STORAGE_KEY);
        this.notifyListeners();
    }

    subscribe(listener: (prefs: UserPreferences) => void): () => void {
        this.listeners.push(listener);
        listener(this.preferences);
        
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.preferences));
    }
}

const defaultPreferences: UserPreferences = {
    theme: 'auto',
    fontSize: 16,
    notificationsEnabled: true,
    language: 'en-US'
};

export const userPrefsManager = new UserPreferencesManager(defaultPreferences);
```