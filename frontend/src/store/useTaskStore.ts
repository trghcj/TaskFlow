import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  created_at?: string;
  owner_id?: string;
}

interface UIState {
  isModalOpen: boolean;
  selectedTaskId: string | null;
  openModal: (taskId?: string | null) => void;
  closeModal: () => void;
}

export const useTaskStore = create<UIState>((set) => ({
  isModalOpen: false,
  selectedTaskId: null,
  openModal: (taskId = null) => set({ isModalOpen: true, selectedTaskId: taskId }),
  closeModal: () => set({ isModalOpen: false, selectedTaskId: null }),
}));
