import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const StaffAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await staffService.getAlerts();
      if (res.success) setAlerts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Suspicious Activity & Audit Monitoring Alerts</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Real-time security log alerts for staff and compliance officers.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            No security alerts recorded.
          </div>
        ) : (
          alerts.map((a) => (
            <div key={a.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '4px solid #FF7675' }}>
              <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(255, 118, 117, 0.15)', color: '#FF7675' }}>
                <AlertTriangle size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>Action: {a.action}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>IP: {a.ipAddress}</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>{a.description}</p>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '0.4rem' }}>
                  Logged at: {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffAlerts;
