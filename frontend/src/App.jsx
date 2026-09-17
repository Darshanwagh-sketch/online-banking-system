import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Customer Components
import CustomerLayout from './layouts/CustomerLayout';
import Dashboard from './pages/Customer/Dashboard';
import Transfer from './pages/Customer/Transfer';
import Beneficiaries from './pages/Customer/Beneficiaries';
import Transactions from './pages/Customer/Transactions';
import Notifications from './pages/Customer/Notifications';
import Support from './pages/Customer/Support';
import Profile from './pages/Customer/Profile';

// Staff Components
import StaffLayout from './layouts/StaffLayout';
import StaffDashboard from './pages/Staff/StaffDashboard';
import CustomerList from './pages/Staff/CustomerList';
import AccountManagement from './pages/Staff/AccountManagement';
import StaffTransactions from './pages/Staff/StaffTransactions';
import StaffSupport from './pages/Staff/StaffSupport';
import StaffAlerts from './pages/Staff/StaffAlerts';

// Manager Components
import ManagerLayout from './layouts/ManagerLayout';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import HighValueApprovals from './pages/Manager/HighValueApprovals';
import ManagerReports from './pages/Manager/ManagerReports';

// Admin Components
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import AuditLogs from './pages/Admin/AuditLogs';
import SystemSettings from './pages/Admin/SystemSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Portal Protected Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="beneficiaries" element={<Beneficiaries />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Staff Portal Protected Routes */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="transactions" element={<StaffTransactions />} />
            <Route path="support" element={<StaffSupport />} />
            <Route path="alerts" element={<StaffAlerts />} />
          </Route>

          {/* Manager Portal Protected Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="approvals" element={<HighValueApprovals />} />
            <Route path="reports" element={<ManagerReports />} />
          </Route>

          {/* Admin Portal Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
