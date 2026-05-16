import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getProviderById, getProviderReviews } from '../../services/providersService';

interface ProviderService {
  id: string; price: number;
  service: { id: string; name: string; description: string; };
}
interface Review {
  id: string; rating: number; comment: string; createdAt: string;
  user: { name: string; };
}
interface Provider {
  id: string; name: string; email: string; phone: string;
  bio: string; rating: number; isVerified: boolean;
  services: ProviderService[];
}

const ProviderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getProviderById(id),
      getProviderReviews(id),
    ])
      .then(([providerData, reviewsData]) => {
        setProvider(providerData);
        setReviews(reviewsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.page}><Navbar /><div style={styles.center}>Loading...</div></div>;
  if (!provider) return <div style={styles.page}><Navbar /><div style={styles.center}>Provider not found</div></div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        {/* Provider Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>{provider.name.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.nameRow}>
              <h1 style={styles.name}>{provider.name}</h1>
              {provider.isVerified && <span style={styles.verified}>✓ Verified</span>}
            </div>
            <div style={styles.rating}>
              {'★'.repeat(Math.round(provider.rating))}
              {'☆'.repeat(5 - Math.round(provider.rating))}
              <span style={styles.ratingNum}> {provider.rating.toFixed(1)}</span>
            </div>
            <p style={styles.bio}>{provider.bio || 'Professional service provider'}</p>
            <p style={styles.contact}>📧 {provider.email} {provider.phone && `  📞 ${provider.phone}`}</p>
          </div>
        </div>

        {/* Services */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Services Offered</h2>
          {provider.services.length === 0 ? (
            <p style={styles.empty}>No services listed yet</p>
          ) : (
            <div style={styles.serviceGrid}>
              {provider.services.map((ps) => (
                <div key={ps.id} style={{
                  ...styles.serviceCard,
                  ...(serviceId === ps.service.id ? styles.selectedService : {}),
                }}>
                  <h3 style={styles.serviceName}>{ps.service.name}</h3>
                  <p style={styles.serviceDesc}>{ps.service.description || 'Professional service'}</p>
                  <div style={styles.serviceFooter}>
                    <span style={styles.servicePrice}>₹{ps.price}</span>
                    <button
                      style={styles.bookBtn}
                      onClick={() => navigate(`/book?providerId=${provider.id}&serviceId=${ps.service.id}&price=${ps.price}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p style={styles.empty}>No reviews yet</p>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewUser}>{review.user.name}</span>
                    <span style={styles.reviewRating}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  {review.comment && <p style={styles.reviewComment}>{review.comment}</p>}
                  <span style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
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
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 900, margin: '0 auto', padding: '32px 24px' },
  header: {
    backgroundColor: '#fff', borderRadius: 12, padding: 32,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex',
    gap: 24, marginBottom: 28, alignItems: 'flex-start',
  },
  avatar: {
    width: 72, height: 72, borderRadius: '50%',
    backgroundColor: '#1a56db', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, fontWeight: 700, flexShrink: 0,
  },
  nameRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 },
  name: { fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 },
  verified: {
    fontSize: 12, color: '#057a55', backgroundColor: '#d1fae5',
    padding: '3px 10px', borderRadius: 20, fontWeight: 600,
  },
  rating: { fontSize: 18, color: '#f59e0b', marginBottom: 8 },
  ratingNum: { fontSize: 14, color: '#6b7280' },
  bio: { fontSize: 15, color: '#374151', margin: '0 0 8px 0' },
  contact: { fontSize: 13, color: '#6b7280', margin: 0 },
  section: {
    backgroundColor: '#fff', borderRadius: 12, padding: 28,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24,
  },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 20 },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16,
  },
  serviceCard: {
    border: '1px solid #e5e7eb', borderRadius: 10, padding: 20,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  selectedService: { border: '2px solid #1a56db', backgroundColor: '#eff6ff' },
  serviceName: { fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 },
  serviceDesc: { fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 },
  serviceFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  servicePrice: { fontSize: 18, fontWeight: 700, color: '#1a56db' },
  bookBtn: {
    padding: '7px 16px', backgroundColor: '#1a56db',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  reviewCard: {
    border: '1px solid #e5e7eb', borderRadius: 10, padding: 16,
  },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  reviewUser: { fontWeight: 600, color: '#111827', fontSize: 14 },
  reviewRating: { color: '#f59e0b', fontSize: 14 },
  reviewComment: { fontSize: 14, color: '#374151', margin: '0 0 8px 0' },
  reviewDate: { fontSize: 12, color: '#9ca3af' },
  empty: { color: '#6b7280', fontSize: 14 },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
};

export default ProviderDetailPage;