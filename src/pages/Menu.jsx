import { useEffect, useState } from 'react';
import { getTodayMenu, getWeekMenu } from '../services/menuService';

const MEAL_COLORS = {
  breakfast: { color: 'var(--meal-breakfast)', label: '🌅 Breakfast' },
  lunch: { color: 'var(--meal-lunch)', label: '☀️ Lunch' },
  dinner: { color: 'var(--meal-dinner)', label: '🌙 Dinner' },
};

function TodayMenu({ menu }) {
  return (
    <div>
      {Object.entries(MEAL_COLORS).map(([key, { color, label }]) => (
        <div key={key} className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
          {menu[key].map((item, i) => (
            <div key={i} className="menu-item-row">
              <span className="menu-item-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0, marginTop: 4 }} />
              <div>
                <div className="menu-item-name">{item.name}</div>
                {item.desc && <div className="menu-item-desc">{item.desc}</div>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function WeekMenu({ menu }) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long' });
  return (
    <div>
      {menu.map((day) => (
        <div key={day.day} className="card" style={{ marginBottom: 12, border: day.day === today ? '1px solid var(--accent)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>{day.day}</div>
            {day.day === today && <span className="badge badge-accent">Today</span>}
          </div>
          {[
            { key: 'breakfast', label: '🌅', color: 'var(--meal-breakfast)' },
            { key: 'lunch', label: '☀️', color: 'var(--meal-lunch)' },
            { key: 'dinner', label: '🌙', color: 'var(--meal-dinner)' },
          ].map(m => (
            <div key={m.key} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>{m.label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{day[m.key].join(', ')}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [tab, setTab] = useState('today');
  const [todayMenu, setTodayMenu] = useState(null);
  const [weekMenu, setWeekMenu] = useState(null);

  useEffect(() => {
    getTodayMenu().then(setTodayMenu);
    getWeekMenu().then(setWeekMenu);
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Mess Menu</h1>
      <p className="page-subtitle">Fresh meals every day</p>

      <div className="tabs">
        <button className={`tab ${tab === 'today' ? 'active' : ''}`} onClick={() => setTab('today')}>Today</button>
        <button className={`tab ${tab === 'week' ? 'active' : ''}`} onClick={() => setTab('week')}>This Week</button>
      </div>

      {tab === 'today' && todayMenu && <TodayMenu menu={todayMenu} />}
      {tab === 'week' && weekMenu && <WeekMenu menu={weekMenu} />}
    </div>
  );
}
