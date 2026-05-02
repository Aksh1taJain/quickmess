import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/menu', label: 'Menu', icon: '🍽️' },
  { path: '/tickets', label: 'Tickets', icon: '🎫' },
  { path: '/feedback', label: 'Feedback', icon: '⭐' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <button
          key={tab.path}
          className={`nav-item ${pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
