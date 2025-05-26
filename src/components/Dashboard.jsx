import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiUpload, FiRefreshCw, FiSun, FiMoon, FiPlay, 
  FiStopCircle, FiRotateCw, FiExternalLink, 
  FiAlertCircle, FiCheckCircle, FiInfo, FiCode, FiPackage 
} from 'react-icons/fi';

const basUrl = 'http://localhost:8080/';

const CodeDeployer = ({ addStatusMessage }) => {
  const [pythonCode, setPythonCode] = useState('');
  const [endpointsConfig, setEndpointsConfig] = useState(JSON.stringify({
    "/": {
      "GET": "handle_request"
    }
  }, null, 2));
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    setResponse(null);
    
    try {
      // Validate endpoints config
      let parsedEndpoints;
      try {
        parsedEndpoints = JSON.parse(endpointsConfig);
      } catch (e) {
        throw new Error(`Invalid endpoints JSON: ${e.message}`);
      }

      if (!pythonCode.trim()) {
        throw new Error('Please enter Python code to deploy');
      }

      const res = await axios.post(`${basUrl}deploy/python`, {
        code: pythonCode,
        endpoints: parsedEndpoints
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setResponse({
        status: 'success',
        data: res.data
      });
      
      addStatusMessage(`Successfully deployed code as app ${res.data.app_id}`, 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setResponse({
        status: 'error',
        message: errorMsg
      });
      addStatusMessage(`Code deployment failed: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deployer-container">
      <div className="code-section">
        <label>Python Code:</label>
        <textarea
          value={pythonCode}
          onChange={(e) => setPythonCode(e.target.value)}
          placeholder={`def handle_request(req):\n    return {"message": "Hello from my deployed app!"}`}
          className="code-input"
          rows={15}
        />
      </div>

      <div className="config-section">
        <label>Endpoints Configuration (JSON):</label>
        <textarea
          value={endpointsConfig}
          onChange={(e) => setEndpointsConfig(e.target.value)}
          className="config-input"
          rows={8}
        />
      </div>

      <button 
        onClick={handleDeploy} 
        disabled={loading || !pythonCode.trim()}
        className="deploy-button"
      >
        {loading ? 'Deploying...' : 'Deploy Code'}
      </button>

      {response && (
        <div className={`response ${response.status}`}>
          <h3>{response.status === 'success' ? '✓ Deployment Successful' : '✗ Deployment Failed'}</h3>
          {response.status === 'success' ? (
            <>
              <p><strong>App ID:</strong> {response.data.app_id}</p>
              <p><strong>Endpoints:</strong></p>
              <ul>
                {Object.entries(response.data.endpoints || {}).map(([path, methods]) => (
                  Object.entries(methods).map(([method, handler]) => (
                    <li key={`${method}-${path}`}>
                      <code>{method} {path} → {handler}()</code>
                    </li>
                  ))
                ))}
              </ul>
            </>
          ) : (
            <p>{response.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [activeDeployTab, setActiveDeployTab] = useState('zip'); // 'zip' or 'code'

  useEffect(() => {
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
  }, []);

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

  const deployApplication = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      addStatusMessage('Please select a ZIP file first', 'error');
      return;
    }

    setLoading(true);
    addStatusMessage('Uploading and deploying application package...', 'info');

    try {
      let formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post(`${basUrl}manage/deploy`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        setApps(prev => [{
          id: response.data.app_id,
          name: response.data.name || selectedFile.name.replace('.zip', ''),
          status: 'running',
          lastDeployed: new Date().toISOString(),
          cpuUsage: '0%',
          memoryUsage: '0MB'
        }, ...prev]);
        addStatusMessage(`Successfully deployed ${response.data.app_id}`, 'success');
        setSelectedFile(null);
      }
    } catch (error) {
      addStatusMessage('Deployment failed: ' + (error.response?.data?.error || 'Invalid package format'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const startApp = async (appId, action) => {
    try {
      await axios.get(`${basUrl}manage/${action}/${appId}`);
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
    }
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
            <div className="deploy-tabs">
              <button
                className={`tab-button ${activeDeployTab === 'zip' ? 'active' : ''}`}
                onClick={() => setActiveDeployTab('zip')}
              >
                <FiPackage /> ZIP Deployment
              </button>
              <button
                className={`tab-button ${activeDeployTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveDeployTab('code')}
              >
                <FiCode /> Code Editor
              </button>
            </div>
          </div>
          
          {activeDeployTab === 'zip' ? (
            <form onSubmit={deployApplication} className="deploy-form">
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
          ) : (
            <CodeDeployer addStatusMessage={addStatusMessage} />
          )}
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

      <style jsx>{`
        .deployer-container {
          max-width: 100%;
          margin-top: 20px;
          font-family: Arial, sans-serif;
        }
        
        .code-section,
        .config-section {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin: 15px 0 5px;
          font-weight: bold;
          color: #444;
        }
        
        .code-input, .config-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          background-color: #f8f8f8;
        }
        
        .code-input {
          min-height: 300px;
        }
        
        .config-input {
          min-height: 150px;
        }
        
        .deploy-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .deploy-button:hover {
          background-color: #45a049;
        }
        
        .deploy-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .response {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
        }
        
        .success {
          background-color: #e8f5e9;
          border-left: 4px solid #4CAF50;
        }
        
        .error {
          background-color: #ffebee;
          border-left: 4px solid #f44336;
        }
        
        ul {
          padding-left: 20px;
        }
        
        li {
          margin: 5px 0;
        }
        
        code {
          background-color: #f1f1f1;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }

        .deploy-tabs {
          display: flex;
          margin-top: 15px;
          border-bottom: 1px solid #ddd;
        }

        .tab-button {
          padding: 8px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
        }

        .tab-button.active {
          color: #4CAF50;
          border-bottom-color: #4CAF50;
          font-weight: bold;
        }

        .tab-button:hover {
          background-color: #f5f5f5;
        }

        /* Original dashboard styles */
        .app-header {
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 15px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .logo-icon {
          font-size: 24px;
        }
        
        .header-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .server-url {
          position: relative;
        }
        
        .url-input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 250px;
        }
        
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
        }
        
        main {
          max-width: 1200px;
          margin: 20px auto;
          padding: 0 20px;
        }
        
        .card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .section-title {
          margin-bottom: 20px;
        }
        
        .section-title h2 {
          margin: 0;
          color: #333;
        }
        
        .section-description {
          margin: 5px 0 0;
          color: #666;
          font-size: 14px;
        }
        
        .file-upload-container {
          margin-bottom: 20px;
        }
        
        .file-input {
          display: none;
        }
        
        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .upload-area:hover {
          border-color: #4CAF50;
        }
        
        .upload-area.has-file {
          border-style: solid;
          padding: 20px;
          text-align: left;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .file-icon {
          color: #4CAF50;
        }
        
        .file-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .file-size {
          color: #666;
          font-size: 12px;
        }
        
        .upload-icon {
          color: #4CAF50;
          margin-bottom: 10px;
        }
        
        .upload-text {
          font-weight: bold;
          margin: 5px 0;
        }
        
        .upload-subtext {
          color: #666;
          margin: 5px 0 10px;
        }
        
        .file-requirements {
          color: #999;
          font-size: 12px;
          margin-top: 10px;
        }
        
        .deploy-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .deploy-button:hover {
          background-color: #45a049;
        }
        
        .deploy-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .button-loading {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .refresh-button {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .refresh-button:hover {
          background-color: #f5f5f5;
        }
        
        .apps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .app-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          border-left: 4px solidrgb(94, 201, 98);
        }
        
        .app-card.stopped {
          border-left-color: #f44336;
          opacity: 0.8;
        }
        
        .app-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .app-status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #4CAF50;
          margin-right: 10px;
        }
        
        .app-card.stopped .app-status-indicator {
          background-color: #f44336;
        }
        
        .app-name {
          flex: 1;
          margin: 0;
          font-size: 18px;
        }
        
        .app-status {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 12px;
          background-color: #e8f5e9;
          color: #4CAF50;
        }
        
        .app-card.stopped .app-status {
          background-color: #ffebee;
          color: #f44336;
        }
        
        .app-meta {
          font-size: 12px;
          color: #666;
          margin-bottom: 15px;
        }
        
        .app-meta span {
          display: block;
          margin-bottom: 5px;
        }
        
        .app-metrics {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .metric {
          flex: 1;
          text-align: center;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        
        .metric-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .metric-value {
          font-weight: bold;
          color: #333;
        }
        
        .app-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .start-button {
          background-color: #e8f5e9;
          color: #4CAF50;
        }
        
        .start-button:hover {
          background-color: #d0ebd2;
        }
        
        .stop-button {
          background-color: #ffebee;
          color: #f44336;
        }
        
        .stop-button:hover {
          background-color: #ffcdd2;
        }
        
        .restart-button {
          background-color: #e3f2fd;
          color: #2196F3;
        }
        
        .restart-button:hover {
          background-color: #bbdefb;
        }
        
        .open-button {
          background-color: #f3e5f5;
          color: #9C27B0;
          text-decoration: none;
        }
        
        .open-button:hover {
          background-color: #e1bee7;
        }
        
        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .skeleton {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }
        
        .skeleton-line {
          height: 12px;
          background-color: #e0e0e0;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background-color: #fafafa;
          border-radius: 8px;
          border: 1px dashed #ddd;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.5;
        }
        
        .empty-state h3 {
          margin: 10px 0 5px;
          color: #333;
        }
        
        .empty-state p {
          color: #666;
          margin: 0;
        }
        
        .clear-button {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px 15px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .clear-button:hover {
          background-color: #f5f5f5;
        }
        
        .status-messages {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .log-entry {
          display: flex;
          gap: 10px;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .log-entry:last-child {
          border-bottom: none;
        }
        
        .log-entry.info {
          background-color: #f5f5f5;
        }
        
        .log-entry.success {
          background-color: #e8f5e9;
        }
        
        .log-entry.error {
          background-color: #ffebee;
        }
        
        .log-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .icon-info {
          color: #2196F3;
        }
        
        .icon-success {
          color: #4CAF50;
        }
        
        .icon-error {
          color: #f44336;
        }
        
        .log-content {
          flex: 1;
        }
        
        .log-message {
          font-size: 14px;
        }
        
        .empty-logs {
          text-align: center;
          padding: 40px 20px;
          background-color: #fafafa;
          border-radius: 8px;
          border: 1px dashed #ddd;
        }
      `}</style>
    </>
  );
}

export default Dashboard;

