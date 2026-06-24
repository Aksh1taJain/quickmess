const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('qm_admin_token');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || 'QuickMess request failed');
  }

  return payload.data ?? payload;
}

export function saveAdminToken(token) {
  localStorage.setItem('qm_admin_token', token);
}

export function clearAdminToken() {
  localStorage.removeItem('qm_admin_token');
}

export { request };
