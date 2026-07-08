import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  dueDateReminders: boolean;
  productUpdates: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setEmailNotifications: (enabled: boolean) => void;
  setDueDateReminders: (enabled: boolean) => void;
  setProductUpdates: (enabled: boolean) => void;
  setAllSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      emailNotifications: true,
      dueDateReminders: true,
      productUpdates: false,
      setTheme: (theme) => set({ theme }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setDueDateReminders: (dueDateReminders) => set({ dueDateReminders }),
      setProductUpdates: (productUpdates) => set({ productUpdates }),
      setAllSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'taskflow-settings',
    }
  )
);
