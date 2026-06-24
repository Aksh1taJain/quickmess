import { request, saveAdminToken, clearAdminToken } from '../api/client.js';

export async function loginAdmin(credentials) {
  const data = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  saveAdminToken(data.token);
  return data;
}

export function logoutAdmin() {
  clearAdminToken();
}
