import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { accountService } from '../../services/accountService';
import { transactionService } from '../../services/transactionService';
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, PlusCircle, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchDashboardData = async () => {
    setLoading(true);
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
        setMsg({ text: 'Deposit successful! ₹' + depositAmount + ' credited.', isError: false });
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
        setMsg({ text: 'Withdrawal successful! ₹' + withdrawAmount + ' debited.', isError: false });
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
        background: 'linear-gradient(135deg, #1C2541 0%, #0B132B 100%)',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F8FAFC' }}>
            Welcome back, {currentUser?.name}!
          </h2>
          <p style={{ color: '#94A3B8', marginTop: '0.25rem', fontSize: '0.95rem' }}>
            Here is your live real-time financial portfolio overview.
          </p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {msg.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '10px',
          background: msg.isError ? 'rgba(255, 118, 117, 0.15)' : 'rgba(0, 184, 148, 0.15)',
          border: msg.isError ? '1px solid #ff7675' : '1px solid #55E6C1',
          color: msg.isError ? '#ff7675' : '#55E6C1',
          fontWeight: 600
        }}>
          {msg.text}
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Total Balance Card */}
        <div className="card card-hover" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Net Balance</span>
            <Wallet color="#3A86FF" size={24} />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F8FAFC', margin: '1rem 0' }}>
            ₹ {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#55E6C1', fontWeight: 600 }}>
            <span>Available in {accounts.length} active account(s)</span>
          </div>
        </div>

        {/* Primary Account Card */}
        <div className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Primary Account</span>
            <CreditCard color="#00F5D4" size={24} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', margin: '0.75rem 0 0.25rem' }}>
            {primaryAccount.accountNumber || 'Loading...'}
          </div>
          <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Type: <span style={{ color: '#3A86FF', fontWeight: 700 }}>{primaryAccount.accountType || 'SAVINGS'}</span> | Status: <span className="badge badge-success">{primaryAccount.status || 'ACTIVE'}</span>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justify: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Quick Actions</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button onClick={() => setShowDepositModal(true)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <PlusCircle size={16} /> Deposit
            </button>

            <button onClick={() => setShowWithdrawModal(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <ArrowDownLeft size={16} /> Withdraw
            </button>

            <Link to="/customer/transfer" className="btn btn-secondary" style={{ fontSize: '0.85rem', gridColumn: 'span 2' }}>
              <ArrowRightLeft size={16} /> Transfer Funds
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>Recent Transactions</h3>
          <Link to="/customer/transactions" style={{ color: '#3A86FF', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
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
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
                    No transactions found. Deposit or transfer money to get started!
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 700, color: '#3A86FF' }}>{tx.transactionReference}</td>
                    <td>
                      <span className={`badge ${tx.transactionType === 'DEPOSIT' ? 'badge-success' : tx.transactionType === 'WITHDRAWAL' ? 'badge-danger' : 'badge-warning'}`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    <td>{tx.description}</td>
                    <td style={{ fontWeight: 700, color: tx.transactionType === 'DEPOSIT' ? '#55E6C1' : '#FF7675' }}>
                      {tx.transactionType === 'DEPOSIT' ? '+' : '-'} ₹{parseFloat(tx.amount).toFixed(2)}
                    </td>
                    <td><span className="badge badge-success">{tx.status}</span></td>
                    <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Simulate Cash Deposit</h3>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" step="0.01" min="1" required className="form-input" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="e.g. 5000" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={depositDesc} onChange={(e) => setDepositDesc(e.target.value)} placeholder="Deposit note" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Simulate ATM Withdrawal</h3>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" step="0.01" min="1" required className="form-input" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="e.g. 2000" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={withdrawDesc} onChange={(e) => setWithdrawDesc(e.target.value)} placeholder="ATM Note" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
