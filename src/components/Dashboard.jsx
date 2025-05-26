import React, { useState, useEffect } from 'react';
// import axiosinstance from './../Axiosinstance';
// import axiosInstance from '../Axiosinstance';
import axios from 'axios';
import { 
  FiUpload, FiRefreshCw, FiSun, FiMoon, FiPlay, 
  FiStopCircle, FiRotateCw, FiExternalLink, 
  FiAlertCircle, FiCheckCircle, FiInfo 
} from 'react-icons/fi';

const basUrl = 'http://localhost:8080/';
function Dashboard({ 
  darkMode, 
  toggleTheme, 
  serverUrl, 
  setServerUrl 
}) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessages, setStatusMessages] = useState([]);

  useEffect(() => {
    //fetchApps();
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
      
    })));
  } catch (err) {
    console.error("Fetch error:", err);
  }
};
    fetchData();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockApps = [
        { 
          id: 'app1', 
          name: 'Inventory Service',
          status: 'running', 
          lastDeployed: new Date().toISOString(),
          cpuUsage: '24%',
          memoryUsage: '512MB'
        },
        { 
          id: 'app2', 
          name: 'Data Processor',
          status: 'stopped', 
          lastDeployed: new Date(Date.now() - 86400000).toISOString(),
          cpuUsage: '0%',
          memoryUsage: '0MB'
        }
      ];
      setApps(mockApps);
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

  const handleDeploy = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      addStatusMessage('Please select a ZIP file first', 'error');
      return;
    }

    setLoading(true);
    addStatusMessage('Uploading and deploying application package...', 'info');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newApp = {
        id: `app${apps.length + 1}`,
        name: selectedFile.name.replace('.zip', ''),
        status: 'running',
        lastDeployed: new Date().toISOString(),
        cpuUsage: '0%',
        memoryUsage: '0MB'
      };
      
      setApps(prev => [newApp, ...prev]);
      addStatusMessage(`Successfully deployed ${newApp.name}`, 'success');
      setSelectedFile(null);
    } catch (error) {
      addStatusMessage('Deployment failed: Invalid package format', 'error');
    } finally {
      setLoading(false);
    }
  };

  const manageApp = async (appId, action) => {
    setLoading(true);
    addStatusMessage(`Sending ${action} command to application...`, 'info');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setApps(prev => prev.map(app => {
        if (app.id === appId) {
          const newStatus = action === 'stop' ? 'stopped' : 'running';
          return { 
            ...app, 
            status: newStatus,
            cpuUsage: newStatus === 'running' ? '18%' : '0%',
            memoryUsage: newStatus === 'running' ? '256MB' : '0MB'
          };
        }
        return app;
      }));
      
      addStatusMessage(`Application ${action}ed successfully`, 'success');
    } catch (error) {
      addStatusMessage(`Failed to ${action} application`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const startApp = async (appId,status) => {
    axios.get(`${basUrl}manage/${status}/${appId}`)
      .then(response => {
        setApps(prev => prev.map(app => {
          if (app.id === appId) {
            const newStatus = status === 'stop' ? 'stopped' : 'running';
            return { 
              ...app, 
              status: newStatus,
              cpuUsage: newStatus === 'running' ? '18%' : '0%',
              memoryUsage: newStatus === 'running' ? '256MB' : '0MB'
            };
          }
          return app;
        }));
        addStatusMessage(`Application ${status}ed successfully`, 'success');
      })
      .catch(error => { 
        addStatusMessage(`Failed to ${status} application`, 'error');
      });
  }

  const deployApplication = async (e) => {
    let formData = new FormData();
    formData.append('file', selectedFile);
   axios.post(`${basUrl}manage/deploy`, {
      file: formData
    })  
    .then(response => {
      if (response.status == 200) {
      setApps(prev => [response.data, ...prev]);
      addStatusMessage(`Successfully deployed ${response.data.app_id} `, 'success');
      setSelectedFile(null);
      }

    })
    .catch(error => {
      addStatusMessage('Deployment failed: Invalid package format 22222222222222', 'error');
    });
  }

  const getStatusIcon = (type) => {
    switch(type) {
      case 'error': return <FiAlertCircle className="icon-error" />;
      case 'success': return <FiCheckCircle className="icon-success" />;
      default: return <FiInfo className="icon-info" />;
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">⚙️</div>
            <h1>PyServe Console</h1>
          </div>
          <div className="header-controls">
            <div className="server-url">
              <input 
                type="text" 
                value={serverUrl} 
                onChange={(e) => setServerUrl(e.target.value)} 
                placeholder="Server endpoint"
                className="url-input"
              />
            </div>
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="deployment-section card">
          <div className="section-title">
            <h2>Application Deployment</h2>
            <p className="section-description">Upload Python application package</p>
          </div>
          
          <form onSubmit={handleDeploy} className="deploy-form">
            <div className="file-upload-container">
              <label className="file-upload-label">
                <input 
                  type="file" 
                  accept=".zip" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                  className="file-input"
                />
                <div className={`upload-area ${selectedFile ? 'has-file' : ''}`}>
                  {selectedFile ? (
                    <div className="file-info">
                      <div className="file-icon">
                        <FiUpload size={24} />
                      </div>
                      <div className="file-details">
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FiUpload size={32} className="upload-icon" />
                      <p className="upload-text">Drag & drop ZIP file here</p>
                      <p className="upload-subtext">or click to browse files</p>
                      <p className="file-requirements">Supports Python applications in ZIP format</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading || !selectedFile} 
                className="deploy-button"
                onClick={deployApplication}
              >
                {loading ? (
                  <span className="button-loading">
                    <FiRefreshCw className="spin" /> Deploying...
                  </span>
                ) : (
                  <>Deploy Application</>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="apps-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Deployed Applications</h2>
              <p className="section-description">{apps.length} application{apps.length !== 1 ? 's' : ''} deployed</p>
            </div>
            <button 
              onClick={fetchApps} 
              disabled={loading}
              className="refresh-button"
            >
              <FiRefreshCw className={loading ? 'spin' : ''} />
              Refresh
            </button>
          </div>
          
          {loading && apps.length === 0 ? (
            <div className="apps-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="app-card skeleton">
                  <div className="skeleton-line" style={{ width: '70%' }}></div>
                  <div className="skeleton-line" style={{ width: '100%' }}></div>
                  <div className="skeleton-line" style={{ width: '90%' }}></div>
                </div>
              ))}
            </div>
          ) : apps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No applications deployed</h3>
              <p>Upload a Python application package to get started</p>
            </div>
          ) : (
            <div className="apps-grid">
              {apps.map(app => (
                <div key={app.id} className={`app-card ${app.status}`}>
                  <div className="app-header">
                    <div className="app-status-indicator"></div>
                    <h3 className="app-name">{app.name}</h3>
                    <span className={`app-status ${app.status}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <div className="app-details">
                    <div className="app-meta">
                      <span>ID: {app.id}</span>
                      <span>Last deployed: {new Date(app.lastDeployed).toLocaleString()}</span>
                    </div>
                    <div className="app-metrics">
                      <div className="metric">
                        <span className="metric-label">CPU</span>
                        <span className="metric-value">{app.cpuUsage}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Memory</span>
                        <span className="metric-value">{app.memoryUsage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="app-actions">
                    <button 
                      onClick={() => startApp(app.id,'start')} 
                      disabled={app.status === 'running'}
                      className="action-button start-button"
                    >
                      <FiPlay size={14} /> Start
                    </button>
                    <button 
                      onClick={() => startApp(app.id, 'stop')} 
                      disabled={app.status !== 'running'}
                      className="action-button stop-button"
                    >
                      <FiStopCircle size={14} /> Stop
                    </button>
                    <button 
                      onClick={() => startApp(app.id, 'restart')}
                      className="action-button restart-button"
                    >
                      <FiRotateCw size={14} /> Restart
                    </button>
                    <a 
                      href={`${serverUrl}/apps/${app.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-button open-button"
                    >
                      <FiExternalLink size={14} /> Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="status-section card">
          <div className="section-header">
            <div className="section-title">
              <h2>Activity Log</h2>
              <p className="section-description">System events and operations</p>
            </div>
            <button 
              onClick={() => setStatusMessages([])} 
              className="clear-button"
            >
              Clear Log
            </button>
          </div>
          <div className="status-messages">
            {statusMessages.length === 0 ? (
              <div className="empty-logs">
                <div className="empty-icon">📝</div>
                <h3>No activity yet</h3>
                <p>System events will appear here</p>
              </div>
            ) : (
              <ul>
                {statusMessages.map(msg => (
                  <li key={msg.id} className={`log-entry ${msg.type}`}>
                    <div className="log-icon">{getStatusIcon(msg.type)}</div>
                    <div className="log-content">
                      <div className="log-message">{msg.message}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;