import React, { useState, useEffect } from 'react';
import { 
  FiServer, FiRefreshCw, FiTrash2, FiShield, FiBell, 
  FiLock, FiUnlock, FiSettings, FiActivity, FiAlertCircle
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = ({ darkMode }) => {
  // State for all the API data
  const [stats, setStats] = useState({system: {},
  security: {},
  deployments: {}
});
  const [apps, setApps] = useState({});
  const [blockedIPs, setBlockedIPs] = useState({});
  const [securityConfig, setSecurityConfig] = useState({});
  const [securityStats, setSecurityStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview',"notifications");
  const [ipToBlock, setIpToBlock] = useState('');

  // Mock data initialization
useEffect(() => {
  fetchBlockedIPs();
  fetchStats();
  fetchSecurityConfig();

  // if (activeTab === 'notifications') {
  //   fetchNotifications(); // Fetch only when tab is notifications
  //   fetchUnreadCount();
  // }
   fetchNotifications(); // Fetch only when tab is notifications
    fetchUnreadCount();
    // setNotifications();
    // setUnreadCount();

  const initializeMockData = () => {
    setStats({
      system: {
        cpu: 35.4,
        memory: 62.8,
        uptime: 1234567,
        requests_processed: 4231
      },
      security: {
        total_blocked: 12,
        rate_limited: 5,
        recent_blocks: {
          '192.168.1.1': 15,
          '10.0.0.5': 8,
          '172.16.0.3': 6
        }
      },
      deployments: {
        count: 4,
        active: 3
      }
    });

    setApps({
      'app-123': {
        path: '/var/www/app1',
        last_accessed: Date.now() / 1000 - 3600,
        resource_usage: {
          cpu: 15.2,
          memory: 32.5
        }
      },
      'app-456': {
        path: '/var/www/app2',
        last_accessed: Date.now() / 1000 - 7200,
        resource_usage: {
          cpu: 8.7,
          memory: 24.1
        }
      }
    });

    setSecurityConfig({
      malicious_threshold: 10,
      blocking_enabled: true,
      rate_limit_window: 60,
      max_requests_per_window: 100,
      admin_email: 'admin@example.com',
      alert_methods: ['email', 'dashboard'],
      alert_cooldown: 300
    });

    setSecurityStats({
      total_blocked: 12,
      rate_limited: 5,
      recent_attacks: 23
    });

    // Don't overwrite actual notification fetch with mock data:
    // setNotifications([...])
    // setUnreadCount(1)

    setLoading(false);
  };

  const timer = setTimeout(() => {
    initializeMockData();
  }, 500);

  return () => clearTimeout(timer);
}, []);

const fetchSecurityConfig = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;

  try {
    const response = await fetch("http://localhost:8080/admin/security/config", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    if (response.ok) {
      setSecurityConfig(data);
    } else {
      console.error("Failed to fetch security config", data.error);
    }
  } catch (err) {
    console.error("Network error fetching security config", err);
  }
};

  // Mock API functions
  // const handleReload = async () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 800);
  // };

  const deleteApp = async (appId) => {
    setApps(prev => {
      const newApps = {...prev};
      delete newApps[appId];
      return newApps;
    });
  };


const blockIP = async () => {
  if (!ipToBlock) return;

  try {
    const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
    const token = storedUser?.token;

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const response = await fetch('http://localhost:8080/admin/security/block-ip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ attach token properly
      },
      body: JSON.stringify({ ip: ipToBlock })
    });

    const data = await response.json();

    if (response.ok) {
      setBlockedIPs(prev => ({
        ...prev,
        [ipToBlock]: {
          count: securityConfig.malicious_threshold + 1,
          last_attempt: Date.now() / 1000,
          blocked: true
        }
      }));
      setIpToBlock('');
      alert(data.status); // optional feedback
    } else {
      alert(data.error || 'Failed to block IP');
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Network error occurred');
  }
};

 const unblockIP = async (ip) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
    const token = storedUser?.token;

    const response = await fetch('http://localhost:8080/admin/security/unblock-ip', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip })
    });

    const data = await response.json();

    if (response.ok) {
      // Remove from UI immediately or refetch list
      setBlockedIPs(prev => {
        const updated = { ...prev };
        delete updated[ip];
        return updated;
      });
      alert(data.status || `${ip} unblocked`);
    } else {
      alert(data.error || "Failed to unblock IP");
    }
  } catch (err) {
    console.error("Error unblocking IP:", err);
    alert("Network error while unblocking IP");
  }
};


const fetchBlockedIPs = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
    const token = storedUser?.token;

    const response = await fetch('http://localhost:8080/admin/blocked-ips', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();

    if (response.ok) {
      setBlockedIPs(data);  // data is an object like { "1.2.3.4": {...} }
    } else {
      alert(data.error || "Failed to load blocked IPs");
    }
  } catch (err) {
    console.error("Error fetching blocked IPs:", err);
    alert("Network error occurred while fetching blocked IPs");
  }
};
const handleReload = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;

  if (!token) {
    alert("Unauthorized: Missing token");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('http://localhost:8080/admin/reload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert("Server configuration reloaded successfully!");
    } else {
      alert(`Failed to reload config: ${data.error || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Reload error:", err);
    alert("Network error during reload");
  } finally {
    setTimeout(() => setLoading(false), 800); // fake delay for UI smoothness
  }
};

  
  const updateSecurityConfig = async (config) => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;

  try {
    const response = await fetch("http://localhost:8080/admin/security/config", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(config)
    });

    const data = await response.json();
    if (response.ok) {
      alert("Security config updated successfully.");
    } else {
      alert(data.error || "Update failed.");
    }
  } catch (err) {
    alert("Network error occurred.");
    console.error(err);
  }
};

  // Helper to format uptime
  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };
const fetchStats = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;

  if (!token) {
    console.error("No auth token found");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/admin/stats", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (response.ok) {
      setStats(data);
    } else {
      console.error("Failed to fetch stats:", data.error);
    }
  } catch (err) {
    console.error("Network error fetching stats:", err);
  }
};
const fetchNotifications = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;
  try {
    const res = await fetch('http://localhost:8080/api/notifications', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    setNotifications(data.notifications || []);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const fetchUnreadCount = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;
  try {
    const res = await fetch('http://localhost:8080/api/notifications/unread', {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    setUnreadCount(data.unread_count || 0);
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
};


const markNotificationsRead = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;

  try {
    await fetch('http://127.0.0.1:8080/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Optimistically update UI
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};


  // Helper to format last accessed time
  const formatLastAccessed = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className={`admin-loading ${darkMode ? 'dark' : 'light'}`}>
        <FiRefreshCw className="spin" size={32} />
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`admin-error ${darkMode ? 'dark' : 'light'}`}>
        <FiAlertCircle size={32} />
        <h3>Error loading dashboard</h3>
        <p>{error}</p>
        <button onClick={() => setLoading(true)}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <div className="admin-header">
        <h1><FiServer /> PyServe Admin Dashboard</h1>
        <button onClick={handleReload} className="reload-button">
          <FiRefreshCw /> Reload All
        </button>
      </div>

      {unreadCount > 0 && (
        <div className="notifications-banner" onClick={markNotificationsRead}>
          <FiBell /> {unreadCount} unread notifications
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <FiActivity /> Overview
        </button>
        <button 
          className={activeTab === 'apps' ? 'active' : ''}
          onClick={() => setActiveTab('apps')}
        >
          <FiServer /> Applications
        </button>
        <button 
          className={activeTab === 'security' ? 'active' : ''}
          onClick={() => setActiveTab('security')}
        >
          <FiShield /> Security
        </button>
        <button 
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell /> Notifications
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>System CPU</h3>
                <p>{stats?.system?.cpu || 0}%</p>
              </div>
              <div className="stat-card">
                <h3>Memory Usage</h3>
                <p>{stats?.system?.memory || 0}%</p>
              </div>
              <div className="stat-card">
                <h3>Server Uptime</h3>
                <p>{formatUptime(stats?.system?.uptime)}</p>
              </div>
              <div className="stat-card">
                <h3>Total Requests</h3>
                <p>{stats?.system?.requests_processed || 0}</p>
              </div>
            </div>
<div className="stats-grid">
  <div className="stat-card">
    <h3>Total Blocked Attempts</h3>
    <p>{stats?.security?.total_blocked || 0}</p>
  </div>
  <div className="stat-card">
    <h3>Rate Limited IPs</h3>
    <p>{stats?.security?.rate_limited || 0}</p>
  </div>
  <div className="stat-card">
    <h3>Deployments</h3>
    <p>{stats?.deployments?.count || 0} (Active: {stats?.deployments?.active || 0})</p>
  </div>
</div>
            <div className="security-overview">
              <h2><FiShield /> Security Overview</h2>
              <div className="security-stats">
                <div>
                  <h3>Blocked IPs</h3>
                  <p>{stats?.security?.total_blocked || 0}</p>
                </div>
                <div>
                  <h3>Rate Limited</h3>
                  <p>{stats?.security?.rate_limited || 0}</p>
                </div>
                <div>
                  <h3>Firewall Status</h3>
                  <p>{securityConfig?.blocking_enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="apps-section">
            <h2>Managed Applications ({Object.keys(apps).length})</h2>
            <div className="apps-list">
              {Object.keys(apps).length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Path</th>
                      <th>Last Accessed</th>
                      <th>CPU Usage</th>
                      <th>Memory Usage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(apps).map(([appId, appData]) => (
                      <tr key={appId}>
                        <td>{appId}</td>
                        <td>{appData.path}</td>
                        <td>{formatLastAccessed(appData.last_accessed)}</td>
                        <td>{appData.resource_usage?.cpu || 0}%</td>
                        <td>{appData.resource_usage?.memory || 0}%</td>
                        <td>
                          <button 
                            onClick={() => deleteApp(appId)}
                            className="delete-button"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No applications currently running</p>
              )}
            </div>
          </div>
        )}
{activeTab === 'security' && (
  <div className="security-section" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
    
    {/* Left Panel: Security Config */}
    <div className="security-config" style={{ flex: 1 }}>
      <h2>Security Configuration</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        updateSecurityConfig(securityConfig);
      }}>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={securityConfig.blocking_enabled || false}
              onChange={(e) => setSecurityConfig({
                ...securityConfig,
                blocking_enabled: e.target.checked
              })}
            />
            Blocking Enabled
          </label>
        </div>

        <div className="form-group">
          <label>Malicious Threshold</label>
          <input
            type="number"
            value={securityConfig.malicious_threshold || 0}
            onChange={(e) => setSecurityConfig({
              ...securityConfig,
              malicious_threshold: parseInt(e.target.value)
            })}
          />
        </div>

        <div className="form-group">
          <label>Rate Limit Window (s)</label>
          <input
            type="number"
            value={securityConfig.rate_limit_window || 0}
            onChange={(e) => setSecurityConfig({
              ...securityConfig,
              rate_limit_window: parseInt(e.target.value)
            })}
          />
        </div>

        <div className="form-group">
          <label>Max Requests Per Window</label>
          <input
            type="number"
            value={securityConfig.max_requests_per_window || 0}
            onChange={(e) => setSecurityConfig({
              ...securityConfig,
              max_requests_per_window: parseInt(e.target.value)
            })}
          />
        </div>

        <div className="form-group">
          <label>Admin Email</label>
          <input
            type="email"
            value={securityConfig.admin_email || ""}
            onChange={(e) => setSecurityConfig({
              ...securityConfig,
              admin_email: e.target.value
            })}
          />
        </div>

        <div className="form-group">
          <label>Alert Cooldown (s)</label>
          <input
            type="number"
            value={securityConfig.alert_cooldown || 0}
            onChange={(e) => setSecurityConfig({
              ...securityConfig,
              alert_cooldown: parseInt(e.target.value)
            })}
          />
        </div>

        <div className="form-group">
          <label>Alert Methods (comma-separated)</label>
          <input
            type="text"
            value={securityConfig.alert_methods?.join(", ") || ""}
            onChange={(e) => setSecurityConfig({
              ...securityConfig,
              alert_methods: e.target.value.split(",").map(v => v.trim())
            })}
          />
        </div>

        <button type="submit" className="update-button">Update Configuration</button>
      </form>
    </div>

    {/* Right Panel: IP Management */}
    <div className="ip-management" style={{ flex: 1 }}>
      <h2>IP Address Management</h2>

      <div className="block-ip-form">
        <input
          type="text"
          value={ipToBlock}
          onChange={(e) => setIpToBlock(e.target.value)}
          placeholder="Enter IP address to block"
        />
        <button onClick={blockIP}>
          <FiLock /> Block IP
        </button>
      </div>

      <h3>Blocked IP Addresses ({Object.keys(blockedIPs).length})</h3>
      {Object.keys(blockedIPs).length > 0 ? (
        <ul className="blocked-ips-list">
          {Object.entries(blockedIPs).map(([ip, data]) => (
            <li key={ip}>
              <div className="ip-info">
                <span className="ip-address">{ip}</span>
                <span className="ip-stats">Attempts: {data.count}</span>
              </div>
              <button
                onClick={() => unblockIP(ip)}
                className="unblock-button"
              >
                <FiUnlock /> Unblock
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No IP addresses currently blocked</p>
      )}
    </div>

  </div>
)}

        {/* {activeTab === 'security' && (
          <div className="security-section">
            <div className="security-config">
              <h2>Security Configuration</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                updateSecurityConfig(securityConfig);
              }}>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={securityConfig.blocking_enabled || false}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig,
                        blocking_enabled: e.target.checked
                      })}
                    />
                    Enable IP Blocking
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Malicious Threshold:
                    <input
                      type="number"
                      value={securityConfig.malicious_threshold || 10}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig,
                        malicious_threshold: parseInt(e.target.value)
                      })}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Rate Limit Window (sec):
                    <input
                      type="number"
                      value={securityConfig.rate_limit_window || 60}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig,
                        rate_limit_window: parseInt(e.target.value)
                      })}
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Max Requests:
                    <input
                      type="number"
                      value={securityConfig.max_requests_per_window || 100}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig,
                        max_requests_per_window: parseInt(e.target.value)
                      })}
                    />
                  </label>
                </div>
                <button type="submit">Save Configuration</button>
              </form>
            </div>

            <div className="ip-management">
              <h2>IP Address Management</h2>
              <div className="block-ip-form">
                <input
                  type="text"
                  value={ipToBlock}
                  onChange={(e) => setIpToBlock(e.target.value)}
                  placeholder="Enter IP address to block"
                />
                <button onClick={blockIP}>
                  <FiLock /> Block IP
                </button>
              </div>

              <h3>Blocked IP Addresses ({Object.keys(blockedIPs).length})</h3>
              {Object.keys(blockedIPs).length > 0 ? (
                <ul className="blocked-ips-list">
                  
                  {Object.entries(blockedIPs).map(([ip, data]) => (
                    <li key={ip}>
                      <div className="ip-info">
                        <span className="ip-address">{ip}</span>
                        <span className="ip-stats">Attempts: {data.count}</span>
                      </div>
                      <button 
                        onClick={() => unblockIP(ip)} 
                        className="unblock-button"
                      >
                        <FiUnlock /> Unblock
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No IP addresses currently blocked</p>
              )}
            </div>
          </div>
        )} */}
{activeTab === 'notifications' && (
  <div className="notifications-section">
    <h2>System Notifications</h2>
    <button onClick={markNotificationsRead} className="mark-read-button">
      Mark All as Read
    </button>

    {notifications.length > 0 ? (
      <ul className="notifications-list">
        {notifications.map((notification) => (
  <li key={notification.id || `${notification.type}-${notification.timestamp}`} className={notification.read ? 'read' : 'unread'}>
            <div className="notification-header">
              <span className="notification-type">{notification.type}</span>
              <span className="notification-time">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="notification-message">{notification.data}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No notifications available</p>
    )}
  </div>
)}
      
      </div>
    </div>
  );
};

export default AdminDashboard;