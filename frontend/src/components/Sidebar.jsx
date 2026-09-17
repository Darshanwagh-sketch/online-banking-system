import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Users, History, Bell, LifeBuoy, User } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/customer/transfer', label: 'Transfer Money', icon: ArrowRightLeft },
    { path: '/customer/beneficiaries', label: 'Beneficiaries', icon: Users },
    { path: '/customer/transactions', label: 'Transactions', icon: History },
    { path: '/customer/notifications', label: 'Notifications', icon: Bell },
    { path: '/customer/support', label: 'Support & Tickets', icon: LifeBuoy },
    { path: '/customer/profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.75rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      flexShrink: 0
    }}>
      <div style={{
        padding: '0 0.75rem 0.85rem',
        fontSize: '0.72rem',
        fontWeight: 800,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: '1.2px'
      }}>
        Banking Menu
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.9rem',
              padding: '0.85rem 1.1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '0.92rem',
              fontWeight: isActive ? 700 : 600,
              color: isActive ? '#00F5D4' : '#94A3B8',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(58, 134, 255, 0.2) 0%, rgba(0, 245, 212, 0.12) 100%)' 
                : 'transparent',
              border: isActive ? '1px solid rgba(0, 245, 212, 0.4)' : '1px solid transparent',
              boxShadow: isActive ? '0 0 15px rgba(58, 134, 255, 0.2)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            })}
            className="sidebar-item"
          >
            {({ isActive }) => (
              <>
                <Icon size={19} color={isActive ? '#00F5D4' : '#94A3B8'} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;

