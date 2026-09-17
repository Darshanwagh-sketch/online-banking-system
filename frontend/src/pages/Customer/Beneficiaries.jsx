import React, { useState, useEffect } from 'react';
import { beneficiaryService } from '../../services/beneficiaryService';
import { UserPlus, Trash2, Building, Hash } from 'lucide-react';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('SecureBank');
  const [ifscCode, setIfscCode] = useState('SEC0001234');
  const [msg, setMsg] = useState({ text: '', isError: false });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await beneficiaryService.getBeneficiaries();
      if (res.success) setBeneficiaries(res.data);
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await beneficiaryService.addBeneficiary({
        beneficiaryName: name,
        accountNumber,
        bankName,
        ifscCode
      });
      if (res.success) {
        setMsg({ text: 'Beneficiary added successfully!', isError: false });
        setName('');
        setAccountNumber('');
        setShowAddModal(false);
        fetchBeneficiaries();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this beneficiary?')) return;
    try {
      const res = await beneficiaryService.deleteBeneficiary(id);
      if (res.success) {
        setMsg({ text: 'Beneficiary removed.', isError: false });
        fetchBeneficiaries();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Saved Beneficiaries</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Manage your payees for fast money transfers.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <UserPlus size={18} /> Add Beneficiary
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

      {/* Grid of Beneficiaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {beneficiaries.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            No beneficiaries added yet. Click "Add Beneficiary" above to add your first payee!
          </div>
        ) : (
          beneficiaries.map((b) => (
            <div key={b.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>{b.beneficiaryName}</h3>
                <button onClick={() => handleDelete(b.id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', color: '#FF7675' }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#94A3B8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Hash size={14} color="#3A86FF" /> <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{b.accountNumber}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={14} color="#00F5D4" /> <span>{b.bankName} ({b.ifscCode})</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Add New Beneficiary</h3>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Beneficiary Full Name</label>
                <input type="text" required className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Connor" />
              </div>

              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input type="text" required className="form-input" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="10-digit account number" />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input type="text" className="form-input" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input type="text" className="form-input" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Beneficiary</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
