import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user) {
        if (user.roles.includes('ADMIN')) navigate('/admin/dashboard');
        else if (user.roles.includes('MANAGER')) navigate('/manager/dashboard');
        else if (user.roles.includes('STAFF')) navigate('/staff/dashboard');
        else navigate('/customer/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fillDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1C2541 0%, #0B132B 100%)',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={40} color="#3A86FF" />
            <h1 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, #3A86FF 0%, #00F5D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SecureBank
            </h1>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Sign in to your digital banking portal</p>
        </div>

        <div className="card">
          {error && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              background: 'rgba(255, 118, 117, 0.15)',
              border: '1px solid #FF7675',
              color: '#FF7675',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}>
              <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo User Shortcuts */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem', textAlign: 'center' }}>
              Quick Demo Login
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button onClick={() => fillDemoUser('customer@securebank.com', 'Customer@1234')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                Customer Demo
              </button>
              <button onClick={() => fillDemoUser('staff@securebank.com', 'Staff@1234')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                Staff Demo
              </button>
              <button onClick={() => fillDemoUser('manager@securebank.com', 'Manager@1234')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                Manager Demo
              </button>
              <button onClick={() => fillDemoUser('admin@securebank.com', 'Admin@1234')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                Admin Demo
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: '#94A3B8' }}>
            Don't have a banking account? <Link to="/register" style={{ color: '#3A86FF', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
