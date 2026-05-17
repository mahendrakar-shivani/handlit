import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  address: string;
  totalAmount: number;
  service: { name: string };
  user: { name: string; email: string };
}

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING:     { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:   { bg: '#d1fae5', color: '#065f46' },
  IN_PROGRESS: { bg: '#dbeafe', color: '#1e40af' },
  COMPLETED:   { bg: '#f0fdf4', color: '#166534' },
  CANCELLED:   { bg: '#fee2e2', color: '#991b1b' },
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const provider = JSON.parse(localStorage.getItem('provider') || '{}');

  const loadBookings = async (status: string) => {
    try {
      setLoading(true);
      const res = await api.get('/bookings', { params: { status: status || undefined } });
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    const token = localStorage.getItem('providerToken');
    if (!token) { navigate('/provider/login'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    async function load() {
      await loadBookings(filter);
    }
    load();
  }, [filter, navigate]);

  const updateStatus = async (id: string, action: string) => {
    try {
      await api.patch(`/bookings/${id}/${action}`);
      loadBookings(filter);
    } catch {
      alert('Could not update booking status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('providerToken');
    localStorage.removeItem('provider');
    navigate('/provider/login');
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Provider</h1>
        <div style={styles.navRight}>
          <span style={styles.providerName}>{provider.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>Booking Requests</h2>

        <div style={styles.filters}>
          {['', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              style={{ ...styles.filterBtn, ...(filter === s ? styles.activeFilter : {}) }}
              onClick={() => setFilter(s)}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div style={styles.center}>No bookings found</div>
        ) : (
          <div style={styles.list}>
            {bookings.map((booking) => {
              const sc = statusColors[booking.status] || statusColors.PENDING;
              return (
                <div key={booking.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.serviceName}>{booking.service.name}</h3>
                      <p style={styles.customerName}>
                        👤 {booking.user.name} - {booking.user.email}
                      </p>
                    </div>
                    <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.color }}>
                      {booking.status}
                    </span>
                  </div>

                  <div style={styles.details}>
                    <span>📅 {new Date(booking.scheduledAt).toLocaleString()}</span>
                    <span>📍 {booking.address}</span>
                    <span>💰 ₹{booking.totalAmount}</span>
                  </div>

                  <div style={styles.actions}>
                    {booking.status === 'PENDING' && (
                      <button style={styles.confirmBtn} onClick={() => updateStatus(booking.id, 'confirm')}>
                        ✅ Confirm
                      </button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <button style={styles.inProgressBtn} onClick={() => updateStatus(booking.id, 'inprogress')}>
                        🔄 Mark In Progress
                      </button>
                    )}
                    {booking.status === 'IN_PROGRESS' && (
                      <button style={styles.completeBtn} onClick={() => updateStatus(booking.id, 'complete')}>
                        🏁 Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f3f4f6' },
  nav: { background: '#fff', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 20, fontWeight: 700, color: '#1a56db' },
  navRight: { display: 'flex', gap: 16, alignItems: 'center' },
  providerName: { fontSize: 14 },
  logoutBtn: { padding: '7px 16px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' },
  container: { maxWidth: 900, margin: '0 auto', padding: '32px' },
  heading: { fontSize: 26, fontWeight: 700, marginBottom: 20 },
  filters: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: { padding: '7px 16px', borderRadius: 20, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' },
  activeFilter: { background: '#1a56db', color: '#fff', border: '1px solid #1a56db' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  serviceName: { fontSize: 18, fontWeight: 600, margin: '0 0 4px 0' },
  customerName: { color: '#6b7280', fontSize: 14, margin: 0 },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  details: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#374151' },
  actions: { marginTop: 16, display: 'flex', gap: 10 },
  confirmBtn: { padding: '8px 20px', background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  inProgressBtn: { padding: '8px 20px', background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  completeBtn: { padding: '8px 20px', background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  center: { textAlign: 'center', padding: 60, color: '#6b7280' },
};

export default ProviderDashboard;