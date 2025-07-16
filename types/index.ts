export type User = {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'hr' | 'admin';
  department: string;
  position: string;
  profileImage?: string;
  phoneNumber?: string;
  shiftStartTime?: string;
  createdBy?: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
  fingerprintCaptured?: boolean;
  status?: 'active' | 'inactive';
  createdAt?: string;
};

export type Attendance = {
  id: string;
  userId: string;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'on-time' | 'late' | 'absent';
  totalHours?: number;
};

export type LeaveRequest = {
  id: string;
  userId: string;
  userName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type WorkLocation = {
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
};

export type Department = {
  id: string;
  name: string;
  description?: string;
};

export type WorkerRegistrationData = {
  name: string;
  phoneNumber: string;
  email?: string;
  department: string;
  position: string;
  shiftStartTime: string;
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  fingerprintCaptured: boolean;
  tempPassword?: string;
};