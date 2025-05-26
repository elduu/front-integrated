import React, { useState } from 'react';
import { FiUser, FiLock, FiAlertCircle, FiLoader } from 'react-icons/fi';
import './AdminLogin.css';

const AdminLogin = ({ darkMode, onLogin, loading }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await onLogin(credentials);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className={`admin-login-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">
            <FiUser className="admin-icon" />
            <h1>PyServe Admin</h1>
          </div>
          <h2>Secure Admin Portal</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <FiAlertCircle className="error-icon" /> 
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="username"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Admin username"
                disabled={loading}
                autoComplete="username"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                disabled={loading}
                autoComplete="current-password"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-options">
            <label className="admin-remember">
              <input type="checkbox" name="remember" />
              <span>Remember this device</span>
            </label>
            <a href="/admin/forgot-password" className="admin-forgot">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="spin" /> Authenticating...
              </>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="security-note">
            <FiLock className="lock-icon" />
            Your credentials are encrypted during transmission
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;