import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface Attachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  due_time?: string;
  reminder_offset?: number;
  created_at?: string;
  owner_id?: string;
  subtasks?: SubTask[];
  attachments?: Attachment[];
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
