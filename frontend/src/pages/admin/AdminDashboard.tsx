import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getStats } from "../../services/adminService";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;

  recentBookings: {
    id: string;
    status: string;
    totalAmount: number;
    user: {
      name: string;
    };
    service: {
      name: string;
    };
  }[];

  bookingsByStatus: {
    status: string;
    _count: {
      status: number;
    };
  }[];
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={styles.center}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Handlit Admin</h1>

        <div style={styles.navLinks}>
          <Link style={styles.navLink} to="/admin">
            Dashboard
          </Link>

          <Link style={styles.navLink} to="/admin/users">
            Users
          </Link>

          <Link style={styles.navLink} to="/admin/providers">
            Providers
          </Link>

          <Link style={styles.navLink} to="/admin/bookings">
            Bookings
          </Link>
        </div>

        <div style={styles.right}>
          <span>{user?.name || "Admin"}</span>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <h2 style={styles.heading}>
          Dashboard Overview
        </h2>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>👥 Users</h3>
            <h1>{stats?.totalUsers ?? 0}</h1>
          </div>

          <div style={styles.card}>
            <h3>👷 Providers</h3>
            <h1>{stats?.totalProviders ?? 0}</h1>
          </div>

          <div style={styles.card}>
            <h3>📋 Bookings</h3>
            <h1>{stats?.totalBookings ?? 0}</h1>
          </div>

          <div style={styles.card}>
            <h3>💰 Revenue</h3>
            <h1>₹{stats?.totalRevenue ?? 0}</h1>
          </div>
        </div>

        <div style={styles.bottomGrid}>
          <div style={styles.section}>
            <h2>Recent Bookings</h2>

            {stats?.recentBookings?.length ? (
              stats.recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={styles.booking}
                >
                  <strong>
                    {booking.service.name}
                  </strong>

                  <p>
                    Customer:
                    {" "}
                    {booking.user.name}
                  </p>

                  <p>
                    ₹{booking.totalAmount}
                  </p>

                  <p>
                    {booking.status}
                  </p>
                </div>
              ))
            ) : (
              <p>No bookings found</p>
            )}
          </div>

          <div style={styles.section}>
            <h2>Booking Status</h2>

            {stats?.bookingsByStatus?.length ? (
              stats.bookingsByStatus.map(
                (item) => (
                  <div
                    key={item.status}
                    style={styles.status}
                  >
                    <span>{item.status}</span>

                    <strong>
                      {item._count.status}
                    </strong>
                  </div>
                )
              )
            ) : (
              <p>No data found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "white",
    boxShadow: "0 1px 5px rgba(0,0,0,.1)",
  },

  logo: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: "24px",
  },

  navLinks: {
    display: "flex",
    gap: "20px",
  },

  navLink: {
    textDecoration: "none",
    color: "#374151",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  container: {
    padding: "30px",
  },

  heading: {
    marginBottom: "25px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "30px",
  },

  section: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
  },

  booking: {
    borderBottom: "1px solid #eee",
    padding: "10px",
  },

  status: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },

  center: {
    padding: "60px",
    textAlign: "center",
  },
};

export default AdminDashboard;