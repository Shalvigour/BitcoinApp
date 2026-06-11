import React, { createContext, useState, useEffect, useContext } from 'react';

// Context create karte hain jo complete app mein authentication details share karega.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Base API configuration URL
  const BACKEND_BASE_URL = 'http://localhost:8081/bitcoin';

  // Notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // JWT Token check aur User details load karne ka effect (on app reload)
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Backend ke '/user/me' API se login user details fetch karte hain.
        // Hum Header mein 'Authorization: Bearer <JWT_TOKEN>' bhejte hain.
        const response = await fetch(`${BACKEND_BASE_URL}/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // User state save ho gayi (e.g. email, role, names)
        } else {
          // Token expired ya invalid ho gaya hai
          logout();
          addToast('Session expired. Please login again.', 'error');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Offline ya backend down situation ko handle karne ke liye auth state wipe nahi karenge
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  // LOGIN FUNCTION
  const login = async (emailId, password) => {
    try {
      setLoading(true);
      // POST mapping for backend /user/login
      const response = await fetch(`${BACKEND_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailId, password })
      });

      // Invalid credentials handles
      if (response.status === 401) {
        addToast('Invalid email or password', 'error');
        setLoading(false);
        return false;
      }

      if (!response.ok) {
        const errMsg = await response.text();
        addToast(errMsg || 'Something went wrong', 'error');
        setLoading(false);
        return false;
      }

      // Backend returns plain JWT token text
      const rawToken = await response.text();
      // Token string ko quotes se safe clean karein (agar JSON serialized ho)
      const cleanToken = rawToken.replace(/^"|"$/g, '').trim();

      // localstorage aur state update
      localStorage.setItem('token', cleanToken);
      setToken(cleanToken);

      // Naya profile load karte hain jo token ke dynamic changes ko track karega
      const profileResponse = await fetch(`${BACKEND_BASE_URL}/user/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData);
        addToast(`Welcome back, ${userData.firstName}!`, 'success');
        setLoading(false);
        return userData;
      } else {
        logout();
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      addToast('Cannot connect to backend server', 'error');
      setLoading(false);
      return false;
    }
  };

  // SIGN UP FUNCTION
  const signup = async (userData) => {
    try {
      setLoading(true);
      // POST Request for Sign Up
      // Body fields matching Spring Boot User model: emailId, password, firstName, lastName, gender, country, dob
      const response = await fetch(`${BACKEND_BASE_URL}/user/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.status === 406) {
        addToast('Email already registered or registration unacceptable', 'error');
        setLoading(false);
        return false;
      }

      if (!response.ok) {
        addToast('Invalid request details. Check inputs.', 'error');
        setLoading(false);
        return false;
      }

      // Successfully registered
      addToast('Registration successful! Please login.', 'success');
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Sign up error:', err);
      addToast('Cannot connect to server. Try again.', 'error');
      setLoading(false);
      return false;
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    addToast('Logged out successfully', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, signup, logout, addToast, toasts }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
