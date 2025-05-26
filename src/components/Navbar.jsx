import React from 'react';
import { 
  FiHome, 
  FiServer,
  FiShield,
  FiDollarSign,
  FiLogIn,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ darkMode, isAdmin, user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className={`top-navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="navbar-left">
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FiHome className="nav-icon" />
          Home
        </Link>
        
        {user && (
          <Link 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <FiServer className="nav-icon" />
            Dashboard
          </Link>
        )}

        {isAdmin && (
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <FiShield className="nav-icon" />
            Admin
          </Link>
        )}
      </div>
      
      <div className="navbar-right">
        {user ? (
          <div className="user-section">
            <span className="user-greeting">
              <FiUser /> {user.name || user.email}
            </span>
            <button onClick={onLogout} className="nav-item logout-button">
              <FiLogOut className="nav-icon" />
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link 
              to="/signup" 
              className="nav-item highlight"
            >
              <FiDollarSign className="nav-icon" />
              Pricing & Signup
            </Link>
            
            <Link 
              to="/login" 
              className="nav-item"
            >
              <FiLogIn className="nav-icon" />
              Log in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;