import { useState, useEffect } from 'react';
import { getDeviceId, getAllTickets } from '../services/ticketService';

export default function Profile() {
  const [deviceId, setDeviceId] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, used: 0, spent: 0 });
  const [name, setName] = useState(() => localStorage.getItem('qm_name') || 'Student');
  const [editing, setEditing] = useState(false);
  const [tmpName, setTmpName] = useState(name);

  useEffect(() => {
    setDeviceId(getDeviceId());
    const tickets = getAllTickets();
    setStats({
      total: tickets.length,
      active: tickets.filter(t => t.status === 'active').length,
      used: tickets.filter(t => t.status === 'used').length,
      spent: tickets.reduce((s, t) => s + t.amount, 0),
    });
  }, []);

  function saveName() {
    const n = tmpName.trim() || 'Student';
    setName(n);
    localStorage.setItem('qm_name', n);
    setEditing(false);
  }

  return (
    <div className="page">
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">Your mess account details</p>

      {/* Avatar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={tmpName} onChange={e => setTmpName(e.target.value)} style={{ flex: 1, padding: '8px 12px' }} />
              <button className="btn btn-primary" style={{ width: 'auto', padding: '8px 14px' }} onClick={saveName}>Save</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>{name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mess Member</div>
              </div>
              <button onClick={() => { setTmpName(name); setEditing(true); }} style={{ background: 'none', color: 'var(--accent-light)', fontSize: 13, fontWeight: 600 }}>Edit</button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Tickets', val: stats.total, icon: '🎫' },
          { label: 'Active', val: stats.active, icon: '🟢' },
          { label: 'Used', val: stats.used, icon: '✅' },
          { label: 'Total Spent', val: `₹${stats.spent}`, icon: '💰' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Device info */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Device Info</div>
        <div className="info-row">
          <span className="info-key">Device ID</span>
          <span className="info-val" style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{deviceId.slice(0, 18)}…</span>
        </div>
        <div className="info-row">
          <span className="info-key">Storage</span>
          <span className="info-val">localStorage</span>
        </div>
        <div className="info-row">
          <span className="info-key">Offline Mode</span>
          <span className="info-val" style={{ color: 'var(--green)' }}>✓ Supported</span>
        </div>
      </div>

      <div className="warning-box">
        <span>ℹ️</span>
        <span>Tickets are stored on this device. Do not clear browser data or you will lose your tickets.</span>
      </div>
    </div>
  );
}
