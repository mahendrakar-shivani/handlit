import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={styles.logo}>Handlit</h1>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hello, {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div style={styles.content}>
        <h2 style={styles.heading}>Welcome to Handlit 👋</h2>
        <p style={styles.sub}>Your service provider platform is up and running.</p>
        <div style={styles.infoCard}>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>ID:</strong> {user?.id}</p>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  navbar: {
    backgroundColor: '#fff', padding: '16px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: 22, fontWeight: 700, color: '#1a56db', margin: 0 },
  navRight: { display: 'flex', alignItems: 'center', gap: 16 },
  welcome: { fontSize: 14, color: '#374151' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: '#ef4444',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 500, cursor: 'pointer',
  },
  content: { padding: 40 },
  heading: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 8 },
  sub: { fontSize: 15, color: '#6b7280', marginBottom: 24 },
  infoCard: {
    backgroundColor: '#fff', padding: 24, borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: 400,
    lineHeight: 2, fontSize: 14, color: '#374151',
  },
};

export default HomePage;