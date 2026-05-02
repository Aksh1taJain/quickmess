import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketService';

const MEALS = [
  { id: 'Breakfast', icon: '🌅', time: '7:30–9:00 AM' },
  { id: 'Lunch', icon: '☀️', time: '12:30–2:00 PM' },
  { id: 'Dinner', icon: '🌙', time: '7:30–9:00 PM' },
];

const PRICE = 80;

// Payment steps: select → confirm → processing → success
const STEPS = { SELECT: 'select', CONFIRM: 'confirm', PROCESSING: 'processing', SUCCESS: 'success' };

export default function BuyTicket() {
  const navigate = useNavigate();
  const [meal, setMeal] = useState('Lunch');
  const [count, setCount] = useState(1);
  const [step, setStep] = useState(STEPS.SELECT);
  const [newTicket, setNewTicket] = useState(null);

  const total = PRICE * count;

  function handleBuy() {
    setStep(STEPS.CONFIRM);
  }

  function handleConfirmPayment() {
    setStep(STEPS.PROCESSING);
    // TODO: Replace with real payment gateway (Razorpay / UPI / QR)
    // Example: initRazorpayOrder({ amount: total * 100, currency: 'INR' })
    setTimeout(() => {
      const ticket = createTicket({ meal, count });
      setNewTicket(ticket);
      setStep(STEPS.SUCCESS);
    }, 2000);
  }

  if (step === STEPS.PROCESSING) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 48, animation: 'spin 1s linear infinite' }}>⏳</div>
        <div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 6 }}>Processing Payment</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Please wait, do not close this screen</p>
        </div>
        {/* TODO: Show actual payment gateway UI here */}
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (step === STEPS.SUCCESS && newTicket) {
    return (
      <div className="page">
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 24, marginBottom: 8 }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Your ticket has been generated</p>
          <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
            <div className="ticket-row"><span className="ticket-label">Meal</span><span className="ticket-value">{newTicket.meal}</span></div>
            <div className="ticket-row"><span className="ticket-label">People</span><span className="ticket-value">{newTicket.count}</span></div>
            <div className="ticket-row"><span className="ticket-label">Amount Paid</span><span className="ticket-value" style={{ color: 'var(--green)' }}>₹{newTicket.amount}</span></div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/ticket/${newTicket.ticketId}`)}>
            View Ticket 🎫
          </button>
          <button className="btn btn-outline" style={{ marginTop: 10 }} onClick={() => { setStep(STEPS.SELECT); setNewTicket(null); }}>
            Buy Another
          </button>
        </div>
      </div>
    );
  }

  if (step === STEPS.CONFIRM) {
    return (
      <div className="page">
        <button onClick={() => setStep(STEPS.SELECT)} style={{ background: 'none', color: 'var(--text-muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back
        </button>
        <h1 className="page-title">Confirm Order</h1>
        <p className="page-subtitle">Review your ticket before paying</p>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="ticket-row"><span className="ticket-label">Meal</span><span className="ticket-value">{meal}</span></div>
          <div className="ticket-row"><span className="ticket-label">Number of People</span><span className="ticket-value">{count}</span></div>
          <div className="ticket-row"><span className="ticket-label">Price per Meal</span><span className="ticket-value">₹{PRICE}</span></div>
          <div className="ticket-row">
            <span className="ticket-label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
            <span className="ticket-value" style={{ fontSize: 20, color: 'var(--accent-light)' }}>₹{total}</span>
          </div>
        </div>

        {/* TODO: Replace this section with actual payment integration */}
        <div className="card" style={{ marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Pay via UPI / QR Code</div>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {/* TODO: Show actual QR / UPI ID / Razorpay button */}
            Mock payment — click below to simulate ₹{total} payment
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleConfirmPayment}>
          Pay ₹{total} →
        </button>
      </div>
    );
  }

  // Default: SELECT step
  return (
    <div className="page">
      <h1 className="page-title">Buy Ticket</h1>
      <p className="page-subtitle">Choose your meal and proceed to pay</p>

      {/* Meal type */}
      <div style={{ marginBottom: 24 }}>
        <label className="form-label">Select Meal</label>
        <div className="meal-selector">
          {MEALS.map(m => (
            <button
              key={m.id}
              className={`meal-option ${meal === m.id ? `selected-${m.id.toLowerCase()}` : ''}`}
              onClick={() => setMeal(m.id)}
            >
              <span className="icon">{m.icon}</span>
              <span className="label">{m.id}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.time}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ marginBottom: 24 }}>
        <label className="form-label">Number of People</label>
        <div className="stepper">
          <button className="stepper-btn" onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
          <span className="stepper-val">{count}</span>
          <button className="stepper-btn" onClick={() => setCount(c => Math.min(10, c + 1))}>+</button>
        </div>
      </div>

      {/* Price summary */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>₹{PRICE} × {count} {count === 1 ? 'person' : 'people'}</span>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: 'var(--accent-light)' }}>₹{total}</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleBuy}>
        Proceed to Pay ₹{total}
      </button>
    </div>
  );
}
