import React from 'react';
import './Footer.css';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`site-footer ${darkMode ? 'dark' : 'light'}`}>
      <div className="footer-content">
        <div className="footer-bottom">
          <div className="copyright">
            Copyright © 2011-2025 PyServe LLP
          </div>
          <div className="legal-links">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy & Cookies</a>
          </div>
          <div className="trademark">
            "Python" is a registered trademark of the Python Software Foundation.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;