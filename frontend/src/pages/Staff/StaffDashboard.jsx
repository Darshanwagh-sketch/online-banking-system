import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';
import { Users, CreditCard, AlertTriangle, ShieldCheck, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cRes, aRes, alRes, tRes] = await Promise.all([
        staffService.getCustomers(),
        staffService.getAccounts(),
        staffService.getAlerts(),
        staffService.getTickets()
      ]);
      if (cRes.success) setCustomers(cRes.data);
      if (aRes.success) setAccounts(aRes.data);
      if (alRes.success) setAlerts(alRes.data);
      if (tRes.success) setTickets(tRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const blockedAccountsCount = accounts.filter(a => a.status === 'BLOCKED').length;
  const openTicketsCount = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>Staff Operational Dashboard</h2>
        <p style={{ color: '#94A3B8', marginTop: '0.25rem' }}>Monitor customer accounts, process status updates, and audit alerts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Customers</span>
            <Users color="#3A86FF" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 0' }}>{customers.length}</div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Active Accounts</span>
            <CreditCard color="#00F5D4" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0 0' }}>{accounts.length}</div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Blocked Accounts</span>
            <ShieldCheck color="#FF7675" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FF7675', margin: '0.75rem 0 0' }}>{blockedAccountsCount}</div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Open Tickets</span>
            <LifeBuoy color="#FFEAA7" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFEAA7', margin: '0.75rem 0 0' }}>{openTicketsCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Customer Accounts</h3>
            <Link to="/staff/accounts" style={{ color: '#00F5D4', fontSize: '0.85rem', textDecoration: 'none' }}>Manage All</Link>
          </div>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Account No</th>
                  <th>Customer</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700, color: '#3A86FF' }}>{a.accountNumber}</td>
                    <td>{a.customerName}</td>
                    <td style={{ fontWeight: 700 }}>₹{parseFloat(a.balance).toFixed(2)}</td>
                    <td><span className={`badge ${a.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Open Support Desk Requests</h3>
            <Link to="/staff/support" style={{ color: '#00F5D4', fontSize: '0.85rem', textDecoration: 'none' }}>View Desk</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tickets.slice(0, 4).map(t => (
              <div key={t.id} style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC' }}>{t.subject}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>By {t.userName}</span>
                </div>
                <span className={`badge ${t.status === 'OPEN' ? 'badge-warning' : 'badge-success'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
