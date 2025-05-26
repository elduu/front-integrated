// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import './App.css';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import HomePage from './components/HomePage';
// import Dashboard from './components/Dashboard';
// import SignUp from './components/SignUp';
// import Login from './components/Login';
// import AdminDashboard from './components/AdminDashboard';
// import RoleSelection from './components/RoleSelection';
// import AdminLogin from './components/AdminLogin';

// function App() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [serverUrl, setServerUrl] = useState('http://localhost:8000');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for existing session on initial load
//   useEffect(() => {
//     const storedUser = localStorage.getItem('pyserve_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//   };

//   // Login handler with proper redirection
//  const handleLogin = async (credentials, navigate) => {
//   // try {
//   //   setLoading(true);
//   //   const response = await fetch(`${serverUrl}/login`, {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify(credentials),
//   //   });

//   //   const data = await response.json();

//   //   if (!response.ok) {
//   //     return { success: false, error: data.error || 'Login failed' };
//   //   }

//   //   const userData = {
//   //     email: credentials.email,
//   //     isAdmin: isAdmin || data.is_admin, // adjust according to backend response
//   //     token: data.token,
//   //   };

//   //   setUser(userData);
//   //   localStorage.setItem('pyserve_user', JSON.stringify(userData));

//   //   if (navigate) {
//   //     navigate(userData.isAdmin ? "/admin" : "/dashboard");
//   //   }

//   //   return { success: true };
//   // } catch (err) {
//   //   return { success: false, error: "Network error" };
//   // } finally {
//   //   setLoading(false);
//   // }
// };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('pyserve_user');
//   };

//   // Protected Route component
//   const ProtectedRoute = ({ children }) => {
//     if (loading) return <div className="loading-spinner">Loading...</div>;
//     return user ? children : <Navigate to="/login" replace />;
//   };

//   // Admin Route component
//   const AdminRoute = ({ children }) => {
//     if (loading) return <div className="loading-spinner">Loading...</div>;
//     return user?.isAdmin ? children : <Navigate to="/dashboard" replace />;
//   };

//   return (
   


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import RoleSelection from './components/RoleSelection';
import AdminLogin from './components/AdminLogin';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [serverUrl, setServerUrl] = useState('http://localhost:8000');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('pyserve_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Login handler with proper redirection
  const handleLogin = async (credentials, navigate) => {
    // try {
    //   setLoading(true);
      
    //   // Simulated authentication - REPLACE WITH REAL API CALL
    //   // await new Promise(resolve => setTimeout(resolve, 500));
      
    //   // const userData = {
    //   //   id: Date.now(),
    //   //   name: credentials.email.split('@')[0],
    //   //   email: credentials.email,
    //   //   isAdmin: credentials.email.includes('admin'), // Auto-admin if email contains "admin"
    //   //   token: 'mock-token-' + Math.random().toString(36).slice(2)
    //   // };

    //   // setUser(userData);
    //   // localStorage.setItem('pyserve_user', JSON.stringify(userData));
      
    //   // // Redirect after state update
    //   // if (userData.isAdmin) {
    //   //   navigate('/admin');
    //   // } else {
    //   //   navigate('/dashboard');
    //   // }
      
    //   return { success: true };
    // } catch (error) {
    //   console.error('Login error:', error);
    //   return { 
    //     success: false, 
    //     error: error.message || 'Login failed' 
    //   };
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pyserve_user');
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="loading-spinner">Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
  };

  // Admin Route component
  const AdminRoute = ({ children }) => {
    if (loading) return <div className="loading-spinner">Loading...</div>;
    return user?.isAdmin ? children : <Navigate to="/dashboard" replace />;
  };

  return (
   <Router>
      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        <Navbar 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isAdmin={user?.isAdmin}
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
            
            {/* Role Selection Route */}
            <Route 
              path="/select-role" 
              element={
                user ? (
                  <Navigate to={user.isAdmin ? '/admin' : '/dashboard'} replace />
                ) : (
                  <RoleSelection darkMode={darkMode} />
                )
              } 
            />
            
            {/* Admin Login Route */}
            <Route 
              path="/admin-login" 
              element={
                user? (
                  <Navigate to="/admin" replace />
                ) : (
                  <AdminLoginWrapper 
                    darkMode={darkMode}
                    // onLogin={handleAdminLogin}
                    loading={loading}
                    setUser={setUser}
                  />
                )
              } 
            />
            
            <Route 
              path="/login" 
              element={
                user ? (
                 <Navigate to={user.isAdmin ? '/admin' : '/dashboard'} replace />
                ) : (
                  <LoginWrapper 
                    darkMode={darkMode}
                    onLogin={handleLogin}
                    loading={loading}
                    setUser={setUser}
                  />
                )
              } 
            />
            
            <Route path="/signup" element={<SignUp darkMode={darkMode} />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard 
                    darkMode={darkMode}
                    toggleTheme={toggleTheme}
                    serverUrl={serverUrl}
                    setServerUrl={setServerUrl}
                    user={user}
                  />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard darkMode={darkMode} user={user}  
        setUser={setUser}/>
                </AdminRoute>
              } 
            />
          </Routes>
        </main>

        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

// Helper component to access navigate in Login
function LoginWrapper({ darkMode, loading, setUser }) {

  const [localLoading, setLocalLoading] = useState(false);

  const onLogin = async ({email, password }) => {
    setLocalLoading(true);
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

     if (response.ok) {
  const userData = {
    email,
    token: data.token,
  };
  setUser(userData);
  localStorage.setItem("pyserve_user", JSON.stringify(userData));

  // Redirect to dashboard regardless of role
  window.location.href = "http://localhost:5173";

  return { success: true };
}
else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "Network error" };
    } finally {
      setLocalLoading(false);
    }
  };

  return <Login darkMode={darkMode} onLogin={onLogin} loading={localLoading || loading} />;
}

function AdminLoginWrapper({ darkMode, loading, setUser }) {
  const navigate = useNavigate();

  const handleAdminLogin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Invalid admin credentials" };
      }

      const userData = {
        username: credentials.username,
        isAdmin: true,
        token: data.token,
      };

      setUser(userData); // ✅ set app state
      localStorage.setItem("pyserve_user", JSON.stringify(userData));
      navigate("/admin");

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  return <AdminLogin darkMode={darkMode} onLogin={handleAdminLogin} loading={loading} />;
}


export default App;