import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailId || !password) return;

    setIsSubmitting(true);

    // BINDING DETAIL (FRONTEND TO BACKEND):
    // 1. Frontend user input (emailId, password) collect karega.
    // 2. AuthContext ke login method ko call karega, jo aage HTTP POST call bhejega to 'http://localhost:8081/bitcoin/user/login'.
    // 3. Response validation aur token extraction check hone ke baad hum user dashboard (/dashboard) par navigate karenge.
    const success = await login(emailId, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '24px',
      animation: 'fadeIn 0.5s ease'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 20px rgba(99, 102, 241, 0.05)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Sign in to continue monitoring crypto arbitrage</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                id="email"
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="you@example.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                id="password"
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', gap: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
            ) : (
              <>
                <LogIn size={18} />
                Sign In to Console
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.9rem',
          color: '#94a3b8'
        }}>
          New to ArbitragePulse?{' '}
          <Link to="/signup" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
