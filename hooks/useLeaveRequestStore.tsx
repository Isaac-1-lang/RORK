import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeaveRequest } from '@/types';
import { mockLeaveRequests } from '@/mocks/leave-requests';

interface LeaveRequestState {
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  fetchUserLeaveRequests: (userId: string) => Promise<LeaveRequest[]>;
  updateLeaveRequestStatus: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
}

export const useLeaveRequestStore = create<LeaveRequestState>()(
  persist(
    (set, get) => ({
      leaveRequests: mockLeaveRequests,
      isLoading: false,
      
      submitLeaveRequest: async (request) => {
        set({ isLoading: true });
        
        // Simulate API call
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            const newRequest: LeaveRequest = {
              ...request,
              id: Date.now().toString(),
              status: 'pending',
              createdAt: new Date().toISOString(),
            };
            
            set({ 
              leaveRequests: [...get().leaveRequests, newRequest],
              isLoading: false 
            });
            
            resolve();
          }, 1000);
        });
      },
      
      fetchUserLeaveRequests: async (userId) => {
        set({ isLoading: true });
        
        // Simulate API call
        return new Promise<LeaveRequest[]>((resolve) => {
          setTimeout(() => {
            const userRequests = get().leaveRequests.filter(
              request => request.userId === userId
            );
            
            set({ isLoading: false });
            resolve(userRequests);
          }, 500);
        });
      },
      
      updateLeaveRequestStatus: async (requestId, status) => {
        set({ isLoading: true });
        
        // Simulate API call
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            const updatedRequests = get().leaveRequests.map(request => {
              if (request.id === requestId) {
                return { ...request, status };
              }
              return request;
            });
            
            set({ leaveRequests: updatedRequests, isLoading: false });
            resolve();
          }, 1000);
        });
      },
    }),
    {
      name: 'leave-request-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);