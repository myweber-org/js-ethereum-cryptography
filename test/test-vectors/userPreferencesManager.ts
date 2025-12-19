typescript
interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    fontSize: number;
    autoSave: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'auto',
    language: 'en-US',
    notifications: true,
    fontSize: 14,
    autoSave: true
};

const VALID_LANGUAGES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'];

class UserPreferencesManager {
    private preferences: UserPreferences;

    constructor() {
        this.preferences = this.loadPreferences();
    }

    private loadPreferences(): UserPreferences {
        try {
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.validateAndMerge(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences from storage:', error);
        }
        return { ...DEFAULT_PREFERENCES };
    }

    private validateAndMerge(partialPrefs: Partial<UserPreferences>): UserPreferences {
        const merged = { ...DEFAULT_PREFERENCES, ...partialPrefs };
        
        if (!['light', 'dark', 'auto'].includes(merged.theme)) {
            merged.theme = DEFAULT_PREFERENCES.theme;
        }
        
        if (!VALID_LANGUAGES.includes(merged.language)) {
            merged.language = DEFAULT_PREFERENCES.language;
        }
        
        if (typeof merged.notifications !== 'boolean') {
            merged.notifications = DEFAULT_PREFERENCES.notifications;
        }
        
        if (typeof merged.fontSize !== 'number' || merged.fontSize < 8 || merged.fontSize > 32) {
            merged.fontSize = DEFAULT_PREFERENCES.fontSize;
        }
        
        if (typeof merged.autoSave !== 'boolean') {
            merged.autoSave = DEFAULT_PREFERENCES.autoSave;
        }
        
        return merged;
    }

    savePreferences(newPreferences: Partial<UserPreferences>): boolean {
        try {
            this.preferences = this.validateAndMerge(newPreferences);
            localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
            this.applyPreferences();
            return true;
        } catch (error) {
            console.error('Failed to save preferences:', error);
            return false;
        }
    }

    getPreferences(): Readonly<UserPreferences> {
        return { ...this.preferences };
    }

    resetToDefaults(): boolean {
        return this.savePreferences(DEFAULT_PREFERENCES);
    }

    private applyPreferences(): void {
        const { theme, fontSize } = this.preferences;
        
        document.documentElement.setAttribute('data-theme', theme === 'auto' ? 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
            theme
        );
        
        document.documentElement.style.fontSize = `${fontSize}px`;
        
        this.dispatchChangeEvent();
    }

    private dispatchChangeEvent(): void {
        window.dispatchEvent(new CustomEvent('preferencesChanged', {
            detail: { preferences: this.getPreferences() }
        }));
    }

    isLanguageSupported(language: string): boolean {
        return VALID_LANGUAGES.includes(language);
    }

    getSupportedLanguages(): ReadonlyArray<string> {
        return [...VALID_LANGUAGES];
    }
}

export const preferencesManager = new UserPreferencesManager();
```