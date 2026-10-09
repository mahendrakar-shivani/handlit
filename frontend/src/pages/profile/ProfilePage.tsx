import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/authService';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    setPwLoading(true);
    try {
      await changePassword({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setPwError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>My Profile</h1>

        {/* User Info Card */}
        <div style={styles.card}>
          <div style={styles.avatarRow}>
            <div style={styles.avatar}>{user?.name.charAt(0).toUpperCase()}</div>
            <div>
              <h2 style={styles.name}>{user?.name}</h2>
              <p style={styles.email}>{user?.email}</p>
              <span style={styles.roleBadge}>{user?.role}</span>
            </div>
          </div>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>User ID</span>
              <span style={styles.infoValue}>{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change Password</h2>
          {pwError && <div style={styles.error}>{pwError}</div>}
          {pwSuccess && <div style={styles.success}>{pwSuccess}</div>}
          <form onSubmit={handleChangePassword}>
            {[
              { label: 'Current Password', key: 'oldPassword' },
              { label: 'New Password',     key: 'newPassword' },
              { label: 'Confirm New Password', key: 'confirmPassword' },
            ].map((f) => (
              <div style={styles.field} key={f.key}>
                <label style={styles.label}>{f.label}</label>
                <input
                  style={styles.input}
                  type="password"
                  value={pwForm[f.key as keyof typeof pwForm]}
                  onChange={(e) => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                  required
                />
              </div>
            ))}
            <button style={styles.submitBtn} type="submit" disabled={pwLoading}>
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 640, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 24 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 28,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20,
  },
  avatarRow: { display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 64, height: 64, borderRadius: '50%',
    backgroundColor: '#1a56db', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, fontWeight: 700, flexShrink: 0,
  },
  name: { fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px 0' },
  email: { fontSize: 14, color: '#6b7280', margin: '0 0 8px 0' },
  roleBadge: {
    display: 'inline-block', padding: '3px 10px',
    backgroundColor: '#eff6ff', color: '#1a56db',
    borderRadius: 20, fontSize: 12, fontWeight: 600,
  },
  infoGrid: { borderTop: '1px solid #f3f4f6', paddingTop: 16 },
  infoItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  infoLabel: { fontSize: 12, color: '#9ca3af', fontWeight: 500 },
  infoValue: { fontSize: 13, color: '#374151', wordBreak: 'break-all' },
  cardTitle: { fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 20 },
  error: {
    backgroundColor: '#fee2e2', color: '#dc2626',
    padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14,
  },
  success: {
    backgroundColor: '#d1fae5', color: '#065f46',
    padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14,
  },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%', padding: '12px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  logoutBtn: {
    width: '100%', padding: '12px', backgroundColor: '#fee2e2',
    color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
};

export default ProfilePage;