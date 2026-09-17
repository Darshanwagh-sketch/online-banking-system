import React from 'react';
import { Settings, Save, Server, ShieldCheck } from 'lucide-react';

const SystemSettings = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>System Settings & Banking Parameters</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Global application thresholds and operational parameters.</p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#F8FAFC' }}>
          Configured Thresholds
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">High-Value Transfer Approval Threshold (₹)</label>
            <input type="text" className="form-input" defaultValue="100000.00" disabled style={{ opacity: 0.7 }} />
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem', display: 'block' }}>
              Transfers exceeding this amount require explicit Manager sign-off before funds are settled.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Default Welcome Deposit Bonus (₹)</label>
            <input type="text" className="form-input" defaultValue="1000.00" disabled style={{ opacity: 0.7 }} />
          </div>

          <div className="form-group">
            <label className="form-label">Default System IFSC Code</label>
            <input type="text" className="form-input" defaultValue="SEC0001234" disabled style={{ opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
