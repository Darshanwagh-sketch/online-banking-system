import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, PlusCircle, ArrowRightLeft, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDesc, setWithdrawDesc] = useState('');
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (msg.text) {
      const timer = setTimeout(() => setMsg({ text: '', isError: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [accRes, txRes] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions(0, 5)
      ]);
      if (accRes.success) setAccounts(accRes.data);
      if (txRes.success) setTransactions(txRes.data.content || []);
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!accounts.length) return;
    try {
      const res = await transactionService.deposit(accounts[0].id, {
        amount: parseFloat(depositAmount),
        description: depositDesc || 'Simulated Cash Deposit'
      });
      if (res.success) {
        setMsg({ text: `Deposit successful! ₹${depositAmount} credited to your account.`, isError: false });
        setShowDepositModal(false);
        setDepositAmount('');
        setDepositDesc('');
        fetchDashboardData();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!accounts.length) return;
    try {
      const res = await transactionService.withdraw(accounts[0].id, {
        amount: parseFloat(withdrawAmount),
        description: withdrawDesc || 'Simulated ATM Withdrawal'
      });
      if (res.success) {
        setMsg({ text: `Withdrawal successful! ₹${withdrawAmount} debited.`, isError: false });
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setWithdrawDesc('');
        fetchDashboardData();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const primaryAccount = accounts[0] || {};
  const totalBalance = accounts.reduce((acc, a) => acc + (parseFloat(a.balance) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(28, 37, 65, 0.9) 0%, rgba(11, 19, 43, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '2.2rem',
        borderRadius: '24px',
        border: '1px solid rgba(58, 134, 255, 0.25)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(58, 134, 255, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-success">
              <span className="pulse-dot"></span> Live Cloud Sync
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>• Connected to Aiven PostgreSQL</span>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.5px' }}>
            Welcome back, {currentUser?.name}! 👋
          </h2>
          <p style={{ color: '#94A3B8', marginTop: '0.3rem', fontSize: '0.95rem' }}>
            Here is your live real-time financial portfolio overview.
          </p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary" disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} /> {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {msg.text && (
        <div style={{
          padding: '1.1rem 1.4rem',
          borderRadius: '14px',
          background: msg.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: msg.isError ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
          color: msg.isError ? '#F87171' : '#34D399',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <Zap size={20} />
          {msg.text}
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
        {/* Total Balance Card */}
        <div className="card card-hover glow-card" style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Total Net Balance
            </span>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(58, 134, 255, 0.15)' }}>
              <Wallet color="#3A86FF" size={24} />
            </div>
          </div>
          <div style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '1rem 0'
          }}>
            ₹ {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#34D399', fontWeight: 700 }}>
            <span className="pulse-dot"></span> Available in {accounts.length} active account(s)
          </div>
        </div>

        {/* Primary Account Card */}
        <div className="card card-hover glow-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Primary Account
            </span>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(0, 245, 212, 0.15)' }}>
              <CreditCard color="#00F5D4" size={24} />
            </div>
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F8FAFC', margin: '0.85rem 0 0.35rem', letterSpacing: '1px' }}>
            {primaryAccount.accountNumber || 'ACC-8849-XXXX'}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span>Type: <strong style={{ color: '#3A86FF' }}>{primaryAccount.accountType || 'SAVINGS'}</strong></span>
            <span>•</span>
            <span className="badge badge-success"><span className="pulse-dot"></span> {primaryAccount.status || 'ACTIVE'}</span>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="card glow-card" style={{ display: 'flex', flexDirection: 'column', justify: 'center', gap: '0.85rem' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Quick Actions
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <button onClick={() => setShowDepositModal(true)} className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
              <PlusCircle size={17} /> Deposit
            </button>

            <button onClick={() => setShowWithdrawModal(true)} className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
              <ArrowDownLeft size={17} /> Withdraw
            </button>

            <Link to="/customer/transfer" className="btn btn-secondary" style={{ fontSize: '0.88rem', gridColumn: 'span 2' }}>
              <ArrowRightLeft size={17} /> Transfer Funds
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#3A86FF" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>Recent Transactions</h3>
          </div>
          <Link to="/customer/transactions" style={{ color: '#00F5D4', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }} className="card-hover">
            View All →
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Party / Detail</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94A3B8', padding: '2.5rem' }}>
                    No transactions found. Deposit or transfer money to get started!
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 800, color: '#3A86FF', letterSpacing: '0.5px' }}>{tx.transactionReference}</td>
                    <td>
                      <span className={`badge ${tx.transactionType === 'DEPOSIT' ? 'badge-success' : tx.transactionType === 'WITHDRAWAL' ? 'badge-danger' : 'badge-warning'}`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{tx.description}</td>
                    <td style={{ fontWeight: 800, fontSize: '0.98rem', color: tx.transactionType === 'DEPOSIT' ? '#34D399' : '#F87171' }}>
                      {tx.transactionType === 'DEPOSIT' ? '+' : '-'} ₹{parseFloat(tx.amount).toFixed(2)}
                    </td>
                    <td><span className="badge badge-success"><span className="pulse-dot"></span> {tx.status}</span></td>
                    <td style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600 }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: '#F8FAFC' }}>
              💰 Deposit Cash
            </h3>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" step="0.01" min="1" required className="form-input" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="e.g. 5000" />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Note</label>
                <input type="text" className="form-input" value={depositDesc} onChange={(e) => setDepositDesc(e.target.value)} placeholder="Cash deposit note" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Deposit</button>
                <button type="button" onClick={() => setShowDepositModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: '#F8FAFC' }}>
              🏧 Withdraw Cash
            </h3>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" step="0.01" min="1" required className="form-input" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="e.g. 2000" />
              </div>
              <div className="form-group">
                <label className="form-label">Description / Note</label>
                <input type="text" className="form-input" value={withdrawDesc} onChange={(e) => setWithdrawDesc(e.target.value)} placeholder="ATM Withdrawal note" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Withdrawal</button>
                <button type="button" onClick={() => setShowWithdrawModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

