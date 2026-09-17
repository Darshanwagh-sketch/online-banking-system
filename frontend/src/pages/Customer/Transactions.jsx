import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const fetchTransactions = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await transactionService.getTransactions(pageNumber, 10);
      if (res.success) {
        setTransactions(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => filterType === 'ALL' || t.transactionType === filterType);

  const downloadStatement = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Reference,Type,Amount,Description,Status,Date"]
      .concat(transactions.map(t => `${t.transactionReference},${t.transactionType},${t.amount},"${t.description}",${t.status},${t.createdAt}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SecureBank_Statement_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Transaction History & Statement</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Detailed audit statement of all account activities.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: 'auto' }}>
            <option value="ALL">All Types</option>
            <option value="DEPOSIT">Deposits</option>
            <option value="WITHDRAWAL">Withdrawals</option>
            <option value="TRANSFER">Transfers</option>
          </select>

          <button onClick={downloadStatement} className="btn btn-secondary">
            <Download size={16} /> Download CSV Statement
          </button>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Reference ID</th>
                <th>Type</th>
                <th>Sender Account</th>
                <th>Receiver Account</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem' }}>
                    No transactions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 700, color: '#3A86FF' }}>{tx.transactionReference}</td>
                    <td>
                      <span className={`badge ${tx.transactionType === 'DEPOSIT' ? 'badge-success' : tx.transactionType === 'WITHDRAWAL' ? 'badge-danger' : 'badge-warning'}`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    <td>{tx.fromAccountNumber}</td>
                    <td>{tx.toAccountNumber}</td>
                    <td>{tx.description}</td>
                    <td style={{ fontWeight: 800, color: tx.transactionType === 'DEPOSIT' ? '#55E6C1' : '#FF7675' }}>
                      {tx.transactionType === 'DEPOSIT' ? '+' : '-'} ₹{parseFloat(tx.amount).toFixed(2)}
                    </td>
                    <td><span className="badge badge-success">{tx.status}</span></td>
                    <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Page {page + 1} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
