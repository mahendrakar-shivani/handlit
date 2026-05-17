import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getMyBookings, cancelBooking } from '../../services/bookingsService';
import { createOrder, verifyPayment } from '../../services/paymentsService';
import { createReview } from '../../services/reviewsService';

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  address: string;
  totalAmount: number;
  service: { name: string };
  provider: { id: string; name: string };
  payment?: { status: string };
  review?: { id: string };
}

interface RazorpayConstructor {
  new (options: object): { open: () => void };
}

const statusColors: Record<string, { bg: string; color: string }> = {
  PENDING:     { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:   { bg: '#d1fae5', color: '#065f46' },
  IN_PROGRESS: { bg: '#dbeafe', color: '#1e40af' },
  COMPLETED:   { bg: '#f0fdf4', color: '#166534' },
  CANCELLED:   { bg: '#fee2e2', color: '#991b1b' },
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    bookingId: string;
    providerId: string;
  } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const refetch = () => setRefresh((r) => r + 1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      setLoading(true);
      try {
        const data = await getMyBookings({ status: filter || undefined });
        if (!signal.aborted) setBookings(data.bookings || []);
      } catch (err) {
        if (!signal.aborted) console.error(err);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [filter, refresh]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      refetch();
    } catch {
      alert('Could not cancel booking');
    }
  };

  const handlePayment = async (booking: Booking) => {
    setProcessingId(booking.id);
    try {
      const order = await createOrder(booking.id);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Handlit',
        description: booking.service.name,
        order_id: order.id,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            alert('Payment successful!');
            refetch();
          } catch {
            alert('Payment verification failed');
          }
        },
        prefill: { name: 'Test User', email: 'test@handlit.com' },
        theme: { color: '#1a56db' },
      };
      const RazorpayClass = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const razorpay = new RazorpayClass(options);
      razorpay.open();
    } catch {
      alert('Could not initiate payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReview = async () => {
    if (!reviewModal) return;
    setReviewLoading(true);
    try {
      await createReview({
        bookingId: reviewModal.bookingId,
        providerId: reviewModal.providerId,
        rating,
        comment,
      });
      alert('Review submitted!');
      setReviewModal(null);
      setRating(5);
      setComment('');
      refetch();
    } catch {
      alert('Could not submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.heading}>My Bookings</h1>

        <div style={styles.filters}>
          {['', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              style={{ ...styles.filterBtn, ...(filter === s ? styles.activeFilter : {}) }}
              onClick={() => setFilter(s)}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.center}>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={styles.center}>No bookings found</div>
        ) : (
          <div style={styles.list}>
            {bookings.map((booking) => {
              const sc = statusColors[booking.status] || statusColors.PENDING;
              const isPaid = booking.payment?.status === 'SUCCESS';
              return (
                <div key={booking.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.serviceName}>{booking.service.name}</h3>
                      <p style={styles.providerName}>by {booking.provider.name}</p>
                    </div>
                    <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.color }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={styles.details}>
                    <span>📅 {new Date(booking.scheduledAt).toLocaleString()}</span>
                    <span>📍 {booking.address}</span>
                    <span>💰 ₹{booking.totalAmount}</span>
                    {isPaid && <span style={styles.paidBadge}>✅ Paid</span>}
                  </div>
                  <div style={styles.btnRow}>
                    {booking.status === 'PENDING' && !isPaid && (
                      <>
                        <button
                          style={styles.payBtn}
                          onClick={() => handlePayment(booking)}
                          disabled={processingId === booking.id}
                        >
                          {processingId === booking.id ? 'Processing...' : '💳 Pay Now'}
                        </button>
                        <button style={styles.cancelBtn} onClick={() => handleCancel(booking.id)}>
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'COMPLETED' && !booking.review && (
                      <button
                        style={styles.reviewBtn}
                        onClick={() => setReviewModal({ bookingId: booking.id, providerId: booking.provider.id })}
                      >
                        ⭐ Write Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Write a Review</h2>
            <div style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ fontSize: 32, cursor: 'pointer', color: star <= rating ? '#f59e0b' : '#d1d5db' }}
                  onClick={() => setRating(star)}
                >★</span>
              ))}
            </div>
            <textarea
              style={styles.reviewInput}
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div style={styles.modalBtns}>
              <button style={styles.cancelBtn} onClick={() => setReviewModal(null)}>Cancel</button>
              <button style={styles.payBtn} onClick={handleReview} disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
  container: { maxWidth: 800, margin: '0 auto', padding: '32px 24px' },
  heading: { fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 24 },
  filters: { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
  filterBtn: {
    padding: '7px 16px', borderRadius: 20, border: '1px solid #d1d5db',
    backgroundColor: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 500, color: '#374151',
  },
  activeFilter: { backgroundColor: '#1a56db', color: '#fff', border: '1px solid #1a56db' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  serviceName: { fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 4px 0' },
  providerName: { fontSize: 14, color: '#6b7280', margin: 0 },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  details: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#374151' },
  paidBadge: { color: '#057a55', fontWeight: 600, fontSize: 13 },
  btnRow: { display: 'flex', gap: 12, marginTop: 16 },
  payBtn: {
    padding: '9px 24px', backgroundColor: '#1a56db', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '9px 20px', backgroundColor: '#fee2e2', color: '#dc2626',
    border: '1px solid #fca5a5', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  reviewBtn: {
    padding: '9px 20px', backgroundColor: '#fef3c7', color: '#92400e',
    border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: 16, padding: 32,
    width: '100%', maxWidth: 440, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 20 },
  ratingRow: { display: 'flex', gap: 8, marginBottom: 16 },
  reviewInput: {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db',
    fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical',
  },
  modalBtns: { display: 'flex', gap: 12, marginTop: 20 },
};

export default MyBookingsPage;