import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { createBooking } from '../../services/bookingsService';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const providerId = searchParams.get('providerId') || '';
  const serviceId  = searchParams.get('serviceId')  || '';
  const price      = Number(searchParams.get('price') || 0);

  const [form, setForm] = useState({ scheduledAt: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createBooking({
        providerId,
        serviceId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        address: form.address,
        totalAmount: price,
      });
      navigate('/my-bookings');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Confirm Booking</h1>

        <div style={styles.card}>
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Booking Summary</h2>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Total Amount</span>
              <span style={styles.summaryValue}>₹{price}</span>
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Scheduled Date & Time</label>
              <input
                style={styles.input}
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Service Address</label>
              <textarea
                style={styles.textarea}
                placeholder="Enter your full address..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div style={styles.btnRow}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button style={styles.confirmBtn} type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 560, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 24 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 32,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  summary: {
    backgroundColor: '#eff6ff', borderRadius: 10, padding: 20, marginBottom: 24,
  },
  summaryTitle: { fontSize: 16, fontWeight: 600, color: '#1a56db', marginBottom: 12 },
  summaryRow: { display: 'flex', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: '#374151' },
  summaryValue: { fontSize: 18, fontWeight: 700, color: '#1a56db' },
  error: {
    backgroundColor: '#fee2e2', color: '#dc2626',
    padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14,
  },
  field: { marginBottom: 20 },
  label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
  },
  btnRow: { display: 'flex', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, padding: '12px', backgroundColor: '#f3f4f6',
    color: '#374151', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  confirmBtn: {
    flex: 2, padding: '12px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
};

export default BookingPage;