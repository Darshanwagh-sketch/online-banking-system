import React from 'react';
import Navbar from '../components/Navbar';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Shield, FileSpreadsheet, Settings } from 'lucide-react';

const AdminLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = currentUser.roles.includes('ADMIN');
  if (!isAdmin) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'Admin Command Center', icon: ShieldAlert },
    { path: '/admin/users', label: 'User & Role Control', icon: Users },
    { path: '/admin/audit-logs', label: 'Audit Log Inspector', icon: FileSpreadsheet },
    { path: '/admin/settings', label: 'System Settings', icon: Settings },
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
          <div style={{ padding: '0 0.75rem 1rem', fontSize: '0.75rem', fontWeight: 800, color: '#FF7675', textTransform: 'uppercase', letterSpacing: '1px' }}>
            System Administration
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
                  color: isActive ? '#FF7675' : '#94A3B8',
                  background: isActive ? 'rgba(255, 118, 117, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 118, 117, 0.3)' : '1px solid transparent',
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

export default AdminLayout;
