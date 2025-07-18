// Detect platform for API base URL
import { Platform } from 'react-native';

// Default: localhost for web/iOS simulator, 10.0.2.2 for Android emulator
let API_BASE_URL = '';
if (Platform.OS === 'android') {
  API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator
} else {
  API_BASE_URL = 'http://localhost:5000/api'; // iOS simulator or web
}
// If testing on a real device, set your computer's IP below:
// API_BASE_URL = 'http://192.168.x.x:5000/api'; // <-- Uncomment and set your IP

export async function apiRequest(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options: RequestInit = {
    method,
    headers,
  };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

// Get the current company location
export async function getCompanyLocation(token?: string) {
  return apiRequest('/company-location', 'GET', undefined, token);
}

// Set/update the company location (HR only)
export async function setCompanyLocation(latitude: number, longitude: number, token: string) {
  return apiRequest('/company-location', 'POST', { latitude, longitude }, token);
}

export async function registerHR({ name, email, password, mockPayment }: { name: string; email: string; password: string; mockPayment: boolean }) {
  const res = await fetch(`${API_BASE_URL}/auth/register-hr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, mockPayment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
} 