import { LeaveRequest } from '@/types';

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    leaveType: 'Vacation',
    startDate: '2025-07-10',
    endDate: '2025-07-15',
    reason: 'Family vacation',
    status: 'pending',
    createdAt: '2025-06-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    leaveType: 'Sick',
    startDate: '2025-06-05',
    endDate: '2025-06-06',
    reason: 'Not feeling well',
    status: 'approved',
    createdAt: '2025-06-04T09:15:00Z',
  },
  {
    id: '3',
    userId: '2',
    userName: 'Sarah Lee',
    leaveType: 'Personal',
    startDate: '2025-06-25',
    endDate: '2025-06-25',
    reason: 'Doctor appointment',
    status: 'rejected',
    createdAt: '2025-06-18T14:20:00Z',
  },
];