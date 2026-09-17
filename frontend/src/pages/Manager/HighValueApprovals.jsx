import React, { useState, useEffect } from 'react';
import { managerService } from '../../services/managerService';
import { Check, X, ShieldAlert } from 'lucide-react';

const HighValueApprovals = () => {
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await managerService.getPendingApprovals();
      if (res.success) setPending(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (id, approve) => {
    const actionName = approve ? 'APPROVE' : 'REJECT';
    if (!window.confirm(`Are you sure you want to ${actionName} this high-value transfer?`)) return;

    try {
      const res = await managerService.processApproval(id, approve);
      if (res.success) {
        setMsg({ text: `Transfer ${actionName}D successfully!`, isError: false });
        fetchPending();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>High-Value Transfer Approvals Desk</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Transfers exceeding ₹100,000 require manager sign-off before balance execution.</p>
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
                <th>Reference ID</th>
                <th>Sender (From)</th>
                <th>Recipient (To)</th>
                <th>Amount (₹)</th>
                <th>Description</th>
                <th>Timestamp</th>
                <th>Manager Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem' }}>
                    No high-value transfers currently pending manager approval.
                  </td>
                </tr>
              ) : (
                pending.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 700, color: '#3A86FF' }}>{tx.transactionReference}</td>
                    <td>{tx.fromCustomerName} ({tx.fromAccountNumber})</td>
                    <td>{tx.toCustomerName} ({tx.toAccountNumber})</td>
                    <td style={{ fontWeight: 800, color: '#FFEAA7', fontSize: '1.1rem' }}>
                      ₹{parseFloat(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>{tx.description}</td>
                    <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleAction(tx.id, true)} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleAction(tx.id, false)} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                          <X size={14} /> Reject
                        </button>
                      </div>
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

export default HighValueApprovals;
