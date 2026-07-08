import apiClient from './axios';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const response = await apiClient.put(`/notifications/${id}/read`);
  return response.data;
};
