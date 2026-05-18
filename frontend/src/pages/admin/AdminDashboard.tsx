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
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    user: { name: string };
    provider: { name: string };
    service: { name: string };
  }[];
  bookingsByStatus: {
    status: string;
    _count: { status: number };
  }[];
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
  }, []); // ✅ runs once on mount, no redirect logic here

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={styles.center}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Admin</h1>
        <div style={styles.navLinks}>
          <Link to="/admin" style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/users" style={styles.navLink}>Users</Link>
          <Link to="/admin/providers" style={styles.navLink}>Providers</Link>
          <Link to="/admin/bookings" style={styles.navLink}>Bookings</Link>
        </div>
        <div style={styles.navRight}>
          <span style={styles.adminName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>Dashboard Overview</h2>
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Users',     value: stats?.totalUsers,             color: '#1a56db', emoji: '👥' },
            { label: 'Total Providers', value: stats?.totalProviders,         color: '#057a55', emoji: '👷' },
            { label: 'Total Bookings',  value: stats?.totalBookings,          color: '#92400e', emoji: '📋' },
            { label: 'Total Revenue',   value: `₹${stats?.totalRevenue}`,     color: '#7e3af2', emoji: '💰' },
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
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  nav: {
    backgroundColor: '#fff', padding: '14px 32px', display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100,
  },
  logo:      { fontSize: 20, fontWeight: 700, color: '#1a56db', margin: 0 },
  navLinks:  { display: 'flex', gap: 24 },
  navLink:   { fontSize: 14, color: '#374151', textDecoration: 'none', fontWeight: 500 },
  navRight:  { display: 'flex', alignItems: 'center', gap: 16 },
  adminName: { fontSize: 14, color: '#374151', fontWeight: 500 },
  logoutBtn: {
    padding: '7px 16px', backgroundColor: '#ef4444', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer',
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  heading:   { fontSize: 26, fontWeight: 700, color: '#111827' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 },
  statCard:  { backgroundColor: '#fff', borderRadius: 12, padding: 24, display: 'flex', gap: 16 },
  statEmoji: { fontSize: 36 },
  statLabel: { fontSize: 13 },
  statValue: { fontSize: 28, fontWeight: 700 },
  center:    { textAlign: 'center', padding: 60, color: '#6b7280' },
};

export default AdminDashboard;