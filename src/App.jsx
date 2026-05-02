import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Tickets from './pages/Tickets';
import BuyTicket from './pages/BuyTicket';
import TicketView from './pages/TicketView';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/buy" element={<BuyTicket />} />
            <Route path="/ticket/:ticketId" element={<TicketView />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
