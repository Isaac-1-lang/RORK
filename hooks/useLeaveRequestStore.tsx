import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeaveRequest } from '@/types';
import { apiRequest } from '@/utils/api';
import { useAuthStore } from './useAuthStore';

interface LeaveRequestState {
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  fetchUserLeaveRequests: () => Promise<LeaveRequest[]>;
  updateLeaveRequestStatus: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
}

export const useLeaveRequestStore = create<LeaveRequestState>()(
  persist(
    (set, get) => ({
      leaveRequests: [],
      isLoading: false,
      
      submitLeaveRequest: async (request) => {
        set({ isLoading: true });
        const token = useAuthStore.getState().token;
        await apiRequest('/leave-requests/submit', 'POST', request, token || undefined);
        set({ isLoading: false });
      },
      
      fetchUserLeaveRequests: async () => {
        set({ isLoading: true });
        const token = useAuthStore.getState().token;
        const { leaveRequests } = await apiRequest('/leave-requests/list', 'GET', undefined, token || undefined);
        set({ leaveRequests, isLoading: false });
        return leaveRequests;
      },
      
      updateLeaveRequestStatus: async (requestId, status) => {
        set({ isLoading: true });
        const token = useAuthStore.getState().token;
        await apiRequest(`/leave-requests/update-status/${requestId}`, 'PATCH', { status }, token || undefined);
        set({ isLoading: false });
      },
    }),
    {
      name: 'leave-request-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);