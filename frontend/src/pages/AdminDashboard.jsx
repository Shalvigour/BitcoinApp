import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, ShieldAlert, ShieldCheck, Mail, Calendar, Globe, User } from 'lucide-react';

const AdminDashboard = () => {
  const { token, addToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Naya admin register karne ka form state
  const [newAdmin, setNewAdmin] = useState({
    emailId: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    country: '',
    dob: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BACKEND_BASE_URL = 'http://localhost:8081/bitcoin';

  // 1. GET ALL USERS (ADMIN API CALL)
  // - Request URL: 'GET http://localhost:8081/bitcoin/admin/all-users'.
  // - Spring security check karega ki Header ka JWT token valid hai aur token wale user ki authority 'ROLE_ADMIN' hai ya nahi.
  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin/all-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        addToast('Failed to fetch user directory. Unauthorized.', 'error');
      }
    } catch (err) {
      console.error('All users fetch error:', err);
      addToast('Connection to admin directory failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [token]);

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  // 2. CREATE NEW ADMIN (ADMIN API CALL)
  // - Form data mapping to backend endpoint: 'POST http://localhost:8081/bitcoin/admin/create-admin'.
  // - Body carries: emailId, password, firstName, lastName, gender, country, dob.
  // - Backend sets role automatically to 'ROLE_ADMIN' on signup save.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });

      if (response.ok) {
        addToast('New administrator created successfully!', 'success');
        // Reset form inputs
        setNewAdmin({
          emailId: '',
          firstName: '',
          lastName: '',
          gender: 'Male',
          country: '',
          dob: '',
          password: ''
        });
        // Reload directory to see new admin in list
        fetchAllUsers();
      } else {
        const errMsg = await response.text();
        addToast(errMsg || 'Failed to create administrator profile. Acceptability issue.', 'error');
      }
    } catch (err) {
      console.error('Create admin error:', err);
      addToast('Cannot connect to admin creation endpoint', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'ROLE_ADMIN').length;
  const traderCount = users.filter((u) => u.role === 'ROLE_USER').length;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      animation: 'fadeIn 0.5s ease'
    }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={32} color="#06b6d4" />
          Administrative Center
        </h1>
        <p style={{ color: '#94a3b8' }}>Secure directory management and admin user provisioning console.</p>
      </div>

      {/* Directory Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Registered Directory</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{totalUsers} accounts</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Administrators</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: '#34d399' }}>{adminCount} active</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6366f1'
          }}>
            <User size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Standard Traders</div>
            <div style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{traderCount} active</div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '32px',
        alignItems: 'start'
      }}>
        
        {/* User directory lists */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.3rem' }}>User Directory Access Control</h2>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="spinner"></div>
            </div>
          ) : users.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>No users found in MongoDB database.</p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email / ID</th>
                    <th>Role</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{u.firstName} {u.lastName}</strong>
                      </td>
                      <td>{u.emailId}</td>
                      <td>
                        <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-rose' : 'badge-indigo'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        <div>Country: {u.country || 'N/A'}</div>
                        <div>DOB: {u.dob || 'N/A'}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Provision new Admin card */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderLeft: '4px solid #ef4444',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#ef4444" />
            <h2 style={{ fontSize: '1.3rem' }}>Create Admin</h2>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4' }}>
            Register a new secure administrator account. Password values will automatically be encrypted by the backend security encoder.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>First Name</label>
              <input
                name="firstName"
                required
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                value={newAdmin.firstName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Last Name</label>
              <input
                name="lastName"
                required
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                value={newAdmin.lastName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Email / Username</label>
              <input
                name="emailId"
                type="email"
                required
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                placeholder="admin@bitcoin.com"
                value={newAdmin.emailId}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={newAdmin.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>DOB</label>
                <input
                  name="dob"
                  type="date"
                  required
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={newAdmin.dob}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Country</label>
              <input
                name="country"
                required
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                value={newAdmin.country}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Password</label>
              <input
                name="password"
                type="password"
                required
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                value={newAdmin.password}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger"
              style={{ padding: '10px', fontSize: '0.9rem', marginTop: '8px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                'Save Admin Account'
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
