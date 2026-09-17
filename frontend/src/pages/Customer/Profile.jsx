import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { User, Lock, Save, KeyRound } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [msg, setMsg] = useState({ text: '', isError: false });
  const [pwdMsg, setPwdMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setName(res.data.name);
        setPhone(res.data.phone);
        setAddress(res.data.address || '');
      }
    } catch (e) {
      setMsg({ text: e.message, isError: true });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({
        name,
        phone,
        address
      });
      if (res.success) {
        setMsg({ text: 'Profile details updated successfully!', isError: false });
        fetchProfile();
      }
    } catch (err) {
      setMsg({ text: err.message, isError: true });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      if (res.success) {
        setPwdMsg({ text: 'Password changed successfully!', isError: false });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      setPwdMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>Account Profile & Security Settings</h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Manage your account identity, phone, address, and credentials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Details Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <User color="#3A86FF" size={22} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>Personal Information</h3>
          </div>

          {msg.text && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              background: msg.isError ? 'rgba(255, 118, 117, 0.15)' : 'rgba(0, 184, 148, 0.15)',
              color: msg.isError ? '#FF7675' : '#55E6C1',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input type="email" className="form-input" value={profile?.email || ''} disabled style={{ opacity: 0.6 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <KeyRound color="#00F5D4" size={22} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>Change Password</h3>
          </div>

          {pwdMsg.text && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              background: pwdMsg.isError ? 'rgba(255, 118, 117, 0.15)' : 'rgba(0, 184, 148, 0.15)',
              color: pwdMsg.isError ? '#FF7675' : '#55E6C1',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" required className="form-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" required className="form-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 special char" />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" required className="form-input" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
              <Lock size={16} /> Update Security Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
