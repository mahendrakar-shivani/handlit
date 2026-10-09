import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import {
  getNotifications, markAsRead,
  markAllAsRead, deleteNotification
} from '../../services/notificationsService';

interface Notification {
  id: string; title: string; message: string;
  type: string; isRead: boolean; createdAt: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    getNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>
            Notifications {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </h1>
          {unreadCount > 0 && (
            <button style={styles.markAllBtn} onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.center}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={styles.center}>No notifications</div>
        ) : (
          <div style={styles.list}>
            {notifications.map((n) => (
              <div key={n.id} style={{ ...styles.card, ...(n.isRead ? {} : styles.unread) }}>
                <div style={styles.cardContent}>
                  <div>
                    <h3 style={styles.title}>{n.title}</h3>
                    <p style={styles.message}>{n.message}</p>
                    <span style={styles.time}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div style={styles.actions}>
                    {!n.isRead && (
                      <button style={styles.readBtn} onClick={() => handleMarkAsRead(n.id)}>
                        Mark read
                      </button>
                    )}
                    <button style={styles.deleteBtn} onClick={() => handleDelete(n.id)}>
                      Delete
                    </button>
                  </div>
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
  container: { maxWidth: 700, margin: '0 auto', padding: '32px 24px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heading: { fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 },
  badge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ef4444', color: '#fff',
    borderRadius: '50%', width: 24, height: 24,
    fontSize: 12, fontWeight: 700, marginLeft: 8,
  },
  markAllBtn: {
    padding: '8px 16px', backgroundColor: '#eff6ff', color: '#1a56db',
    border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 13,
    fontWeight: 600, cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  unread: { borderLeft: '4px solid #1a56db' },
  cardContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  title: { fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 4px 0' },
  message: { fontSize: 14, color: '#374151', margin: '0 0 6px 0' },
  time: { fontSize: 12, color: '#9ca3af' },
  actions: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
  readBtn: {
    padding: '5px 12px', backgroundColor: '#eff6ff', color: '#1a56db',
    border: '1px solid #bfdbfe', borderRadius: 6, fontSize: 12,
    fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  deleteBtn: {
    padding: '5px 12px', backgroundColor: '#fee2e2', color: '#dc2626',
    border: '1px solid #fca5a5', borderRadius: 6, fontSize: 12,
    fontWeight: 600, cursor: 'pointer',
  },
  center: { textAlign: 'center', padding: 60, color: '#6b7280', fontSize: 16 },
};

export default NotificationsPage;