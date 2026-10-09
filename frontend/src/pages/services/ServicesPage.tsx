import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getServices, getCategories } from '../../services/servicesService';

interface Category {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: Category;
}

const ServicesPage = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getServices({
          categoryId: selectedCategory || undefined,
          search: search || undefined,
        });
        if (!cancelled) {
          if (Array.isArray(data)) {
            setServices(data);
          } else if (data && Array.isArray(data.services)) {
            setServices(data.services);
          } else {
            setServices([]);
          }
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setServices([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, search]);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>Our Services</h1>
        <p style={styles.sub}>Find the right service for your needs</p>

        <div style={styles.filters}>
          <input
            style={styles.searchInput}
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={styles.select}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={styles.center}>Loading services...</div>
        ) : services.length === 0 ? (
          <div style={styles.center}>No services found</div>
        ) : (
          <div style={styles.grid}>
            {services.map((service) => (
              <div key={service.id} style={styles.card}>
                <div style={styles.categoryBadge}>
                  {service.category?.name}
                </div>
                <h3 style={styles.cardTitle}>{service.name}</h3>
                <p style={styles.cardDesc}>
                  {service.description || 'Professional service at your doorstep'}
                </p>
                <div style={styles.cardFooter}>
                  <span style={styles.price}>₹{service.basePrice}</span>
                  <button
                    style={styles.bookBtn}
                    onClick={() => navigate(`/providers?serviceId=${service.id}`)}
                  >
                    Find Providers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 4 },
  sub: { fontSize: 15, color: '#6b7280', marginBottom: 28 },
  filters: { display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  searchInput: {
    flex: 1, minWidth: 200, padding: '10px 16px',
    borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, outline: 'none',
  },
  select: {
    padding: '10px 16px', borderRadius: 8, border: '1px solid #d1d5db',
    fontSize: 14, outline: 'none', backgroundColor: '#fff', cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 24,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  categoryBadge: {
    display: 'inline-block', padding: '4px 10px',
    backgroundColor: '#eff6ff', color: '#1a56db',
    borderRadius: 20, fontSize: 12, fontWeight: 600, alignSelf: 'flex-start',
  },
  cardTitle: { fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 },
  cardDesc: { fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.5 },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  price: { fontSize: 20, fontWeight: 700, color: '#1a56db' },
  bookBtn: {
    padding: '8px 18px', backgroundColor: '#1a56db', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
};

export default ServicesPage;