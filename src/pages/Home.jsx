import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets } from '../services/ticketService';
import { getTodayMenu } from '../services/menuService';

export default function Home() {
  const navigate = useNavigate();
  const [recentTicket, setRecentTicket] = useState(null);
  const [todayPreview, setTodayPreview] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tickets = getAllTickets();
    setRecentTicket(tickets[0] || null);
    getTodayMenu().then(m => setTodayPreview(m));
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return '🌅 Good Morning';
    if (h < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const QUICK = [
    { icon: '🍽️', label: 'View Menu', path: '/menu' },
    { icon: '🎫', label: 'Buy Ticket', path: '/buy' },
    { icon: '⭐', label: 'Feedback', path: '/feedback' },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
          {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 className="page-title">{greeting()}</h1>
        <p className="page-subtitle">Welcome to QuickMess — your digital mess card</p>
      </div>

      {/* Price banner */}
      <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Meal Price</div>
          <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Syne', marginTop: 2 }}>₹80 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>per meal</span></div>
        </div>
        <div style={{ fontSize: 40 }}>🏫</div>
      </div>

      {/* Quick actions */}
      <div className="section-header">
        <span className="section-title">Quick Actions</span>
      </div>
      <div className="quick-actions" style={{ marginBottom: 24 }}>
        {QUICK.map(q => (
          <button key={q.path} className="quick-action" onClick={() => navigate(q.path)}>
            <span className="icon">{q.icon}</span>
            <span className="label">{q.label}</span>
          </button>
        ))}
      </div>

      {/* Today's menu preview */}
      {todayPreview && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-title">Today's Menu</span>
            <button onClick={() => navigate('/menu')} style={{ marginLeft: 'auto', background: 'none', color: 'var(--accent-light)', fontSize: 12, fontWeight: 600 }}>See all →</button>
          </div>
          <div className="card">
            {[
              { key: 'breakfast', label: '🌅 Breakfast', color: 'var(--meal-breakfast)' },
              { key: 'lunch', label: '☀️ Lunch', color: 'var(--meal-lunch)' },
              { key: 'dinner', label: '🌙 Dinner', color: 'var(--meal-dinner)' },
            ].map(m => (
              <div key={m.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {todayPreview[m.key].slice(0, 2).map(i => i.name).join(' · ')}
                  {todayPreview[m.key].length > 2 && ` +${todayPreview[m.key].length - 2} more`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent ticket */}
      {recentTicket && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-header">
            <span className="section-title">Recent Ticket</span>
          </div>
          <div
            className="card"
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => navigate(`/ticket/${recentTicket.ticketId}`)}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{recentTicket.meal} · {recentTicket.count} person{recentTicket.count > 1 ? 's' : ''}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date(recentTicket.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
            <span className={`badge ${recentTicket.status === 'active' ? 'badge-green' : 'badge-grey'}`}>
              {recentTicket.status === 'active' ? '● Active' : '✓ Used'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
