import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';

const StaffTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await staffService.getTransactions();
      if (res.success) setTransactions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>System-Wide Transaction Ledger</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Real-time stream of all financial movements across the bank.</p>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Sender (From)</th>
                <th>Recipient (To)</th>
                <th>Amount (₹)</th>
                <th>Description</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>
                    No system transactions recorded.
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
                    <td>{tx.fromCustomerName} ({tx.fromAccountNumber})</td>
                    <td>{tx.toCustomerName} ({tx.toAccountNumber})</td>
                    <td style={{ fontWeight: 800, color: '#F8FAFC' }}>₹{parseFloat(tx.amount).toFixed(2)}</td>
                    <td>{tx.description}</td>
                    <td><span className="badge badge-success">{tx.status}</span></td>
                    <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleString()}</td>
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

export default StaffTransactions;
