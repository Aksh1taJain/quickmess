import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets } from '../services/ticketService';

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(getAllTickets());
  }, []);

  const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };

  return (
    <div className="page">
      <h1 className="page-title">My Tickets</h1>
      <p className="page-subtitle">Tap a ticket to view or verify</p>

      <button className="btn btn-primary" style={{ marginBottom: 24 }} onClick={() => navigate('/buy')}>
        + Buy New Ticket
      </button>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🎫</div>
          <h3>No tickets yet</h3>
          <p>Buy your first mess ticket to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.map(t => (
            <div
              key={t.ticketId}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => navigate(`/ticket/${t.ticketId}`)}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 28 }}>{mealEmoji[t.meal] || '🎫'}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{t.meal}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {t.count} person{t.count > 1 ? 's' : ''} · ₹{t.amount} · {new Date(t.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
              <span className={`badge ${t.status === 'active' ? 'badge-green' : 'badge-grey'}`}>
                {t.status === 'active' ? '● Active' : '✓ Used'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
