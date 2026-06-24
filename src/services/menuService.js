import { request } from '../api/client.js';

export function getTodayMenu() {
  return request('/menu/today');
}

export function getWeekMenu() {
  return request('/menu/week');
}
