import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerLayout = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
        <Sidebar />
        <main className="main-content">
          <div className="page-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
