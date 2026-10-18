//syncward-frontend/src/api.js
const API_URL = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export async function fetchWithAuth(endpoint, options = {}) {
  const token = getToken();
  if (!token) throw new Error('Not logged in');

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    logout();
    window.location.href = '/';
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}