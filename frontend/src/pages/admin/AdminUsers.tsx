import { useState, useEffect,} from 'react';
import { Link } from 'react-router-dom';
import { getAdminUsers, banUser } from '../../services/adminService';

interface User {
  id: string; name: string; email: string;
  phone: string; role: string; createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAdminUsers(page);
        setUsers(data.users);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, refresh]);

  const handleBan = async (id: string, name: string) => {
    if (!confirm(`Ban user ${name}?`)) return;
    try {
      await banUser(id);
      setRefresh(r => r + 1);
    } catch {
      alert('Could not ban user');
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Admin</h1>
        <div style={styles.navLinks}>
          <Link to="/admin"           style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/users"     style={{ ...styles.navLink, color: '#1a56db', fontWeight: 700 }}>Users</Link>
          <Link to="/admin/providers" style={styles.navLink}>Providers</Link>
          <Link to="/admin/bookings"  style={styles.navLink}>Bookings</Link>
        </div>
      </nav>
      <div style={styles.container}>
        <h2 style={styles.heading}>Users ({total})</h2>
        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>{['Name', 'Email', 'Phone', 'Role', 'Joined', 'Action'].map((h) => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phone || '—'}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: user.role === 'ADMIN' ? '#fef3c7' : '#eff6ff', color: user.role === 'ADMIN' ? '#92400e' : '#1a56db' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      {user.role !== 'ADMIN' && <button style={styles.banBtn} onClick={() => handleBan(user.id, user.name)}>Ban</button>}
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
          <button style={styles.pageBtn} disabled={users.length < 10} onClick={() => setPage(page + 1)}>Next →</button>
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
  banBtn: { padding: '5px 14px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 24 },
  pageBtn: { padding: '8px 20px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  pageInfo: { fontSize: 14, color: '#374151' },
  center: { textAlign: 'center', padding: 60, color: '#6b7280' },
};

export default AdminUsers;