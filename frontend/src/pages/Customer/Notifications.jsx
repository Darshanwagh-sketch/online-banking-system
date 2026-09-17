import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { Bell, Check, ShieldAlert, CreditCard } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Security & Account Notifications</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Real-time updates regarding your transactions and account events.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            No notifications at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="card" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: n.readStatus ? '1px solid rgba(255,255,255,0.08)' : '4px solid #3A86FF',
              background: n.readStatus ? 'var(--bg-card)' : 'var(--bg-card-hover)'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background: n.type === 'SECURITY' ? 'rgba(255, 118, 117, 0.15)' : 'rgba(58, 134, 255, 0.15)',
                  color: n.type === 'SECURITY' ? '#FF7675' : '#3A86FF'
                }}>
                  {n.type === 'SECURITY' ? <ShieldAlert size={20} /> : <CreditCard size={20} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.25rem' }}>{n.title}</h4>
                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '0.5rem' }}>{n.message}</p>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {!n.readStatus && (
                <button onClick={() => handleMarkRead(n.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  <Check size={14} /> Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
