import React, { useState, useEffect } from 'react';
import { supportService } from '../../services/supportService';
import { LifeBuoy, PlusCircle, MessageSquare } from 'lucide-react';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await supportService.getTickets();
      if (res.success) setTickets(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await supportService.createTicket({ subject, description, priority });
      if (res.success) {
        setMsg({ text: 'Support ticket submitted successfully!', isError: false });
        setSubject('');
        setDescription('');
        setShowModal(false);
        fetchTickets();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Customer Support Center</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Submit and track your banking help requests.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusCircle size={18} /> New Support Ticket
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

      {/* Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tickets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
            No support tickets raised. Click "New Support Ticket" if you need assistance!
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>{t.subject}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className={`badge ${t.priority === 'URGENT' || t.priority === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                    {t.priority}
                  </span>
                  <span className={`badge ${t.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{t.description}</p>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Raised on: {new Date(t.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Raise Support Ticket</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" required className="form-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary of issue" />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea required rows="4" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your question or technical problem in detail..." />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Ticket</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
