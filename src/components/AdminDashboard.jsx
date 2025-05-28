import React, { useState, useEffect } from 'react';
import { 
  FiServer, FiRefreshCw, FiTrash2, FiShield, FiBell, 
  FiLock, FiUnlock, FiSettings, FiActivity, FiAlertCircle
} from 'react-icons/fi';
import './AdminDashboard.css';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend,
} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);
import NotificationsSection from "./NotificationsSection"; 
const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : window.location.origin;
const basUrl = 'http://localhost:8080/';

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

  if (activeTab === 'notifications') {
    // fetchNotifications(); // Fetch only when tab is notifications
    fetchUnreadCount();
  }
  if (activeTab === 'apps') {
    fetchApps();
  }
   fetchNotifications(); // Fetch only when tab is notifications
    // fetchUnreadCount();
    // setNotifications();
    // setUnreadCount();
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`${basUrl}manage/apps`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setApps(response.data.map(app => ({
          id: app.app_id,
          name: app.name, 
          status: app.status,
          lastDeployed: app.deployed_at,
          cpuUsage: app.cpuUsage || '0%',
          memoryUsage: app.memoryUsage || '0MB'
        })));
      } catch (err) {
        console.error("Fetch error:", err);
        addStatusMessage("Failed to fetch applications", "error");
      }
    };
    fetchData();
  

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${basUrl}manage/apps`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setApps(response.data.map(app => ({
        id: app.app_id,
        name: app.name, 
        status: app.status,
        lastDeployed: app.deployed_at,
        cpuUsage: app.cpuUsage || '0%',
        memoryUsage: app.memoryUsage || '0MB'
      })));
      addStatusMessage('Applications refreshed successfully', 'success');
    } catch (error) {
      addStatusMessage('Error fetching applications', 'error');
    } finally {
      setLoading(false);
    }
  };
  const addStatusMessage = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setStatusMessages(prev => [
      { id: Date.now(), message: `${timestamp} - ${message}`, type },
      ...prev.slice(0, 19)
    ]);
  };

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

    // setApps({
    //   'app-123': {
    //     path: '/var/www/app1',
    //     last_accessed: Date.now() / 1000 - 3600,
    //     resource_usage: {
    //       cpu: 15.2,
    //       memory: 32.5
    //     }
    //   },
    //   'app-456': {
    //     path: '/var/www/app2',
    //     last_accessed: Date.now() / 1000 - 7200,
    //     resource_usage: {
    //       cpu: 8.7,
    //       memory: 24.1
    //     }
    //   }
    // });

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
    const response = await fetch(`${BASE_URL}/admin/security/config` ,{
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

  // const deleteApp = async (appId) => {
  //   setApps(prev => {
  //     const newApps = {...prev};
  //     delete newApps[appId];
  //     return newApps;
  //   });
  // };

const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8080'
  : window.location.origin;
const blockIP = async () => {
  if (!ipToBlock) return;

  try {
    const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
    const token = storedUser?.token;

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const response = await fetch(`${BASE_URL}/admin/security/block-ip`, {
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

    const response = await fetch(`${BASE_URL}/admin/security/unblock-ip`, {
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

    const response = await fetch(`${BASE_URL}/admin/blocked-ips`, {
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
    const response = await fetch(`${BASE_URL}/admin/reload`, {
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
    const response = await fetch(`${BASE_URL}/admin/security/config`, {
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
    const response = await fetch(`${BASE_URL}/admin/stats`, {
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
// const fetchNotifications = async () => {
//   const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
//   const token = storedUser?.token;
//   try {
//     const res = await fetch('http://localhost:8080/api/notifications', {
//       method: 'GET',
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     const data = await res.json();
//     setNotifications(data.notifications || []);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//   }
// };
const fetchNotifications = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;

  try {
    const res = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const result = await res.json();

    const parsed = (result.notifications || []).map((n) => ({
      id: n.id,
      type: n.type,
      read: n.read,
      time: new Date(n.timestamp * 1000).toLocaleString(),
      ip: n.data.ip,
      method: n.data.method,
      path: n.data.path,
      findings: n.data.findings,
      attackType: n.data.attack_type,
      violationCount: n.data.violation_count,
      requestCount: n.data.request_count,
    }));

    setNotifications(parsed);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const fetchUnreadCount = async () => {
  const storedUser = JSON.parse(localStorage.getItem("pyserve_user"));
  const token = storedUser?.token;
  try {
    const res = await fetch(`${BASE_URL}/api/notifications/unread`, {
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
    await fetch(`${BASE_URL}/api/notifications/mark-read`, {
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

 const deleteApp = async (appId) => {
    try {
      await axios.delete(`${BASE_URL}/admin/apps/${appId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      addStatusMessage(`Deleted app ${appId}`, "success");
      // Refresh app list after deletion
      fetchApps();
    } catch (error) {
      addStatusMessage(`Error deleting app ${appId}`, "error");
      console.error("Error deleting app:", error);
    }
  };


// CPU & Memory Chart Data
const resourceData = {
  labels: ['CPU', 'Memory'],
  datasets: [
    {
      label: 'Usage (%)',
      data: [stats?.system?.cpu || 0, stats?.system?.memory || 0],
      backgroundColor: ['#FF6384', '#36A2EB'],
      borderRadius: 5,
    },
  ],
};

const securityPieData = {
  labels: ['Blocked IPs', 'Rate Limited'],
  datasets: [
    {
      data: [stats?.security?.total_blocked || 0, stats?.security?.rate_limited || 0],
      backgroundColor: ['#FF9F40', '#FFCD56'],
      hoverOffset: 4,
    },
  ],
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
    <div className="admin-header flex justify-between items-center px-6 py-4 bg-gray-800 text-white rounded-t">
      <h1 className="text-2xl font-bold"><FiServer className="inline" /> PyServe Admin Dashboard</h1>
      <button onClick={handleReload} className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded">
        <FiRefreshCw className="inline mr-1" /> Reload All
      </button>
    </div>

    {unreadCount > 0 && (
      <div onClick={markNotificationsRead} className="bg-yellow-100 text-yellow-800 p-3 cursor-pointer">
        <FiBell className="inline mr-1" /> {unreadCount} unread notifications
      </div>
    )}

    <div className="admin-tabs flex border-b bg-gray-100">
  {[
    { key: 'overview', icon: <FiActivity /> },
    { key: 'apps', icon: <FiServer /> },
    { key: 'security', icon: <FiShield /> },
    { key: 'ip-management', icon: <FiLock /> },
    { key: 'notifications', icon: <FiBell /> }
  ].map(({ key, icon }) => (
    <button
      key={key}
      className={`py-2 px-4 ${activeTab === key ? 'bg-white border-t-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
      onClick={() => setActiveTab(key)}
    >
      {icon} {' '}{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </button>
  ))}


    </div>
{activeTab === 'overview' && (
  <div className="p-6 space-y-6">

    {/* Top Quick Stats Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-1">CPU Usage</h4>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.system?.cpu || 0}%</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-1">Memory Usage</h4>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.system?.memory || 0}%</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-1">Blocked IPs</h4>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.security?.total_blocked || 0}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 text-center">
        <h4 className="text-sm text-gray-500 dark:text-gray-300 mb-1">Rate Limited</h4>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.security?.rate_limited || 0}</p>
      </div>
    </div>

    {/* Chart Section */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bar Chart Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Usage</h3>
        <div className="h-64">
          <Bar data={resourceData} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div><strong>Uptime:</strong> {formatUptime(stats?.system?.uptime)}</div>
          <div><strong>Requests:</strong> {stats?.system?.requests_processed}</div>
        </div>
      </div>

      {/* Doughnut Chart Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Security Overview</h3>
        <div className="w-40 h-40">
          <Doughnut data={securityPieData} />
        </div>
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2 w-full text-center">
          <p><strong>Firewall:</strong> {securityConfig?.blocking_enabled ? '🟢 Enabled' : '🔴 Disabled'}</p>
          <p><strong>Deployments:</strong> {stats?.deployments?.count || 0} (Active: {stats?.deployments?.active})</p>
        </div>
      </div>
    </div>
  </div>
)}


       
      {/* Your tab controls here */}
 {activeTab === "apps" && (
  <div className="apps-section p-6 bg-gray-900 rounded-xl shadow-lg">
    <h1>
      Managed Applications <span className="text-orange-400">({apps.length})</span>
    </h1>

    {loading ? (
      <p className="text-gray-400">Loading apps...</p>
    ) : apps.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Deployed</th>
              <th className="px-4 py-3">CPU Usage</th>
              <th className="px-4 py-3">Memory Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {apps.map(({ id, status, lastDeployed, cpuUsage, memoryUsage }) => (
              <tr
                key={id}
                className="hover:bg-gray-800 transition-all duration-200"
              >
                <td className="px-4 py-3">{id}</td>
              
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      status === "running"
                        ? "bg-green-600 text-white"
                        : status === "stopped"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(lastDeployed).toLocaleString()}
                </td>
                <td className="px-4 py-3">{cpuUsage}</td>
                <td className="px-4 py-3">{memoryUsage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-400">No applications currently running.</p>
    )}
  </div>
)}


    
 
{activeTab === 'security' && (
  <div className="apps-section p-6 bg-gray-900 rounded-xl shadow text-white">
    <h2 className="text-xl font-semibold mb-4"><FiShield className="inline mr-2" /> Security Configuration</h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateSecurityConfig(securityConfig);
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {[
        { label: 'Blocking Enabled', type: 'checkbox', field: 'blocking_enabled' },
        { label: 'Malicious Threshold', type: 'number', field: 'malicious_threshold' },
        { label: 'Rate Limit Window (s)', type: 'number', field: 'rate_limit_window' },
        { label: 'Max Requests Per Window', type: 'number', field: 'max_requests_per_window' },
        { label: 'Alert Cooldown (s)', type: 'number', field: 'alert_cooldown' },
        { label: 'Alert Methods (comma-separated)', type: 'text', field: 'alert_methods' }
      ].map(({ label, type, field }) => (
        <div key={field}>
          <label className="block mb-1">{label}</label>
          {type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={securityConfig[field] || false}
              onChange={(e) => setSecurityConfig({ ...securityConfig, [field]: e.target.checked })}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          ) : (
            <input
              type={type}
              value={
                field === 'alert_methods'
                  ? (securityConfig.alert_methods || []).join(', ')
                  : securityConfig[field] || ''
              }
              onChange={(e) =>
                setSecurityConfig({
                  ...securityConfig,
                  [field]:
                    field === 'alert_methods'
                      ? e.target.value.split(',').map(v => v.trim())
                      : parseInt(e.target.value)
                })
              }
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            />
          )}
        </div>
      ))}
      <div className="col-span-full">
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded">
          Update Configuration
        </button>
      </div>
    </form>
  </div>
)}


   {activeTab === 'ip-management' && (
  <div className="apps-section p-6 bg-gray-900 rounded-xl shadow text-white">
    <h2 className="text-xl font-semibold mb-4"><FiLock className="inline mr-2" /> IP Address Management</h2>

    <div className="flex gap-4 mb-6">
      <input
        type="text"
        value={ipToBlock}
        onChange={(e) => setIpToBlock(e.target.value)}
        placeholder="Enter IP address to block"
        className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
      />
      <button onClick={blockIP} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">
        <FiLock className="inline mr-1" /> Block IP
      </button>
    </div>

    <h3 className="text-lg mb-3">Blocked IP Addresses ({Object.keys(blockedIPs).length})</h3>
    {Object.keys(blockedIPs).length > 0 ? (
      <ul className="space-y-4">
        {Object.entries(blockedIPs).map(([ip, data]) => (
          <li key={ip} className="bg-gray-800 p-3 rounded flex justify-between items-center">
            <div>
              <p className="text-sm"><strong>IP:</strong> {ip}</p>
              <p className="text-sm text-gray-400">Attempts: {data.count}</p>
            </div>
            <button
              onClick={() => unblockIP(ip)}
              className="text-red-400 hover:text-red-600"
            >
              <FiUnlock className="inline mr-1" /> Unblock
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No IP addresses currently blocked.</p>
    )}
  </div>
)}

     
  {activeTab === 'notifications' && (
        <NotificationsSection
          notifications={notifications}
          markNotificationsRead={markNotificationsRead}
          blockIP={blockIP}
        />
      )}
      
      </div>
 
  );
  
};

export default AdminDashboard;