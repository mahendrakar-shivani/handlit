import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getMyBookings, cancelBooking } from '../../services/bookingsService';

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  address: string;
  totalAmount: number;
  service: { name: string };
  provider: { name: string };
}

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING:     { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:   { bg: '#d1fae5', color: '#065f46' },
  IN_PROGRESS: { bg: '#dbeafe', color: '#1e40af' },
  COMPLETED:   { bg: '#f0fdf4', color: '#166534' },
  CANCELLED:   { bg: '#fee2e2', color: '#991b1b' },
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await getMyBookings({ status: filter || undefined });
        if (!cancelled) setBookings(data.bookings || []);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [filter, refreshKey]); // refreshKey lets handleCancel trigger a refetch

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setRefreshKey((k) => k + 1); // trigger useEffect refetch
    } catch {
      alert('Could not cancel booking');
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>My Bookings</h1>

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
          <div style={styles.center}>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={styles.center}>No bookings found</div>
        ) : (
          <div style={styles.list}>
            {bookings.map((booking) => {
              const sc = statusColors[booking.status] || statusColors.PENDING;
              return (
                <div key={booking.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.serviceName}>{booking.service.name}</h3>
                      <p style={styles.providerName}>by {booking.provider.name}</p>
                    </div>
                    <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.color }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={styles.details}>
                    <span>📅 {new Date(booking.scheduledAt).toLocaleString()}</span>
                    <span>📍 {booking.address}</span>
                    <span>💰 ₹{booking.totalAmount}</span>
                  </div>
                  {booking.status === 'PENDING' && (
                    <button style={styles.cancelBtn} onClick={() => handleCancel(booking.id)}>
                      Cancel Booking
                    </button>
                  )}
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
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 800, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 24 },
  filters: { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
  filterBtn: {
    padding: '7px 16px', borderRadius: 20, border: '1px solid #d1d5db',
    backgroundColor: '#fff', fontSize: 13, cursor: 'pointer',
    fontWeight: 500, color: '#374151',
  },
  activeFilter: { backgroundColor: '#1a56db', color: '#fff', border: '1px solid #1a56db' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  serviceName: { fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 4px 0' },
  providerName: { fontSize: 14, color: '#6b7280', margin: 0 },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  details: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#374151' },
  cancelBtn: {
    marginTop: 16, padding: '8px 20px', backgroundColor: '#fee2e2',
    color: '#dc2626', border: '1px solid #fca5a5',
    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
};

export default MyBookingsPage;