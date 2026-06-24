import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loginAdmin } from '../services/adminService.js';
import { getTodayMenu, getWeekMenu } from '../services/menuService.js';
import {
  confirmTicketPayment,
  createTicketOrder,
  getAdminTickets,
  getTicket,
  verifyTicket,
} from '../services/ticketService.js';

const LUNCH_PRICE = 80;

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function LoadingState({ label = 'Loading…' }) {
  return <div className="state">{label}</div>;
}

function ErrorState({ message }) {
  if (!message) return null;
  return <div className="error">{message}</div>;
}

function EmptyState({ title, description }) {
  return (
    <div className="state">
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}

function MenuCard({ menu }) {
  return (
    <article className="card menu-card">
      <span>{menu?.day_of_week || menu?.menu_date || 'Lunch'}</span>
      <h2>Lunch</h2>
      {menu?.items?.length ? (
        <ul>
          {menu.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No lunch menu published yet.</p>
      )}
      {menu?.notes && <small>{menu.notes}</small>}
    </article>
  );
}

export function Home() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodayMenu().then(setMenu).catch((err) => setError(err.message));
  }, []);

  return (
    <section className="page hero">
      <span className="eyebrow">QuickMess · Campus lunch tickets</span>
      <h1>Lunch tickets that feel effortless.</h1>
      <p>
        Buy a fixed ₹80 lunch ticket, complete Razorpay test payment, and receive a
        backend-generated QR ticket that staff verify online.
      </p>
      <div className="actions">
        <Link className="button primary" to="/buy">Buy lunch ticket</Link>
        <Link className="button" to="/menu">View menu</Link>
      </div>
      <ErrorState message={error} />
      <div className="grid two">
        <div className="card">
          <span>Today’s backend menu</span>
          <h2>{menu?.day_of_week || 'Lunch'}</h2>
          <p>{menu?.items?.join(' · ') || 'Menu will appear here after the API responds.'}</p>
        </div>
        <div className="card dark">
          <span>Staff verification</span>
          <h2>Scan, verify, mark used.</h2>
          <p>Every ticket check calls the backend. Screenshots and offline checks are not accepted.</p>
        </div>
      </div>
    </section>
  );
}

export function Menu() {
  const [tab, setTab] = useState('today');
  const [todayMenu, setTodayMenu] = useState(null);
  const [weekMenu, setWeekMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getTodayMenu(), getWeekMenu()])
      .then(([today, week]) => {
        setTodayMenu(today);
        setWeekMenu(week);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <div className="header">
        <div>
          <span className="eyebrow">GET /api/menu</span>
          <h1>Lunch menu</h1>
        </div>
        <div className="segmented-control">
          <button type="button" className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>Today</button>
          <button type="button" className={tab === 'week' ? 'active' : ''} onClick={() => setTab('week')}>Week</button>
        </div>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState label="Fetching menu from backend…" /> : null}
      {!loading && tab === 'today' ? <MenuCard menu={todayMenu} /> : null}
      {!loading && tab === 'week' ? (
        weekMenu.length ? (
          <div className="stack">{weekMenu.map((menu) => <MenuCard key={menu.id} menu={menu} />)}</div>
        ) : (
          <EmptyState title="No menu yet" description="The backend returned an empty weekly menu." />
        )
      ) : null}
    </section>
  );
}

export function BuyTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    enrollmentNumber: '',
    phone: '',
    lunchDate: todayIsoDate(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const checkout = await createTicketOrder(form);

      await confirmTicketPayment({
        ticketId: checkout.ticketId,
        razorpayOrderId: checkout.order.id,
        razorpayPaymentId: checkout.order.testMode ? `pay_test_${Date.now()}` : 'replace_from_razorpay_checkout',
        razorpaySignature: checkout.order.testMode ? 'test_signature' : 'replace_from_razorpay_checkout',
      });

      navigate(`/success/${checkout.ticketId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page narrow">
      <span className="eyebrow">Lunch only · ₹80 fixed</span>
      <h1>Buy lunch ticket</h1>
      <p className="muted">No student login. Enter student details and lunch date to create a backend ticket.</p>
      <ErrorState message={error} />
      <form className="card form" onSubmit={handleSubmit}>
        <label>Name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} /></label>
        <label>Enrollment number<input required value={form.enrollmentNumber} onChange={(event) => updateForm('enrollmentNumber', event.target.value)} /></label>
        <label>Phone<input required pattern="\d{10}" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} /></label>
        <label>Lunch date<input required type="date" value={form.lunchDate} onChange={(event) => updateForm('lunchDate', event.target.value)} /></label>
        <div className="total"><span>Total</span><strong>₹{LUNCH_PRICE}</strong></div>
        <button className="button primary" disabled={loading}>{loading ? 'Creating order…' : 'Pay ₹80'}</button>
      </form>
    </section>
  );
}

export function TicketSuccess() {
  const { id } = useParams();

  return (
    <section className="page narrow success">
      <div className="check">✓</div>
      <h1>Payment successful</h1>
      <p>Your backend-generated QR ticket is ready.</p>
      <Link className="button primary" to={`/ticket/${id}`}>View QR ticket</Link>
    </section>
  );
}

export function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTicket(id)
      .then(setTicket)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState label="Loading QR ticket…" />;

  return (
    <section className="page narrow">
      <ErrorState message={error} />
      {ticket ? (
        <article className="ticket">
          <span>QuickMess lunch ticket</span>
          <h1>₹{ticket.amount}</h1>
          {ticket.qr_code_data_url ? <img src={ticket.qr_code_data_url} alt="Ticket QR code" /> : <LoadingState label="QR not generated yet." />}
          <p>{ticket.student_name} · {ticket.enrollment_number}</p>
          <p>{new Date(ticket.lunch_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
          <b className={ticket.status.toLowerCase()}>{ticket.status}</b>
          <small>{ticket.id}</small>
        </article>
      ) : null}
    </section>
  );
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: 'admin', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(credentials);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page narrow">
      <span className="eyebrow">Staff only</span>
      <h1>Admin login</h1>
      <ErrorState message={error} />
      <form className="card form" onSubmit={handleLogin}>
        <label>Username<input value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} /></label>
        <label>Password<input type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label>
        <button className="button primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </section>
  );
}

export function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminTickets()
      .then(setTickets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => ({
    sold: tickets.length,
    used: tickets.filter((ticket) => ticket.status === 'USED').length,
    active: tickets.filter((ticket) => ticket.status === 'ACTIVE').length,
  }), [tickets]);

  return (
    <section className="page">
      <div className="header">
        <div><span className="eyebrow">Admin</span><h1>Sold tickets</h1></div>
        <Link className="button" to="/admin/verify">Open verifier</Link>
      </div>
      <div className="grid three">
        <div className="card metric"><span>Sold</span><strong>{summary.sold}</strong></div>
        <div className="card metric"><span>Active</span><strong>{summary.active}</strong></div>
        <div className="card metric"><span>Used</span><strong>{summary.used}</strong></div>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState label="Loading sold tickets…" /> : null}
      {!loading && !tickets.length ? <EmptyState title="No sold tickets" description="Paid lunch tickets will appear here." /> : null}
      {!loading && tickets.length ? (
        <div className="table">
          {tickets.map((ticket) => (
            <div key={ticket.id}>
              <b>{ticket.student_name}</b>
              <span>{ticket.enrollment_number}</span>
              <span>{new Date(ticket.lunch_date).toLocaleDateString('en-IN')}</span>
              <em>{ticket.status}</em>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function VerifyTicket() {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleVerify(event) {
    event.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const normalizedTicketId = ticketId.trim();
      const verification = await verifyTicket(normalizedTicketId);
      setResult(verification);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page narrow">
      <span className="eyebrow">Online verification only</span>
      <h1>QR verifier</h1>
      <p className="muted">Paste the scanned ticket ID. The backend will validate and mark it as USED.</p>
      <form className="card form" onSubmit={handleVerify}>
        <label>Ticket ID<input required value={ticketId} onChange={(event) => setTicketId(event.target.value)} placeholder="UUID from QR code" /></label>
        <button className="button primary" disabled={loading}>{loading ? 'Verifying…' : 'Verify & mark used'}</button>
      </form>
      <ErrorState message={error} />
      {result ? (
        <div className="card verification-result">
          <span>{result.valid ? 'Valid ticket' : 'Verification failed'}</span>
          <h2>{result.valid ? 'Ticket marked USED' : result.reason}</h2>
          {result.ticket ? <p>{result.ticket.student_name} · {result.ticket.enrollment_number}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
