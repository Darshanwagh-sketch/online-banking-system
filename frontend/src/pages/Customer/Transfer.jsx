import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/accountService';
import { beneficiaryService } from '../../services/beneficiaryService';
import { transactionService } from '../../services/transactionService';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [accRes, benRes] = await Promise.all([
        accountService.getAccounts(),
        beneficiaryService.getBeneficiaries()
      ]);
      if (accRes.success) {
        setAccounts(accRes.data);
        if (accRes.data.length > 0) setFromAccount(accRes.data[0].accountNumber);
      }
      if (benRes.success) setBeneficiaries(benRes.data);
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    }
  };

  const handleSelectBeneficiary = (e) => {
    const val = e.target.value;
    if (val) {
      setToAccount(val);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMsg({ text: '', isError: false });
    setLoading(true);

    try {
      const res = await transactionService.transfer({
        fromAccountNumber: fromAccount,
        toAccountNumber: toAccount,
        amount: parseFloat(amount),
        description: description || 'Internal Transfer'
      });

      if (res.success) {
        setMsg({ text: `Transfer successful! Reference: ${res.data.transactionReference}`, isError: false });
        setAmount('');
        setDescription('');
        setToAccount('');
        loadData();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const selectedAccountObj = accounts.find(a => a.accountNumber === fromAccount);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem' }}>
          Transfer Money
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Send funds instantly to any SecureBank account or saved beneficiary.
        </p>

        {msg.text && (
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            background: msg.isError ? 'rgba(255, 118, 117, 0.15)' : 'rgba(0, 184, 148, 0.15)',
            border: msg.isError ? '1px solid #ff7675' : '1px solid #55E6C1',
            color: msg.isError ? '#ff7675' : '#55E6C1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600
          }}>
            {msg.isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleTransfer}>
          {/* Source Account */}
          <div className="form-group">
            <label className="form-label">From Account</label>
            <select className="form-select" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} required>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} ({acc.accountType}) — Available: ₹{parseFloat(acc.balance).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Saved Beneficiary Quick Selector */}
          {beneficiaries.length > 0 && (
            <div className="form-group">
              <label className="form-label">Select Saved Beneficiary (Optional)</label>
              <select className="form-select" onChange={handleSelectBeneficiary} defaultValue="">
                <option value="">-- Choose a Beneficiary --</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.accountNumber}>
                    {b.beneficiaryName} ({b.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Destination Account Number */}
          <div className="form-group">
            <label className="form-label">Destination Account Number</label>
            <input
              type="text"
              className="form-input"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              placeholder="e.g. 1009876543"
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Transfer Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
            {selectedAccountObj && (
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem', display: 'block' }}>
                Maximum transferable balance: ₹{parseFloat(selectedAccountObj.balance).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Note</label>
            <input
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rent payment, Salary deposit"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '1rem' }}>
            <Send size={18} /> {loading ? 'Processing Transfer...' : 'Execute Money Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
