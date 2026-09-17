import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { UserPlus, Lock, Unlock, Search, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState({ text: '', isError: false });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STAFF');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      if (res.success) setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.createUser({
        name,
        email,
        phone,
        password,
        confirmPassword: password
      }, role);

      if (res.success) {
        setMsg({ text: `User ${name} created with role ${role}!`, isError: false });
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setShowModal(false);
        fetchUsers();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const toggleStatus = async (userId, currentEnabled) => {
    const nextState = !currentEnabled;
    try {
      const res = await adminService.updateUserStatus(userId, nextState);
      if (res.success) {
        setMsg({ text: `User account ${nextState ? 'enabled' : 'disabled'}!`, isError: false });
        fetchUsers();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const assignRole = async (userId, newRole) => {
    try {
      const res = await adminService.assignRole(userId, newRole);
      if (res.success) {
        setMsg({ text: `Role ${newRole} assigned!`, isError: false });
        fetchUsers();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>User & Role Management</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Create staff/manager/admin accounts and manage access roles.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '260px' }}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <UserPlus size={18} /> Create User
          </button>
        </div>
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
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700, color: '#3A86FF' }}>#{u.id}</td>
                  <td style={{ fontWeight: 700, color: '#F8FAFC' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    {u.roles.map(r => (
                      <span key={r} className="badge badge-warning" style={{ marginRight: '0.25rem' }}>{r}</span>
                    ))}
                  </td>
                  <td>
                    <span className={`badge ${u.enabled ? 'badge-success' : 'badge-danger'}`}>
                      {u.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => toggleStatus(u.id, u.enabled)} className={`btn ${u.enabled ? 'btn-danger' : 'btn-primary'}`} style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                        {u.enabled ? <><Lock size={12} /> Disable</> : <><Unlock size={12} /> Enable</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Create System User</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" required className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" required className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" required className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">System Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="STAFF">STAFF</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Account</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
