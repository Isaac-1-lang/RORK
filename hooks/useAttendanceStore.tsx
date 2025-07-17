import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Attendance } from '@/types';
import { useLocationStore } from './useLocationStore';
import { apiRequest } from '@/utils/api';
import { useAuthStore } from './useAuthStore';

interface AttendanceState {
  attendanceRecords: Attendance[];
  todayRecord: Attendance | null;
  isLoading: boolean;
  error: string | null;
  fetchTodayAttendance: () => Promise<void>;
  fetchAttendanceHistory: () => Promise<void>;
  clockIn: () => Promise<void>;
  clockOut: () => Promise<void>;
  getStats: (department?: string) => Promise<any>;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      attendanceRecords: [],
      todayRecord: null,
      isLoading: false,
      error: null,

      fetchTodayAttendance: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          const { attendance } = await apiRequest('/attendance/history', 'GET', undefined, token || undefined);
          const today = new Date().toISOString().split('T')[0];
          const todayRecord = attendance.find((record: Attendance) => record.date.split('T')[0] === today);
          set({ todayRecord: todayRecord || null, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch today attendance', isLoading: false });
        }
      },

      fetchAttendanceHistory: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          const { attendance } = await apiRequest('/attendance/history', 'GET', undefined, token || undefined);
          set({ attendanceRecords: attendance, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch attendance history', isLoading: false });
        }
      },

      clockIn: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          const { currentLocation } = useLocationStore.getState();
          await apiRequest('/attendance/check-in', 'POST', { location: currentLocation }, token || undefined);
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to clock in', isLoading: false });
          throw error;
        }
      },

      clockOut: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          await apiRequest('/attendance/check-out', 'POST', {}, token || undefined);
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to clock out', isLoading: false });
          throw error;
        }
      },

      getStats: async (department?: string) => {
        set({ isLoading: true, error: null });
        try {
          const token = useAuthStore.getState().token;
          const url = department ? `/attendance/stats?department=${department}` : '/attendance/stats';
          const { stats } = await apiRequest(url, 'GET', undefined, token || undefined);
          set({ isLoading: false });
          return stats;
        } catch (error) {
          set({ error: 'Failed to fetch stats', isLoading: false });
          return null;
        }
      },
    }),
    {
      name: 'attendance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        attendanceRecords: state.attendanceRecords,
        todayRecord: state.todayRecord
      }),
    }
  )
);