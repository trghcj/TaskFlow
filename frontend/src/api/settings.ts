import apiClient from './axios';

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  due_date_reminders: boolean;
  product_updates: boolean;
  language: string;
  timezone: string;
}

export const getSettings = async (): Promise<UserSettings> => {
  const response = await apiClient.get<UserSettings>('/settings');
  return response.data;
};

export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await apiClient.patch<UserSettings>('/settings', settings);
  return response.data;
};
