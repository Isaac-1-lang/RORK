import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';
import { mockNotifications } from '@/mocks/notifications';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<Notification[]>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter(n => !n.read).length,
      isLoading: false,
      
      fetchNotifications: async () => {
        set({ isLoading: true });
        
        // Simulate API call
        return new Promise<Notification[]>((resolve) => {
          setTimeout(() => {
            const notifications = get().notifications;
            const unreadCount = notifications.filter(n => !n.read).length;
            
            set({ isLoading: false, unreadCount });
            resolve(notifications);
          }, 500);
        });
      },
      
      markAsRead: (notificationId) => {
        const updatedNotifications = get().notifications.map(notification => {
          if (notification.id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        });
        
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        set({ notifications: updatedNotifications, unreadCount });
      },
      
      markAllAsRead: () => {
        const updatedNotifications = get().notifications.map(notification => ({
          ...notification,
          read: true,
        }));
        
        set({ notifications: updatedNotifications, unreadCount: 0 });
      },
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          read: false,
        };
        
        const updatedNotifications = [newNotification, ...get().notifications];
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        set({ 
          notifications: updatedNotifications,
          unreadCount,
        });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);