import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getProviderById } from "../../services/providersService";

interface Service {
  id: string;
  price: number;
  service: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
  };
}

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  rating: number;
  isVerified: boolean;
  services: Service[];
}

const ProviderProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId") || "";

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderById(id as string);
        setProvider(data);
      } catch {
        setError("Provider not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.center}>Loading provider...</div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.center}>{error || "Provider not found"}</div>
      </div>
    );
  }

  const displayServices = serviceId
    ? provider.services?.filter((s) => s.service?.id === serviceId)
    : provider.services;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarLarge}>{provider.name.charAt(0)}</div>

          <div style={styles.profileInfo}>
            <div style={styles.nameRow}>
              <h1 style={styles.name}>{provider.name}</h1>
              {provider.isVerified && (
                <span style={styles.verified}>✓ Verified</span>
              )}
            </div>

            <div style={styles.rating}>
              {"★".repeat(Math.round(provider.rating))}
              {"☆".repeat(5 - Math.round(provider.rating))}
              <span style={styles.ratingNum}>{provider.rating.toFixed(1)}</span>
            </div>

            <p style={styles.bio}>
              {provider.bio || "Professional service provider"}
            </p>

            <div style={styles.contactRow}>
              {provider.email && (
                <span style={styles.contact}>📧 {provider.email}</span>
              )}
              {provider.phone && (
                <span style={styles.contact}>📞 {provider.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Services */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Services Offered</h2>

          {!displayServices || displayServices.length === 0 ? (
            <p style={styles.empty}>No services listed</p>
          ) : (
            <div style={styles.servicesGrid}>
              {displayServices.map((ps) => (
                <div key={ps.id} style={styles.serviceCard}>
                  <div style={styles.serviceHeader}>
                    <h3 style={styles.serviceName}>{ps.service?.name}</h3>
                    <span style={styles.price}>₹{ps.price}</span>
                  </div>

                  {ps.service?.description && (
                    <p style={styles.serviceDesc}>{ps.service.description}</p>
                  )}

                  <button
                    style={styles.bookBtn}
                    onClick={() =>
                      navigate(
                        `/book?providerId=${provider.id}&serviceId=${ps.service?.id}`,
                      )
                    }
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "32px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: 15,
    marginBottom: 20,
    padding: 0,
  },
  profileCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    display: "flex",
    gap: 28,
    marginBottom: 28,
    alignItems: "flex-start",
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: 700,
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  name: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
  },
  verified: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 13,
  },
  rating: {
    color: "orange",
    fontSize: 18,
    marginBottom: 8,
  },
  ratingNum: {
    color: "#6b7280",
    fontSize: 14,
    marginLeft: 6,
  },
  bio: {
    color: "#374151",
    marginBottom: 12,
    lineHeight: 1.6,
  },
  contactRow: {
    display: "flex",
    gap: 20,
  },
  contact: {
    color: "#6b7280",
    fontSize: 14,
  },
  section: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
  },
  empty: {
    color: "#6b7280",
    textAlign: "center",
    padding: 30,
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },
  serviceCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
  },
  serviceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  price: {
    color: "#2563eb",
    fontWeight: 700,
    fontSize: 16,
  },
  serviceDesc: {
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 14,
  },
  bookBtn: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default ProviderProfilePage;
