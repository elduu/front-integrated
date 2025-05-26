import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '', 
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^\d{9,15}$/.test(formData.phone)) {
    newErrors.phone = 'Invalid phone number';
  }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:8080/register",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("pyserve_user", JSON.stringify({
        email: formData.email,
        token: data.token
      }));
      setSuccess(true);
    } else {
      setErrors({ form: data.error || "Signup failed" });
    }
  } catch (err) {
    setErrors({ form: "Network error" });
  } finally {
    setIsSubmitting(false);
  }
};

  if (success) {
    return (
      <div className={`signup-success ${darkMode ? 'dark' : 'light'}`}>
        <div className="success-card">
          <h2>Welcome to PyServe!</h2>
          <p>Your account has been successfully created.</p>
          <p>We've sent a confirmation email to <strong>{formData.email}</strong>.</p>
          <Link to="/dashboard" className="success-button">
            Go to Dashboard <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`signup-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create Your Account</h2>
          <p>Join PyServe and start deploying Python apps in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
<div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
  <label htmlFor="phone">Phone Number</label>
  <div className="input-wrapper">
    <FiMail className="input-icon" />
    <input
      type="text"
      id="phone"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Enter your phone number"
    />
  </div>
  {errors.phone && <span className="error-message">{errors.phone}</span>}
</div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="signup-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="signup-footer">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
            <p className="terms">
              By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;