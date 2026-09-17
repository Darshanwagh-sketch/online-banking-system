import React from 'react';
import Navbar from '../components/Navbar';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, History, LifeBuoy, AlertTriangle } from 'lucide-react';

const StaffLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isStaffOrAbove = currentUser.roles.some(r => ['STAFF', 'MANAGER', 'ADMIN'].includes(r));
  if (!isStaffOrAbove) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  const navItems = [
    { path: '/staff/dashboard', label: 'Staff Overview', icon: LayoutDashboard },
    { path: '/staff/customers', label: 'Customers', icon: Users },
    { path: '/staff/accounts', label: 'Account Controls', icon: CreditCard },
    { path: '/staff/transactions', label: 'System Ledger', icon: History },
    { path: '/staff/support', label: 'Ticket Resolution', icon: LifeBuoy },
    { path: '/staff/alerts', label: 'Suspicious Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
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
            Staff Management
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
                  color: isActive ? '#00F5D4' : '#94A3B8',
                  background: isActive ? 'rgba(0, 245, 212, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 245, 212, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </aside>

        <main className="main-content">
          <div className="page-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
