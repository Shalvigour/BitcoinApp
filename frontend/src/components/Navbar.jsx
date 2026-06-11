import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, User, LogOut, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(9, 10, 15, 0.75)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Branding */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        fontFamily: 'Space Grotesk',
        fontSize: '1.4rem',
        fontWeight: 800,
        color: '#ffffff'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <TrendingUp size={20} color="white" />
        </div>
        <span className="gradient-accent">ArbitragePulse</span>
      </Link>

      {/* Navigation links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{
              textDecoration: 'none',
              fontFamily: 'Space Grotesk',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/dashboard') ? '#6366f1' : '#94a3b8',
              transition: 'all 0.2s',
              borderBottom: isActive('/dashboard') ? '2px solid #6366f1' : '2px solid transparent',
              paddingBottom: '4px'
            }}>
              Market Dashboard
            </Link>

            {/* Admin only option */}
            {user?.role === 'ROLE_ADMIN' && (
              <Link to="/admin" style={{
                textDecoration: 'none',
                fontFamily: 'Space Grotesk',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: isActive('/admin') ? '#06b6d4' : '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                borderBottom: isActive('/admin') ? '2px solid #06b6d4' : '2px solid transparent',
                paddingBottom: '4px'
              }}>
                <ShieldAlert size={16} />
                Admin Panel
              </Link>
            )}
          </>
        ) : (
          <Link to="/" style={{
            textDecoration: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '0.95rem',
            color: '#94a3b8'
          }}>
            Features
          </Link>
        )}
      </div>

      {/* Auth Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* User tag */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontFamily: 'Space Grotesk'
            }}>
              <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </span>
              <span style={{
                color: user.role === 'ROLE_ADMIN' ? '#06b6d4' : '#94a3b8',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Trader'}
              </span>
            </div>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <User size={18} />
            </div>

            <button 
              onClick={handleLogout}
              className="btn btn-secondary" 
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Start Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
