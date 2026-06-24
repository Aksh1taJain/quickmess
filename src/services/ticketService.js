import { request } from '../api/client.js';

export function createTicketOrder(payload) {
  return request('/tickets/create-order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function confirmTicketPayment(payload) {
  return request('/tickets/confirm-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getTicket(ticketId) {
  return request(`/tickets/${ticketId}`);
}

export function verifyTicket(ticketId) {
  return request(`/tickets/${ticketId}/verify`, {
    method: 'POST',
  });
}

export function getAdminTickets() {
  return request('/admin/tickets');
}
