typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    notificationsEnabled: boolean;
    language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    fontSize: 16,
    notificationsEnabled: true,
    language: 'en-US'
};

class UserPreferencesManager {
    private preferences: UserPreferences;
    private subscribers: Set<(prefs: UserPreferences) => void>;

    constructor() {
        this.preferences = this.loadPreferences();
        this.subscribers = new Set();
    }

    private loadPreferences(): UserPreferences {
        const stored = localStorage.getItem('userPreferences');
        if (!stored) return { ...DEFAULT_PREFERENCES };

        try {
            const parsed = JSON.parse(stored);
            return { ...DEFAULT_PREFERENCES, ...parsed };
        } catch {
            return { ...DEFAULT_PREFERENCES };
        }
    }

    private savePreferences(): void {
        localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
        this.notifySubscribers();
    }

    getPreferences(): UserPreferences {
        return { ...this.preferences };
    }

    updatePreferences(updates: Partial<UserPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.savePreferences();
    }

    resetToDefaults(): void {
        this.preferences = { ...DEFAULT_PREFERENCES };
        this.savePreferences();
    }

    subscribe(callback: (prefs: UserPreferences) => void): () => void {
        this.subscribers.add(callback);
        callback(this.preferences);
        
        return () => {
            this.subscribers.delete(callback);
        };
    }

    private notifySubscribers(): void {
        const currentPrefs = this.getPreferences();
        this.subscribers.forEach(callback => callback(currentPrefs));
    }
}

export const userPreferences = new UserPreferencesManager();
```