import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { Bell, LogOut, ShieldCheck, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) setUnreadCount(res.data);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      height: '70px',
      background: '#1C2541',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck size={32} color="#3A86FF" />
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #3A86FF 0%, #00F5D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SecureBank
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/customer/notifications" style={{ position: 'relative', color: '#94A3B8', textDecoration: 'none' }}>
          <Bell size={22} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-8px',
              background: '#FF7675',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #3A86FF 0%, #00F5D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC' }}>{currentUser?.name}</span>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{currentUser?.roles?.[0]}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', marginLeft: '0.5rem' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
