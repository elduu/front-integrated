import React from 'react';
import { FiUser, FiShield, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'admin') {
      navigate('/admin-login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`role-selection-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="role-selection-card">
        <div className="role-selection-header">
          <h1>Welcome to PyServe</h1>
          <p>Select your role to continue</p>
        </div>

        <div className="role-options">
          <button 
            className="role-button admin-button"
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="role-button-content">
              <div className="role-icon-container">
                <FiShield className="role-icon" />
              </div>
              <div className="role-text">
                <h2>Administrator</h2>
                <p>Access the management dashboard</p>
              </div>
              <FiArrowRight className="arrow-icon" />
            </div>
          </button>

          <button 
            className="role-button user-button"
            onClick={() => handleRoleSelect('user')}
          >
            <div className="role-button-content">
              <div className="role-icon-container">
                <FiUser className="role-icon" />
              </div>
              <div className="role-text">
                <h2>Standard User</h2>
                <p>Access your applications</p>
              </div>
              <FiArrowRight className="arrow-icon" />
            </div>
          </button>
        </div>

        <div className="role-footer">
          <p>Not sure which to choose? <a href="/help">Get help</a></p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;