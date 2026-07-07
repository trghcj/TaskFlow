import { create } from 'zustand';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  isModalOpen: boolean;
  selectedTaskId: string | null;
  openModal: (taskId?: string | null) => void;
  closeModal: () => void;
}

const DUMMY_TASKS: Task[] = [
  { id: '1', title: 'Design Landing Page', status: 'completed', priority: 'high', dueDate: '2026-07-06' },
  { id: '2', title: 'Setup Firebase Auth', status: 'completed', priority: 'high', dueDate: '2026-07-07' },
  { id: '3', title: 'Build Kanban Board', status: 'in-progress', priority: 'high', dueDate: '2026-07-08' },
  { id: '4', title: 'Write unit tests for UI', status: 'todo', priority: 'medium', dueDate: '2026-07-10' },
  { id: '5', title: 'Review PRs', status: 'review', priority: 'low' },
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: DUMMY_TASKS,
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  moveTask: (id, newStatus) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
  })),
  isModalOpen: false,
  selectedTaskId: null,
  openModal: (taskId = null) => set({ isModalOpen: true, selectedTaskId: taskId }),
  closeModal: () => set({ isModalOpen: false, selectedTaskId: null }),
}));
