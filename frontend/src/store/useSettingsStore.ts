import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  dueDateReminders: boolean;
  productUpdates: boolean;
  language: string;
  timezone: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setEmailNotifications: (enabled: boolean) => void;
  setDueDateReminders: (enabled: boolean) => void;
  setProductUpdates: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  setAllSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      emailNotifications: true,
      dueDateReminders: true,
      productUpdates: false,
      language: 'English (US)',
      timezone: 'Pacific Time (PT)',
      setTheme: (theme) => set({ theme }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setDueDateReminders: (dueDateReminders) => set({ dueDateReminders }),
      setProductUpdates: (productUpdates) => set({ productUpdates }),
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      setTimezone: (timezone) => set({ timezone }),
      setAllSettings: (settings) => {
        if (settings.language && settings.language !== get().language) {
           i18n.changeLanguage(settings.language);
        }
        set((state) => ({ ...state, ...settings }));
      },
    }),
    {
      name: 'taskflow-settings',
    }
  )
);
