import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Attendance } from '@/types';
import { mockAttendance } from '@/mocks/attendance';
import { useLocationStore } from './useLocationStore';

interface AttendanceState {
  attendanceRecords: Attendance[];
  todayRecord: Attendance | null;
  isLoading: boolean;
  error: string | null;
  fetchTodayAttendance: (userId: string) => Promise<void>;
  fetchAttendanceHistory: (userId: string) => Promise<void>;
  clockIn: (userId: string) => Promise<void>;
  clockOut: (userId: string) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      attendanceRecords: [],
      todayRecord: null,
      isLoading: false,
      error: null,

      fetchTodayAttendance: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const today = new Date().toISOString().split('T')[0];
          const todayRecord = mockAttendance.find(
            record => record.userId === userId && record.date === today
          );
          
          set({ todayRecord: todayRecord || null, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch today attendance', isLoading: false });
        }
      },

      fetchAttendanceHistory: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const userRecords = mockAttendance.filter(record => record.userId === userId);
          set({ attendanceRecords: userRecords, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch attendance history', isLoading: false });
        }
      },

      clockIn: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current location
          const { currentLocation } = useLocationStore.getState();
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
          
          // Determine if late (assuming work starts at 9:00 AM)
          const workStartTime = '09:00';
          const isLate = currentTime > workStartTime;
          
          const newRecord: Attendance = {
            id: `attendance_${Date.now()}`,
            userId,
            date: today,
            clockInTime: currentTime,
            location: currentLocation || undefined,
            status: isLate ? 'late' : 'on-time',
          };
          
          // Update mock data and state
          const updatedRecords = [...mockAttendance.filter(r => !(r.userId === userId && r.date === today)), newRecord];
          set({ 
            attendanceRecords: updatedRecords,
            todayRecord: newRecord,
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to clock in', isLoading: false });
          throw error;
        }
      },

      clockOut: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { todayRecord } = get();
          if (!todayRecord) {
            throw new Error('No clock-in record found for today');
          }
          
          const now = new Date();
          const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
          
          // Calculate total hours
          const clockInTime = new Date(`2000-01-01T${todayRecord.clockInTime}`);
          const clockOutTime = new Date(`2000-01-01T${currentTime}`);
          const totalHours = Math.round((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60) * 100) / 100;
          
          const updatedRecord: Attendance = {
            ...todayRecord,
            clockOutTime: currentTime,
            totalHours,
          };
          
          // Update mock data and state
          const updatedRecords = mockAttendance.map(record => 
            record.id === todayRecord.id ? updatedRecord : record
          );
          
          set({ 
            attendanceRecords: updatedRecords,
            todayRecord: updatedRecord,
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to clock out', isLoading: false });
          throw error;
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