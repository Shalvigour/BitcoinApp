import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AppContent = () => {
  const { toasts } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Route mapping logic */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* USER CONSOLE (PROTECTED ROUTE) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* ADMIN CONSOLE (PROTECTED ROUTE - ADMIN ONLY) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* GLOBAL TOAST FLOATER SYSTEM */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="animate-fade-in"
            style={{
              background: '#131926',
              border: `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
              borderRadius: '8px',
              padding: '12px 20px',
              color: 'white',
              boxShadow: `0 8px 20px rgba(0,0,0,0.6), 0 0 10px ${toast.type === 'success' ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'Space Grotesk',
              fontSize: '0.9rem',
              minWidth: '280px'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={18} color="#10b981" />
            ) : (
              <AlertCircle size={18} color="#ef4444" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
