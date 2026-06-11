import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component routes ko access protection pradan karta hai.
// isme hum Check karte hain user login hai ya nahi aur unke paas context role (like ROLE_ADMIN) hai ya nahi.
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Loading state handling (Jab tak backend se user profile verification na ho jaye)
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#090a0f',
        gap: '16px'
      }}>
        <div className="spinner"></div>
        <p style={{ color: '#94a3b8', fontFamily: 'Space Grotesk', fontSize: '0.9rem' }}>
          Verifying secure session...
        </p>
      </div>
    );
  }

  // User is not authenticated -> redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin route visited by a non-admin -> redirect to user dashboard
  if (adminOnly && user?.role !== 'ROLE_ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // Access Granted -> render children
  return children;
};

export default ProtectedRoute;
