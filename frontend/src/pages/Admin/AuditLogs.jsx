import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { FileSpreadsheet, Search } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await adminService.getAuditLogs();
      if (res.success) setLogs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase()) ||
    l.ipAddress.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>System Security Audit Log Inspector</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Comprehensive system action audit trail and IP address logs.</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search action or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>User ID</th>
                <th>Action Code</th>
                <th>Description / Payload</th>
                <th>Client IP</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 700, color: '#FF7675' }}>#LOG-{l.id}</td>
                  <td>#{l.userId || 'GUEST'}</td>
                  <td><span className="badge badge-warning">{l.action}</span></td>
                  <td>{l.description}</td>
                  <td style={{ color: '#00F5D4', fontWeight: 600 }}>{l.ipAddress}</td>
                  <td style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
