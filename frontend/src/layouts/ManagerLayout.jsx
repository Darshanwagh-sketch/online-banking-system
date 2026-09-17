import React from 'react';
import Navbar from '../components/Navbar';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, BarChart3, Users, History, AlertTriangle } from 'lucide-react';

const ManagerLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isManagerOrAdmin = currentUser.roles.some(r => ['MANAGER', 'ADMIN'].includes(r));
  if (!isManagerOrAdmin) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  const navItems = [
    { path: '/manager/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { path: '/manager/approvals', label: 'High-Value Approvals', icon: CheckSquare },
    { path: '/manager/reports', label: 'Financial Reports', icon: BarChart3 },
    { path: '/staff/customers', label: 'Customer Directory', icon: Users },
    { path: '/staff/transactions', label: 'System Ledger', icon: History },
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
            Manager Control
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
                  color: isActive ? '#6C5CE7' : '#94A3B8',
                  background: isActive ? 'rgba(108, 92, 231, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(108, 92, 231, 0.3)' : '1px solid transparent',
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

export default ManagerLayout;
