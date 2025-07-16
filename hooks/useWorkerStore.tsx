import { create } from 'zustand';
import { User, WorkerRegistrationData } from '@/types';

interface WorkerState {
  workers: User[];
  isLoading: boolean;
  error: string | null;
  registerWorker: (data: WorkerRegistrationData, hrId: string) => Promise<boolean>;
  getWorkersByHR: (hrId: string) => User[];
  deleteWorker: (workerId: string) => void;
}

export const useWorkerStore = create<WorkerState>((set, get) => ({
  workers: [],
  isLoading: false,
  error: null,

  registerWorker: async (data: WorkerRegistrationData, hrId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate unique ID
      const workerId = `worker_${Date.now()}`;
      
      // Create new worker
      const newWorker: User = {
        id: workerId,
        name: data.name,
        email: data.email || '',
        role: 'worker',
        department: data.department,
        position: data.position,
        phoneNumber: data.phoneNumber,
        shiftStartTime: data.shiftStartTime,
        createdBy: hrId,
        geoLocation: data.geoLocation,
        fingerprintCaptured: data.fingerprintCaptured,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      // Add to workers list
      set(state => ({
        workers: [...state.workers, newWorker],
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ 
        error: 'Failed to register worker',
        isLoading: false 
      });
      return false;
    }
  },

  getWorkersByHR: (hrId: string) => {
    const { workers } = get();
    return workers.filter(worker => worker.createdBy === hrId);
  },

  deleteWorker: (workerId: string) => {
    set(state => ({
      workers: state.workers.filter(worker => worker.id !== workerId)
    }));
  },
}));