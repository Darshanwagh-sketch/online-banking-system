import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';
import { ShieldAlert, ShieldCheck, Search, Lock, Unlock } from 'lucide-react';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await staffService.getAccounts();
      if (res.success) setAccounts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (accountId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to set account status to ${nextStatus}?`)) return;

    try {
      const res = await staffService.updateAccountStatus(accountId, nextStatus);
      if (res.success) {
        setMsg({ text: `Account status updated to ${nextStatus}!`, isError: false });
        fetchAccounts();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const filtered = accounts.filter(a =>
    a.accountNumber.includes(search) ||
    a.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Account Controls & Status Management</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Block, unblock, or audit accounts across the bank.</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search account no or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Customer Name</th>
                <th>Account Type</th>
                <th>Balance (₹)</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
                    No accounts found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 700, color: '#3A86FF' }}>{a.accountNumber}</td>
                    <td style={{ fontWeight: 700, color: '#F8FAFC' }}>{a.customerName}</td>
                    <td><span className="badge badge-warning">{a.accountType}</span></td>
                    <td style={{ fontWeight: 800 }}>₹{parseFloat(a.balance).toFixed(2)}</td>
                    <td>{a.currency}</td>
                    <td>
                      <span className={`badge ${a.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleStatus(a.id, a.status)}
                        className={`btn ${a.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        {a.status === 'ACTIVE' ? <><Lock size={14} /> Block Account</> : <><Unlock size={14} /> Unblock Account</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
