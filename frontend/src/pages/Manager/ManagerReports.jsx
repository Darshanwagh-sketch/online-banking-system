import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { BarChart3, PieChart, FileText } from 'lucide-react';

const ManagerReports = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await managerService.getAnalytics();
      if (res.success) setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Manager Financial Audit & Growth Reports</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>System financial volume distribution and operational report metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <BarChart3 color="#3A86FF" size={24} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Volume Breakdown</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                <span>Deposits (Inflow)</span>
                <span style={{ color: '#55E6C1', fontWeight: 700 }}>₹{analytics ? parseFloat(analytics.totalDepositVolume).toLocaleString('en-IN') : '0'}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: '#55E6C1' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#94A3B8', marginBottom: '0.25rem' }}>
                <span>Withdrawals (Outflow)</span>
                <span style={{ color: '#FF7675', fontWeight: 700 }}>₹{analytics ? parseFloat(analytics.totalWithdrawalVolume).toLocaleString('en-IN') : '0'}</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#FF7675' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <PieChart color="#00F5D4" size={24} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Account & Growth Stats</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: '#94A3B8' }}>Total Registered Customers:</span>
              <strong style={{ color: '#F8FAFC' }}>{analytics?.totalCustomers || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: '#94A3B8' }}>Total Active Accounts:</span>
              <strong style={{ color: '#F8FAFC' }}>{analytics?.totalAccounts || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: '#94A3B8' }}>Total Transactions Processed:</span>
              <strong style={{ color: '#F8FAFC' }}>{analytics?.totalTransactionsCount || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
