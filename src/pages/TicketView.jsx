import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicketById, verifyTicket } from '../services/ticketService';

export default function TicketView() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false);
  const [time, setTime] = useState(new Date());
  const timerRef = useRef(null);

  // Live clock — visual cue that this is a live app, not a screenshot
  useEffect(() => {
    timerRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const t = getTicketById(ticketId);
    setTicket(t);
  }, [ticketId]);

  function handleVerifyClick() {
    setShowModal(true);
  }

  function handleConfirmVerify() {
    // verifyTicket is the single source of truth — do NOT mutate state directly
    const result = verifyTicket(ticketId);
    if (result.success) {
      setTicket(result.ticket);
      setVerifyDone(true);
    }
    setShowModal(false);
  }

  if (!ticket) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">🎫</div>
          <h3>Ticket Not Found</h3>
          <p style={{ marginBottom: 20 }}>This ticket doesn't exist or was removed.</p>
          <button className="btn btn-outline" onClick={() => navigate('/tickets')}>Back to Tickets</button>
        </div>
      </div>
    );
  }

  const isUsed = ticket.status === 'used';
  const mealColor = {
    Breakfast: 'var(--meal-breakfast)',
    Lunch: 'var(--meal-lunch)',
    Dinner: 'var(--meal-dinner)',
  }[ticket.meal] || 'var(--accent)';

  return (
    <div className="page">
      <button onClick={() => navigate('/tickets')} style={{ background: 'none', color: 'var(--text-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        ← My Tickets
      </button>

      {/* Live label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        {!isUsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', letterSpacing: '0.5px' }}>LIVE TICKET</span>
          </div>
        ) : (
          <span className="badge badge-grey">✓ USED</span>
        )}
        <div className="live-ticker">
          🕐 {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Ticket card */}
      <div className="ticket-card" style={{ marginBottom: 16 }}>
        <div className="ticket-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: mealColor, marginBottom: 6 }}>QuickMess</div>
              <div style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800 }}>{ticket.meal}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                {ticket.count} person{ticket.count > 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: mealColor }}>₹{ticket.amount}</div>
              <span className={`badge ${isUsed ? 'badge-grey' : 'badge-green'}`} style={{ marginTop: 6 }}>
                {isUsed ? '✓ Used' : '● Active'}
              </span>
            </div>
          </div>
        </div>
        <div className="ticket-body">
          <div className="ticket-row">
            <span className="ticket-label">Ticket ID</span>
            <span className="ticket-value" style={{ fontFamily: 'monospace', fontSize: 11 }}>{ticket.ticketId.slice(0, 18)}…</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Student</span>
            <span className="ticket-value">{ticket.studentName}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Date</span>
            <span className="ticket-value">{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Time</span>
            <span className="ticket-value">{new Date(ticket.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {isUsed && ticket.usedAt && (
            <div className="ticket-row">
              <span className="ticket-label">Verified At</span>
              <span className="ticket-value" style={{ color: 'var(--text-muted)' }}>
                {new Date(ticket.usedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="warning-box" style={{ marginBottom: 20 }}>
        <span>⚠️</span>
        <span>Screenshots are not valid. Ticket must be opened inside the app.
          {/* TODO: Production version must verify via backend */}
        </span>
      </div>

      {/* Verify button */}
      {!isUsed ? (
        <button className="btn btn-green" onClick={handleVerifyClick}>
          ✅ Verify Entry
        </button>
      ) : (
        <>
          <button className="btn btn-grey" disabled>
            ✓ Entry Verified — Ticket Used
          </button>
          {verifyDone && (
            <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--green)', fontSize: 14, fontWeight: 600 }}>
              Entry successfully verified ✓
            </div>
          )}
        </>
      )}

      {/* Confirmation modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontFamily: 'Syne', fontSize: 20, marginBottom: 8 }}>Confirm Verification</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              This will mark the ticket as <strong>Used</strong>. This action <strong>cannot be undone</strong>.
            </p>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="ticket-row"><span className="ticket-label">Meal</span><span className="ticket-value">{ticket.meal}</span></div>
              <div className="ticket-row"><span className="ticket-label">People</span><span className="ticket-value">{ticket.count}</span></div>
            </div>
            <button className="btn btn-green" style={{ marginBottom: 10 }} onClick={handleConfirmVerify}>
              Confirm — Mark as Used
            </button>
            <button className="btn btn-outline" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
