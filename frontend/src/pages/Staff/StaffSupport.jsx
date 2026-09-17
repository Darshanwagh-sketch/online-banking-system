import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService';
import { CheckCircle, Clock } from 'lucide-react';

const StaffSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await staffService.getTickets();
      if (res.success) setTickets(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await staffService.updateTicketStatus(id, status);
      if (res.success) {
        setMsg({ text: `Ticket status updated to ${status}!`, isError: false });
        fetchTickets();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Staff Ticket Resolution Portal</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Review customer help requests and update resolution status.</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tickets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            No customer support tickets found.
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>{t.subject}</h3>
                  <span className={`badge ${t.priority === 'URGENT' || t.priority === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                    {t.priority}
                  </span>
                  <span className={`badge ${t.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                    {t.status}
                  </span>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{t.description}</p>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Submitted by: <strong style={{ color: '#F8FAFC' }}>{t.userName}</strong> ({t.userEmail}) on {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {t.status !== 'IN_PROGRESS' && (
                  <button onClick={() => updateStatus(t.id, 'IN_PROGRESS')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <Clock size={14} /> In Progress
                  </button>
                )}

                {t.status !== 'RESOLVED' && (
                  <button onClick={() => updateStatus(t.id, 'RESOLVED')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <CheckCircle size={14} /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffSupport;
