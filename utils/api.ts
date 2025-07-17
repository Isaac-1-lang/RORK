const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL if needed

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