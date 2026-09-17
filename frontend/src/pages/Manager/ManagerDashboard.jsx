import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { DollarSign, TrendingUp, CheckSquare, Users, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await managerService.getAnalytics();
      if (res.success) setAnalytics(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #1C2541 0%, #0B132B 100%)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>Manager Executive Analytics</h2>
        <p style={{ color: '#94A3B8', marginTop: '0.25rem' }}>High-value transfer rules, branch turnover, and compliance oversight.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Transaction Volume</span>
            <TrendingUp color="#3A86FF" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F8FAFC', margin: '0.75rem 0' }}>
            ₹{analytics ? parseFloat(analytics.totalTransactionVolume).toLocaleString('en-IN') : '0.00'}
          </div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending Approvals</span>
            <CheckSquare color="#FFEAA7" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFEAA7', margin: '0.75rem 0' }}>
            {analytics?.pendingApprovalsCount || 0}
          </div>
          <Link to="/manager/approvals" style={{ color: '#3A86FF', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Review pending transfers &rarr;</Link>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Cash Inflow (Deposits)</span>
            <ArrowUpRight color="#55E6C1" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#55E6C1', margin: '0.75rem 0' }}>
            ₹{analytics ? parseFloat(analytics.totalDepositVolume).toLocaleString('en-IN') : '0.00'}
          </div>
        </div>

        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Cash Outflow (Withdrawals)</span>
            <ArrowDownLeft color="#FF7675" size={24} />
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FF7675', margin: '0.75rem 0' }}>
            ₹{analytics ? parseFloat(analytics.totalWithdrawalVolume).toLocaleString('en-IN') : '0.00'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
