import apiClient from './axios';
import type { Task, SubTask } from '@/store/useTaskStore';

export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await apiClient.get('/tasks');
  return data;
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
  const { data } = await apiClient.post('/tasks', task);
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const { data } = await apiClient.put(`/tasks/${id}`, updates);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

// Sub-Tasks
export const createSubTask = async (taskId: string, title: string): Promise<SubTask> => {
  const { data } = await apiClient.post(`/tasks/${taskId}/subtasks`, { title });
  return data;
};

export const updateSubTask = async (id: string, updates: Partial<SubTask>): Promise<SubTask> => {
  const { data } = await apiClient.put(`/subtasks/${id}`, updates);
  return data;
};

export const deleteSubTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/subtasks/${id}`);
};
