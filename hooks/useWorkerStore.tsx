import { create } from 'zustand';
import { User, WorkerRegistrationData } from '@/types';
import { apiRequest } from '@/utils/api';
import { useAuthStore } from './useAuthStore';

interface WorkerState {
  workers: User[];
  isLoading: boolean;
  error: string | null;
  registerWorker: (data: WorkerRegistrationData) => Promise<boolean>;
  getWorkersByHR: (hrId: string) => Promise<User[]>;
  deleteWorker: (workerId: string) => void;
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  workers: [],
  isLoading: false,
  error: null,

  registerWorker: async (data: WorkerRegistrationData) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      await apiRequest('/users/add-worker', 'POST', data, token || undefined);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: 'Failed to register worker', isLoading: false });
      return false;
    }
  },

  getWorkersByHR: async (hrId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const { workers } = await apiRequest(`/users/list-workers?hrId=${hrId}`, 'GET', undefined, token || undefined);
      set({ workers, isLoading: false });
      return workers;
    } catch (error) {
      set({ error: 'Failed to fetch workers', isLoading: false });
      return [];
    }
  },

  deleteWorker: (workerId: string) => {
    set(state => ({
      workers: state.workers.filter(worker => worker.id !== workerId)
    }));
  },
}));