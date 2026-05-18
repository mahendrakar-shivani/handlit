import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);

      if (res.data.user.role.toLowerCase() === 'admin') {
        window.location.href = '/admin'; // ✅ full reload so AuthContext reads fresh localStorage
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Handlit</h1>
        <h2 style={styles.subtitle}>Welcome back</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot password?
            </Link>
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff', padding: 40,
    borderRadius: 12, width: '100%', maxWidth: 420,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: { fontSize: 28, fontWeight: 700, color: '#1a56db', marginBottom: 4 },
  subtitle: { fontSize: 18, fontWeight: 500, color: '#374151', marginBottom: 24 },
  error: {
    backgroundColor: '#fee2e2', color: '#dc2626',
    padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14,
  },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '12px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  link: { color: '#1a56db', textDecoration: 'none', fontSize: 14 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
};

export default LoginPage;