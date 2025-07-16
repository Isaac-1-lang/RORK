import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Department Meeting',
    message: 'Meeting time to meetim tuesday',
    createdAt: '2025-06-18T09:30:00Z',
    read: false,
  },
  {
    id: '2',
    title: 'New Policy Update',
    message: 'Changes to youet Liper work.',
    createdAt: '2025-06-19T14:15:00Z',
    read: false,
  },
  {
    id: '3',
    title: 'Department Meeting',
    message: 'Change work may shat changes',
    createdAt: '2025-06-17T11:45:00Z',
    read: true,
  },
  {
    id: '4',
    title: 'Reminder to Clock In',
    message: 'Please remember to clock in when you arrive at work.',
    createdAt: '2025-06-20T07:30:00Z',
    read: false,
  },
  {
    id: '5',
    title: 'NewFront Desk Schedule',
    message: 'Starting next week, your scheduled hours at the front desk will begin at 9:00 AM.',
    createdAt: '2025-06-16T15:20:00Z',
    read: true,
  },
];