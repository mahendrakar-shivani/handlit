import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const ProviderRegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/providers/register', form);
      localStorage.setItem('providerToken', res.data.token);
      localStorage.setItem('provider', JSON.stringify(res.data.provider));
      navigate('/provider/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Handlit</h1>
        <h2 style={styles.subtitle}>Register as Provider</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name',        name: 'name',     type: 'text',     placeholder: 'Your business name' },
            { label: 'Email',            name: 'email',    type: 'email',    placeholder: 'you@email.com' },
            { label: 'Phone',            name: 'phone',    type: 'tel',      placeholder: '+91 9999999999' },
            { label: 'Password',         name: 'password', type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div style={styles.field} key={field.name}>
              <label style={styles.label}>{field.label}</label>
              <input
                style={styles.input}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required={field.name !== 'phone'}
              />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Bio (optional)</label>
            <textarea
              style={styles.textarea}
              name="bio"
              placeholder="Describe your experience and services..."
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register as Provider'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/provider/login" style={styles.link}>Sign in</Link>
        </p>
        <p style={styles.footer}>
          Are you a customer?{' '}
          <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: '#fff', padding: 40, borderRadius: 12,
    width: '100%', maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
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
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
  },
  button: {
    width: '100%', padding: '12px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8,
  },
  link: { color: '#1a56db', textDecoration: 'none', fontSize: 14 },
  footer: { textAlign: 'center', marginTop: 12, fontSize: 14, color: '#6b7280' },
};

export default ProviderRegisterPage;