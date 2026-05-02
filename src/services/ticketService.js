// ─────────────────────────────────────────────
// ticketService.js
// Core ticket logic. All state is localStorage.
// ─────────────────────────────────────────────

const TICKETS_KEY = 'qm_tickets';
const DEVICE_ID_KEY = 'qm_deviceId';

// Generate or retrieve a stable deviceId
export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// Load all tickets from localStorage
export function getAllTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKETS_KEY)) || [];
  } catch {
    return [];
  }
}

// Save tickets array to localStorage
function saveTickets(tickets) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

// Create a new ticket after payment success
// TODO: After mock payment, replace with POST /api/tickets + save response
export function createTicket({ meal, count }) {
  const PRICE_PER_MEAL = 80;
  const ticket = {
    ticketId: crypto.randomUUID(),
    deviceId: getDeviceId(),
    meal,
    count,
    amount: PRICE_PER_MEAL * count,
    status: 'active',         // "active" | "used"
    createdAt: new Date().toISOString(),
    studentName: 'Student',  // TODO: Replace with auth user name
  };

  const all = getAllTickets();
  all.unshift(ticket);
  saveTickets(all);
  return ticket;
}

// Get a single ticket by ID
export function getTicketById(ticketId) {
  return getAllTickets().find(t => t.ticketId === ticketId) || null;
}

// ─────────────────────────────────────────────
// verifyTicket — MAIN VERIFICATION FUNCTION
// Must only be called once per ticket.
//
// TODO: Production version must call backend:
//   PATCH /api/tickets/:ticketId/verify
//   with { deviceId } and verify the response.
//   Local state alone is NOT sufficient for production.
// ─────────────────────────────────────────────
export function verifyTicket(ticketId) {
  const all = getAllTickets();
  const idx = all.findIndex(t => t.ticketId === ticketId);

  if (idx === -1) return { success: false, reason: 'not_found' };
  if (all[idx].status === 'used') return { success: false, reason: 'already_used' };

  all[idx].status = 'used';
  all[idx].usedAt = new Date().toISOString();
  saveTickets(all);

  return { success: true, ticket: all[idx] };
}
