import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Handlit</h1>
        <h2 style={styles.subtitle}>Forgot Password</h2>
        <p style={styles.desc}>Enter your email and we'll send you a reset link.</p>
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p style={styles.footer}>
          <Link to="/login" style={styles.link}>← Back to login</Link>
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
  subtitle: { fontSize: 18, fontWeight: 500, color: '#374151', marginBottom: 8 },
  desc: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
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
  button: {
    width: '100%', padding: '12px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  link: { color: '#1a56db', textDecoration: 'none', fontSize: 14 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
};

export default ForgotPasswordPage;