import apiClient from './axios';
import type { SubTask } from '@/store/useTaskStore';

export interface AIParsedTask {
  title: string;
  due_date: string | null;
  due_time: string | null;
  priority: 'low' | 'medium' | 'high';
}

export const parseTaskAI = async (text: string): Promise<AIParsedTask> => {
  const { data } = await apiClient.post('/api/ai/parse', { text });
  return data;
};

export const breakdownTaskAI = async (title: string, description?: string, taskId?: string): Promise<SubTask[]> => {
  const { data } = await apiClient.post('/api/ai/breakdown', { title, description, task_id: taskId });
  return data;
};
