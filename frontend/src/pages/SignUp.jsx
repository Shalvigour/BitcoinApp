import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Globe, Calendar, Info } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    emailId: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    country: '',
    dob: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // MAPPING DETAILS (FRONTEND TO BACKEND):
    // 1. spring-boot server 'User' model (Lombok @Data) expect karega in JSON body.
    // 2. 'dob' should be in 'YYYY-MM-DD' format which HTML5 Date input natively provides.
    // 3. Request URL: 'POST http://localhost:8081/bitcoin/user/sign-up'.
    // 4. Success check hone ke baad user ko Login page check parameters par redirect karenge.
    const success = await signup(formData);
    setIsSubmitting(false);

    if (success) {
      navigate('/login');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '40px 24px',
      animation: 'fadeIn 0.5s ease'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 20px rgba(99, 102, 241, 0.05)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Join ArbitragePulse and unlock live trading discrepancy monitoring</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: First and Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">First Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Last Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="emailId">Email Address (Username)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                id="emailId"
                name="emailId"
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="john.doe@example.com"
                value={formData.emailId}
                onChange={handleChange}
              />
            </div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} /> This will be your login username identifier.
            </p>
          </div>

          {/* Row 3: Gender & DOB */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dob">Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} />
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Country */}
          <div className="form-group">
            <label className="form-label" htmlFor="country">Country</label>
            <div style={{ position: 'relative' }}>
              <Globe size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                id="country"
                name="country"
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="India"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 5: Password */}
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
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
                <UserPlus size={18} />
                Create Free Account
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
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
