import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // IMPORTANT: NO /api here
      let endpoint = "/auth/login";

      if (role === "provider") {
        endpoint = "/providers/login";
      }

      if (role === "admin") {
        endpoint = "/admin/login";
      }

      const res = await api.post(endpoint, form);

      const user = res.data.user || res.data.provider || res.data.admin;

      const token = res.data.token;

      if (!token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      login(user, token);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "provider") {
        navigate("/provider");
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      console.log(err);

      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(error.response?.data?.message || "Login failed");
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
            <label style={styles.label}>Login As</label>

            <select
              style={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>

              <option value="provider">Provider</option>

              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>

            <input
              style={styles.input}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>

            <input
              style={styles.input}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },

  card: {
    width: "420px",
    background: "white",
    padding: "40px",
    borderRadius: "12px",
  },

  title: {
    color: "#1a56db",
  },

  subtitle: {
    marginBottom: 20,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    display: "block",
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#1a56db",
    border: "none",
    color: "white",
    borderRadius: "8px",
  },

  error: {
    background: "#fee2e2",
    padding: "10px",
    marginBottom: "15px",
    color: "red",
  },

  link: {
    color: "#1a56db",
  },

  footer: {
    marginTop: "20px",
    textAlign: "center",
  },
};

export default LoginPage;
