import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Browse Services',  path: '/services',     emoji: '🛠️', desc: 'Find the service you need' },
    { label: 'Find Providers',   path: '/providers',    emoji: '👷', desc: 'Browse verified professionals' },
    { label: 'My Bookings',      path: '/my-bookings',  emoji: '📋', desc: 'Track your bookings' },
    { label: 'Notifications',    path: '/notifications',emoji: '🔔', desc: 'Stay updated' },
  ];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Welcome back, {user?.name}! 👋</h1>
          <p style={styles.heroSub}>What would you like to do today?</p>
        </div>
        <div style={styles.grid}>
          {quickLinks.map((link) => (
            <div
              key={link.path}
              style={styles.card}
              onClick={() => navigate(link.path)}
            >
              <span style={styles.emoji}>{link.emoji}</span>
              <h3 style={styles.cardTitle}>{link.label}</h3>
              <p style={styles.cardDesc}>{link.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
  hero: { marginBottom: 40 },
  heroTitle: { fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 },
  heroSub: { fontSize: 16, color: '#6b7280' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 28,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer',
    transition: 'transform 0.1s',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  emoji: { fontSize: 36 },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 },
  cardDesc: { fontSize: 13, color: '#6b7280', margin: 0 },
};

export default HomePage;