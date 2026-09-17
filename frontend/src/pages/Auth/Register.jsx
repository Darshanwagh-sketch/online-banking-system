import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match');
      setFieldErrors({ confirmPassword: 'Confirm Password does not match Password' });
      return;
    }

    try {
      const user = await register(formData);
      if (user) {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message);
      if (err.validationErrors) {
        setFieldErrors(err.validationErrors);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1C2541 0%, #0B132B 100%)',
      padding: '2rem 1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={36} color="#3A86FF" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #3A86FF 0%, #00F5D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SecureBank
            </h1>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Open a new digital banking customer account</p>
        </div>

        <div className="card">
          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              background: 'rgba(255, 118, 117, 0.15)',
              border: '1px solid #FF7675',
              color: '#FF7675',
              fontSize: '0.88rem',
              fontWeight: 600,
              whiteSpace: 'pre-line'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                <AlertCircle size={18} />
                <span>Validation Error</span>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                className="form-input"
                style={{ borderColor: fieldErrors.name ? '#FF7675' : undefined }}
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Johnson"
              />
              {fieldErrors.name && (
                <span style={{ color: '#FF7675', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                  ⚠ {fieldErrors.name}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  style={{ borderColor: fieldErrors.email ? '#FF7675' : undefined }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                />
                {fieldErrors.email && (
                  <span style={{ color: '#FF7675', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                    ⚠ {fieldErrors.email}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number (10 digits) *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  className="form-input"
                  style={{ borderColor: fieldErrors.phone ? '#FF7675' : undefined }}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
                {fieldErrors.phone && (
                  <span style={{ color: '#FF7675', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                    ⚠ {fieldErrors.phone}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="form-input"
                  style={{ borderColor: fieldErrors.password ? '#FF7675' : undefined }}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="e.g. Pass@1234"
                />
                {fieldErrors.password ? (
                  <span style={{ color: '#FF7675', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                    ⚠ {fieldErrors.password}
                  </span>
                ) : (
                  <span style={{ color: '#64748B', fontSize: '0.72rem', marginTop: '0.2rem', display: 'block' }}>
                    Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char (@#$%^&+=!)
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="form-input"
                  style={{ borderColor: fieldErrors.confirmPassword ? '#FF7675' : undefined }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm"
                />
                {fieldErrors.confirmPassword && (
                  <span style={{ color: '#FF7675', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                    ⚠ {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                required
                className="form-input"
                style={{ borderColor: fieldErrors.dateOfBirth ? '#FF7675' : undefined }}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              {fieldErrors.dateOfBirth && (
                <span style={{ color: '#FF7675', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                  ⚠ {fieldErrors.dateOfBirth}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                style={{ borderColor: fieldErrors.address ? '#FF7675' : undefined }}
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Financial Blvd"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}>
              <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Customer Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: '#94A3B8' }}>
            Already have an account? <Link to="/login" style={{ color: '#3A86FF', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
