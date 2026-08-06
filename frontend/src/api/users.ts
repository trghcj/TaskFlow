import apiClient from './axios';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  current_streak: number;
  last_completed_date?: string;
  created_at: string;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get('/users/me');
  return data;
};
