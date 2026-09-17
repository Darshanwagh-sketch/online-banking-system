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
      background: '#151D36',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      flexShrink: 0
    }}>
      <div style={{ padding: '0 0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? '#3A86FF' : '#94A3B8',
              background: isActive ? 'rgba(58, 134, 255, 0.12)' : 'transparent',
              border: isActive ? '1px solid rgba(58, 134, 255, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar;
