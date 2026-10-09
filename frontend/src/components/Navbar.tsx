import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Handlit</Link>
      <div style={styles.links}>
        <Link to="/"             style={isActive('/')              ? styles.activeLink : styles.link}>Home</Link>
        <Link to="/services"     style={isActive('/services')      ? styles.activeLink : styles.link}>Services</Link>
        <Link to="/providers"    style={isActive('/providers')     ? styles.activeLink : styles.link}>Providers</Link>
        <Link to="/my-bookings"  style={isActive('/my-bookings')   ? styles.activeLink : styles.link}>My Bookings</Link>
        <Link to="/notifications"style={isActive('/notifications') ? styles.activeLink : styles.link}>Notifications</Link>
        <Link to="/profile"      style={isActive('/profile')       ? styles.activeLink : styles.link}>Profile</Link>
      </div>
      <div style={styles.right}>
        <span style={styles.username}>{user?.name}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: '#fff',
    padding: '14px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: { fontSize: 22, fontWeight: 700, color: '#1a56db', textDecoration: 'none' },
  links: { display: 'flex', gap: 24 },
  link: { fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 },
  activeLink: { fontSize: 14, color: '#1a56db', textDecoration: 'none', fontWeight: 600 },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  username: { fontSize: 14, color: '#374151', fontWeight: 500 },
  logoutBtn: {
    padding: '7px 16px', backgroundColor: '#ef4444',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
};

export default Navbar;