import { api } from './index';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  due_date_reminders: boolean;
  product_updates: boolean;
}

export const getSettings = async (): Promise<UserSettings> => {
  const response = await api.get<UserSettings>('/settings');
  return response.data;
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await api.patch<UserSettings>('/settings', settings);
  return response.data;
};
