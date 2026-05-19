import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getStats } from '../../services/adminService';

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: {
    id: string; status: string; totalAmount: number; createdAt: string;
    user: { name: string }; provider: { name: string }; service: { name: string };
  }[];
  bookingsByStatus: { status: string; _count: { status: number } }[];
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div style={styles.center}>Loading dashboard...</div>;

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Admin</h1>
        <div style={styles.navLinks}>
          <Link to="/admin"           style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/users"     style={styles.navLink}>Users</Link>
          <Link to="/admin/providers" style={styles.navLink}>Providers</Link>
          <Link to="/admin/bookings"  style={styles.navLink}>Bookings</Link>
        </div>
        <div style={styles.navRight}>
          <span style={styles.adminName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>Dashboard Overview</h2>

        <div style={styles.statsGrid}>
          {[
            { label: 'Total Users',     value: stats?.totalUsers,         color: '#1a56db', emoji: '👥' },
            { label: 'Total Providers', value: stats?.totalProviders,     color: '#057a55', emoji: '👷' },
            { label: 'Total Bookings',  value: stats?.totalBookings,      color: '#92400e', emoji: '📋' },
            { label: 'Total Revenue',   value: `₹${stats?.totalRevenue}`, color: '#7e3af2', emoji: '💰' },
          ].map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <span style={styles.statEmoji}>{stat.emoji}</span>
              <div>
                <p style={styles.statLabel}>{stat.label}</p>
                <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Bookings by Status</h3>
          <div style={styles.statusGrid}>
            {stats?.bookingsByStatus?.map((s) => (
              <div key={s.status} style={styles.statusCard}>
                <p style={styles.statusLabel}>{s.status}</p>
                <p style={styles.statusCount}>{s._count?.status || 0}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Bookings</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Service', 'Customer', 'Provider', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.map((b) => (
                <tr key={b.id}>
                  <td style={styles.td}>{b.service?.name || '-'}</td>
                  <td style={styles.td}>{b.user?.name || '-'}</td>
                  <td style={styles.td}>{b.provider?.name || '-'}</td>
                  <td style={styles.td}>₹{b.totalAmount}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{b.status}</span>
                  </td>
                  <td style={styles.td}>{new Date(b.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  nav: {
    backgroundColor: '#fff', padding: '14px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: 20, fontWeight: 700, color: '#1a56db', margin: 0 },
  navLinks: { display: 'flex', gap: 24 },
  navLink: { fontSize: 14, color: '#374151', textDecoration: 'none', fontWeight: 500 },
  navRight: { display: 'flex', alignItems: 'center', gap: 16 },
  adminName: { fontSize: 14, color: '#374151', fontWeight: 500 },
  logoutBtn: {
    padding: '7px 16px', backgroundColor: '#ef4444', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 28 },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20, marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16,
  },
  statEmoji: { fontSize: 36 },
  statLabel: { fontSize: 13, color: '#6b7280', margin: '0 0 4px 0' },
  statValue: { fontSize: 28, fontWeight: 700, margin: 0 },
  section: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 16 },
  statusGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  statusCard: {
    backgroundColor: '#f3f4f6', borderRadius: 8, padding: '12px 20px', textAlign: 'center',
  },
  statusLabel: { fontSize: 12, color: '#6b7280', margin: '0 0 4px 0', fontWeight: 600 },
  statusCount: { fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '10px 12px', fontSize: 13,
    fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '12px 12px', fontSize: 14, color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  },
  badge: {
    padding: '3px 10px', borderRadius: 20, fontSize: 11,
    fontWeight: 600, backgroundColor: '#eff6ff', color: '#1a56db',
  },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
};

export default AdminDashboard;