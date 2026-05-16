import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getProviders } from '../../services/providersService';

interface Provider {
  id: string; name: string; email: string;
  phone: string; bio: string; rating: number; isVerified: boolean;
}

const ProvidersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const data = await getProviders({ search: search || undefined });
        if (!cancelled) setProviders(data.providers || []);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProviders();

    return () => {
      cancelled = true;
    };
  }, [search]);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Service Providers</h1>
        <p style={styles.sub}>Choose from our verified professionals</p>

        <div style={styles.filters}>
          <input
            style={styles.searchInput}
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={styles.center}>Loading providers...</div>
        ) : providers.length === 0 ? (
          <div style={styles.center}>No providers found</div>
        ) : (
          <div style={styles.grid}>
            {providers.map((provider) => (
              <div key={provider.id} style={styles.card}>
                <div style={styles.avatar}>
                  {provider.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.info}>
                  <div style={styles.nameRow}>
                    <h3 style={styles.name}>{provider.name}</h3>
                    {provider.isVerified && (
                      <span style={styles.verified}>✓ Verified</span>
                    )}
                  </div>
                  <div style={styles.rating}>
                    {'★'.repeat(Math.round(provider.rating))}
                    {'☆'.repeat(5 - Math.round(provider.rating))}
                    <span style={styles.ratingNum}> {provider.rating.toFixed(1)}</span>
                  </div>
                  <p style={styles.bio}>{provider.bio || 'Professional service provider'}</p>
                  <button
                    style={styles.viewBtn}
                    onClick={() =>
                      navigate(
                        `/providers/${provider.id}${searchParams.get('serviceId') ? `?serviceId=${searchParams.get('serviceId')}` : ''}`
                      )
                    }
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 },
  sub: { fontSize: 15, color: '#6b7280', marginBottom: 28 },
  filters: { marginBottom: 32 },
  searchInput: {
    width: '100%', maxWidth: 400, padding: '10px 16px',
    borderRadius: 8, border: '1px solid #d1d5db',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  },
  grid: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', gap: 20, alignItems: 'flex-start',
  },
  avatar: {
    width: 56, height: 56, borderRadius: '50%',
    backgroundColor: '#1a56db', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 700, flexShrink: 0,
  },
  info: { flex: 1 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 },
  name: { fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 },
  verified: {
    fontSize: 12, color: '#057a55', backgroundColor: '#d1fae5',
    padding: '2px 8px', borderRadius: 20, fontWeight: 600,
  },
  rating: { fontSize: 16, color: '#f59e0b', marginBottom: 8 },
  ratingNum: { fontSize: 13, color: '#6b7280' },
  bio: { fontSize: 14, color: '#6b7280', margin: '0 0 12px 0' },
  viewBtn: {
    padding: '8px 20px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
};

export default ProvidersPage;