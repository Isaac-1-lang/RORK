export interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'hr' | 'admin';
  department: string;
  password: string;
}

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'John Worker',
    email: 'john@company.com',
    role: 'worker',
    department: 'Engineering',
    password: 'demo'
  },
  {
    id: 'user_2',
    name: 'Sarah HR',
    email: 'sarah@company.com',
    role: 'hr',
    department: 'Human Resources',
    password: 'demo'
  },
  {
    id: 'user_3',
    name: 'Mike Admin',
    email: 'mike@company.com',
    role: 'admin',
    department: 'Administration',
    password: 'demo'
  },
  {
    id: 'user_4',
    name: 'Alice Developer',
    email: 'alice@company.com',
    role: 'worker',
    department: 'Engineering',
    password: 'demo'
  },
  {
    id: 'user_5',
    name: 'Bob Designer',
    email: 'bob@company.com',
    role: 'worker',
    department: 'Design',
    password: 'demo'
  }
];

export const demoCredentials = {
  worker: {
    email: 'john@company.com',
    password: 'demo'
  },
  hr: {
    email: 'sarah@company.com',
    password: 'demo'
  },
  admin: {
    email: 'mike@company.com',
    password: 'demo'
  }
};