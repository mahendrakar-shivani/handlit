import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBookings } from '../../services/adminService';

interface Booking {
  id: string; status: string; totalAmount: number;
  scheduledAt: string; createdAt: string;
  user: { name: string; email: string };
  provider: { name: string };
  service: { name: string };
}

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING:     { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:   { bg: '#d1fae5', color: '#065f46' },
  IN_PROGRESS: { bg: '#dbeafe', color: '#1e40af' },
  COMPLETED:   { bg: '#f0fdf4', color: '#166534' },
  CANCELLED:   { bg: '#fee2e2', color: '#991b1b' },
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAdminBookings(page);
        setBookings(data?.bookings || data || []);
        setTotal(data?.total || data?.length || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Admin</h1>
        <div style={styles.navLinks}>
          <Link to="/admin"           style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/users"     style={styles.navLink}>Users</Link>
          <Link to="/admin/providers" style={styles.navLink}>Providers</Link>
          <Link to="/admin/bookings"  style={{ ...styles.navLink, color: '#1a56db', fontWeight: 700 }}>Bookings</Link>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>All Bookings ({total})</h2>

        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Service', 'Customer', 'Provider', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings?.map((b) => {
                  const sc = statusColors[b.status] || statusColors.PENDING;
                  return (
                    <tr key={b.id}>
                      <td style={styles.td}>{b.service?.name || '-'}</td>
                      <td style={styles.td}>
                        <div>{b.user?.name || '-'}</div>
                        <div style={styles.subText}>{b.user?.email || ''}</div>
                      </td>
                      <td style={styles.td}>{b.provider?.name || '-'}</td>
                      <td style={styles.td}>₹{b.totalAmount}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: sc.bg, color: sc.color }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={styles.pagination}>
          <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
          <span style={styles.pageInfo}>Page {page} · {total} total</span>
          <button style={styles.pageBtn} disabled={bookings.length < 10} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  nav: {
    backgroundColor: '#fff', padding: '14px 32px', display: 'flex',
    alignItems: 'center', gap: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: 20, fontWeight: 700, color: '#1a56db', margin: 0 },
  navLinks: { display: 'flex', gap: 24 },
  navLink: { fontSize: 14, color: '#374151', textDecoration: 'none', fontWeight: 500 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 24 },
  tableWrap: {
    backgroundColor: '#fff', borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600,
    color: '#6b7280', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
  },
  td: { padding: '12px 16px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6' },
  subText: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 },
  pageBtn: {
    padding: '8px 20px', backgroundColor: '#fff', border: '1px solid #d1d5db',
    borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500,
  },
  pageInfo: { fontSize: 14, color: '#374151' },
  center: { textAlign: 'center', padding: 60, color: '#6b7280' },
};

export default AdminBookings;