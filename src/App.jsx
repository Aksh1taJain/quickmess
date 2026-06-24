import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import {
  AdminDashboard,
  AdminLogin,
  BuyTicket,
  Home,
  Menu,
  TicketSuccess,
  TicketView,
  VerifyTicket,
} from './pages/Pages.jsx';

function Navigation() {
  return (
    <nav className="dock" aria-label="Primary navigation">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/menu">Menu</NavLink>
      <NavLink to="/buy">Buy</NavLink>
      <NavLink to="/admin">Admin</NavLink>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/buy" element={<BuyTicket />} />
          <Route path="/success/:id" element={<TicketSuccess />} />
          <Route path="/ticket/:id" element={<TicketView />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verify" element={<VerifyTicket />} />
        </Routes>
      </main>
      <Navigation />
    </BrowserRouter>
  );
}
