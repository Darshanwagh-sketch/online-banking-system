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
      height: '74px',
      background: 'rgba(12, 12, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          padding: '0.4rem',
          borderRadius: '12px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldCheck size={26} color="#000000" />
        </div>
        <span style={{
          fontSize: '1.35rem',
          fontWeight: 900,
          letterSpacing: '-0.5px',
          color: '#FFFFFF',
          textTransform: 'uppercase'
        }}>
          Secure<span style={{ color: '#A1A1AA' }}>Bank</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        <Link 
          to="/customer/notifications" 
          style={{
            position: 'relative',
            color: '#FFFFFF',
            textDecoration: 'none',
            padding: '0.55rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          className="card-hover"
        >
          <Bell size={20} color="#FFFFFF" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#FFFFFF',
              color: '#000000',
              fontSize: '0.68rem',
              fontWeight: 900,
              minWidth: '20px',
              height: '20px',
              padding: '0 4px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.6)'
            }}>
              {unreadCount}
            </span>
          )}
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          paddingLeft: '1.25rem',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.05rem',
            color: '#000000',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
          }}>
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF' }}>{currentUser?.name}</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {currentUser?.roles?.[0]}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 0.85rem', marginLeft: '0.5rem' }} 
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


