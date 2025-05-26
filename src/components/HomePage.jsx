import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ darkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Host, run, and code Python in the cloud!</h1>
          <p className="hero-subtitle">
            Get started for free. Our basic plan gives you access to machines with a full Python environment already installed.
            You can develop and host your website or any other code directly from your browser without having to install
            software or manage your own server.
          </p>
          <p className="hero-pricing">
            Need more power? Upgraded plans start at $5/month.
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-primary" 
              onClick={() => navigate('/select-role')}
            >
              Get Started
            </button>
            <button 
              className="cta-secondary"
              onClick={() => navigate('/pricing')}
            >
              View Plans
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Start hosting quickly</h3>
          <p>
            Just write your application. No need to configure or maintain a web server — everything is set up and ready to go.
          </p>
          <button className="feature-link" onClick={() => navigate('/docs')}>More »</button>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🌐</div>
          <h3>Develop anywhere</h3>
          <p>
            Take your development environment with you! If you have a browser and an Internet connection, you've got everything you need.
          </p>
          <button className="feature-link" onClick={() => navigate('/docs')}>More »</button>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎓</div>
          <h3>Teach and learn</h3>
          <p>
            PyServe is a fully-fledged Python environment, ready to go, for students and teachers — concentrate on teaching, not on installation hassles.
          </p>
          <button className="feature-link" onClick={() => navigate('/docs')}>More »</button>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🛟</div>
          <h3>Amazing support</h3>
          <p>
            Need help with PyServe? If you get in touch, you can talk directly with the development team. Help for developers, from developers.
          </p>
          <button className="feature-link" onClick={() => navigate('/support')}>More »</button>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="get-started-section">
        <h2>Get a Python website in minutes</h2>
        <p>
          We make a normally complicated process very simple, letting you focus on creating exciting applications for your users.
          Launching a new Django project is a simple process taking just a couple of minutes. No need to manage a web server
          or maintain a Linux machine. No need to install security patches. It just works.
        </p>
        <div className="frameworks">
          <h3>Your choice</h3>
          <p>
            We have quickstart installers for Django, web2py, Flask, and Bottle — we can also handle any other WSGI web framework
            that you want to use, and it's probably already installed.
          </p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <blockquote>
          "I just launched my first-ever Django project, and I'm so happy that I chose PyServe. Deployment was as smooth as I possibly could have hoped for."
          <footer>- Michael H, 6 August 2020</footer>
        </blockquote>
      </section>

      {/* More Features Section */}
      <section className="more-features">
        <div className="feature">
          <h3>Your website</h3>
          <p>
            Want to host your own domain at PyServe? Our paid accounts do that for you. And free users don't get left out —
            http://yourusername.pyserve.com/ works for everyone.
          </p>
        </div>
        
        <div className="feature">
          <h3>Easy scaling</h3>
          <p>
            A $5 Hacker account at PyServe can easily support a 10,000 hit/day website. But when your site grows and you need
            to support 100 times that traffic, we're still there — you just need to upgrade your account.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2>Python coding on the web: 40,009,509 consoles served!</h2>
        <p>
          PyServe makes it easy to create and run Python programs in the cloud. You can write your programs in a web-based editor
          or just run a console session from any modern web browser. There's storage space on our servers, and you can preserve
          your session state and access it from anywhere, with no need to pay for, or configure, your own server. Start work
          on your work desktop, then later pick up from where you left off by accessing exactly the same session from your laptop.
        </p>
      </section>

      {/* Another Testimonial */}
      <section className="testimonial-section">
        <blockquote>
          "I just wanted to say that I love your service. We use PyServe at work to run our internal site / database and also to update our IP Phones... I like that I can do actual work here as well as creative projects from the same UI."
          <footer>- Erich Pfister, 2 August 2021</footer>
        </blockquote>
      </section>

      {/* Education Section */}
      <section className="education-section">
        <h2>A Python learning environment with everything ready to go</h2>
        <p>
          Python is a great language for teaching, but getting it installed and set up on all your students' computers can be
          less than easy. PyServe provides an environment that's ready to go — including a syntax-highlighting, error-checking
          editor, Python 2 and 3 consoles, and a full set of batteries included. Avoid all the hassles of getting Python
          installed on everyone's laptop, and making sure everyone can pip install all the right packages.
        </p>
        
        <div className="education-features">
          <div className="ed-feature">
            <h3>Distributing assignments and monitoring progress is easy</h3>
            <p>
              Once a student has nominated you as their teacher, you can see their files and Python consoles, so you can help
              them more easily. You can copy files into their accounts so that you can give them a starting point for their
              assignments, and you can see their solutions.
            </p>
          </div>
          
          <div className="ed-feature">
            <h3>All your students have the same environment</h3>
            <p>
              The same operating system, the same console, the same text editor — save yourself from having to customise your
              lessons and instructions for Windows/Mac/Linux, and from having to debug issues in different shells and editors.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Ready to get started?</h2>
        <p>Join thousands of developers and educators using PyServe every day.</p>
        <button 
          className="cta-primary" 
          onClick={() => navigate('/select-role')}
        >
          Sign Up Free
        </button>
      </section>
    </div>
  );
};

export default HomePage;