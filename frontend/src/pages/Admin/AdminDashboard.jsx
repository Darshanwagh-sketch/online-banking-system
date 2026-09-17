import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ShieldCheck, Users, Lock, FileSpreadsheet, Server } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, lRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getAuditLogs()
      ]);
      if (uRes.success) setUsers(uRes.data);
      if (lRes.success) setLogs(lRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const customerCount = users.filter(u => u.roles.includes('CUSTOMER')).length;
  const staffCount = users.filter(u => u.roles.includes('STAFF')).length;
  const managerCount = users.filter(u => u.roles.includes('MANAGER')).length;
  const adminCount = users.filter(u => u.roles.includes('ADMIN')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #1C2541 0%, #0B132B 100%)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>System Admin Command Center</h2>
        <p style={{ color: '#94A3B8', marginTop: '0.25rem' }}>Global user administration, security audit monitoring, and system configuration.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total System Users</span>
            <Users color="#3A86FF" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 0' }}>{users.length}</div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Customers</span>
            <ShieldCheck color="#00F5D4" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#00F5D4', margin: '0.75rem 0 0' }}>{customerCount}</div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Staff & Managers</span>
            <Server color="#FFEAA7" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFEAA7', margin: '0.75rem 0 0' }}>{staffCount + managerCount}</div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Audit Entries</span>
            <FileSpreadsheet color="#FF7675" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FF7675', margin: '0.75rem 0 0' }}>{logs.length}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
