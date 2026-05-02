import { useState } from 'react';

const CATEGORIES = ['Taste', 'Hygiene', 'Quantity', 'Service'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

// TODO: Replace localStorage with POST /api/feedback
function saveFeedback(data) {
  const all = JSON.parse(localStorage.getItem('qm_feedback') || '[]');
  all.unshift({ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  localStorage.setItem('qm_feedback', JSON.stringify(all));
}

export default function Feedback() {
  const [meal, setMeal] = useState('Lunch');
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('Taste');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!rating) return alert('Please give a rating');
    saveFeedback({ meal, rating, category, comment });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="success-screen" style={{ marginTop: 40 }}>
          <div className="success-icon">🙏</div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 24, marginBottom: 8 }}>Thank You!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Your feedback has been saved</p>
          <button className="btn btn-primary" onClick={() => { setSubmitted(false); setRating(0); setComment(''); }}>
            Give More Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Feedback</h1>
      <p className="page-subtitle">Help us improve your mess experience</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Meal */}
        <div>
          <label className="form-label">Meal</label>
          <div className="meal-selector">
            {MEALS.map(m => (
              <button
                key={m}
                className={`meal-option ${meal === m ? `selected-${m.toLowerCase()}` : ''}`}
                onClick={() => setMeal(m)}
              >
                <span className="icon">{m === 'Breakfast' ? '🌅' : m === 'Lunch' ? '☀️' : '🌙'}</span>
                <span className="label">{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="form-label">Rating</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} className="star" onClick={() => setRating(s)}>
                {s <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="form-label">Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 100,
                  border: `1px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`,
                  background: category === c ? 'var(--accent-glow)' : 'var(--bg-card2)',
                  color: category === c ? 'var(--accent-light)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="form-label">Comment (optional)</label>
          <textarea
            rows={4}
            placeholder="Tell us what you liked or what can improve..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
