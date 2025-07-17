import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';
import { apiRequest } from '@/utils/api';
import { useAuthStore } from './useAuthStore';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<Notification[]>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendNotification: (userId: string, title: string, message: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      
      fetchNotifications: async () => {
        set({ isLoading: true });
        const token = useAuthStore.getState().token;
        const { notifications } = await apiRequest('/notifications/list', 'GET', undefined, token || undefined);
        const unreadCount = notifications.filter((n: Notification) => !n.read).length;
        set({ notifications, unreadCount, isLoading: false });
        return notifications;
      },
      
      markAsRead: async (notificationId) => {
        const token = useAuthStore.getState().token;
        await apiRequest(`/notifications/mark-as-read/${notificationId}`, 'PATCH', {}, token || undefined);
        await get().fetchNotifications();
      },
      
      markAllAsRead: async () => {
        const token = useAuthStore.getState().token;
        await apiRequest('/notifications/mark-all-as-read', 'PATCH', {}, token || undefined);
        await get().fetchNotifications();
      },
      
      sendNotification: async (userId, title, message) => {
        const token = useAuthStore.getState().token;
        await apiRequest('/notifications/send', 'POST', { userId, title, message }, token || undefined);
        // Optionally refresh notifications for the recipient
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);