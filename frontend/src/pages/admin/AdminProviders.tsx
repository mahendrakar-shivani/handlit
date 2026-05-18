import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProviders, verifyProvider } from '../../services/adminService';

interface Provider {
  id: string; name: string; email: string;
  phone: string; rating: number; isVerified: boolean; createdAt: string;
}

const AdminProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAdminProviders(page);
        setProviders(data.providers);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, refresh]);

  const handleVerify = async (id: string, name: string) => {
    if (!confirm(`Verify provider ${name}?`)) return;
    try {
      await verifyProvider(id);
      setRefresh(r => r + 1);
    } catch {
      alert('Could not verify provider');
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Admin</h1>
        <div style={styles.navLinks}>
          <Link to="/admin"           style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/users"     style={styles.navLink}>Users</Link>
          <Link to="/admin/providers" style={{ ...styles.navLink, color: '#1a56db', fontWeight: 700 }}>Providers</Link>
          <Link to="/admin/bookings"  style={styles.navLink}>Bookings</Link>
        </div>
      </nav>
      <div style={styles.container}>
        <h2 style={styles.heading}>Providers ({total})</h2>
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>{['Name', 'Email', 'Phone', 'Rating', 'Status', 'Joined', 'Action'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.id}>
                    <td style={styles.td}>{provider.name}</td>
                    <td style={styles.td}>{provider.email}</td>
                    <td style={styles.td}>{provider.phone || '—'}</td>
                    <td style={styles.td}>⭐ {provider.rating.toFixed(1)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: provider.isVerified ? '#d1fae5' : '#fef3c7', color: provider.isVerified ? '#065f46' : '#92400e' }}>
                        {provider.isVerified ? '✓ Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(provider.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      {!provider.isVerified && <button style={styles.verifyBtn} onClick={() => handleVerify(provider.id, provider.name)}>Verify</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={styles.pagination}>
          <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
          <span style={styles.pageInfo}>Page {page}</span>
          <button style={styles.pageBtn} disabled={providers.length < 10} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  nav: { backgroundColor: '#fff', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 32, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontSize: 20, fontWeight: 700, color: '#1a56db', margin: 0 },
  navLinks: { display: 'flex', gap: 24 },
  navLink: { fontSize: 14, color: '#374151', textDecoration: 'none', fontWeight: 500 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 24 },
  tableWrap: { backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
  td: { padding: '12px 16px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 },
  verifyBtn: { padding: '5px 14px', backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 },
  pageBtn: { padding: '8px 20px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  pageInfo: { fontSize: 14, color: '#374151' },
  center: { textAlign: 'center', padding: 60, color: '#6b7280' },
};

export default AdminProviders;