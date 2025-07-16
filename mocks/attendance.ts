import { Attendance } from '@/types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    userId: '1',
    date: today.toISOString().split('T')[0],
    clockInTime: '08:30',
    clockOutTime: '',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    status: 'on-time',
    totalHours: 0,
  },
  {
    id: '2',
    userId: '1',
    date: yesterday.toISOString().split('T')[0],
    clockInTime: '08:45',
    clockOutTime: '17:30',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    status: 'on-time',
    totalHours: 8.75,
  },
  {
    id: '3',
    userId: '2',
    date: today.toISOString().split('T')[0],
    clockInTime: '09:17',
    clockOutTime: '',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    status: 'late',
    totalHours: 0,
  },
];