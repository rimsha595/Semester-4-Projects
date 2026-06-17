import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashBoard.css';
import './Settings.css';
import { FaChartBar, FaClipboard, FaCog, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Demo User');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [allowDataCollection, setAllowDataCollection] = useState(false);
  const isMobile = window.innerWidth < 768;

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className={classNames('d-flex dashboard-container', { 'sidebar-open': sidebarOpen })}>
      {/* Sidebar - Copied from Dashboard */}
      <div className={`sidebar bg-white shadow-sm ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand mb-4 d-flex justify-content-start align-items-center">
          <div className="logo">HB</div>
          <span className="brand-name">HabitBloom</span>
          {isMobile && (
            <button className="btn btn-sm" onClick={toggleSidebar}><FaTimes /></button>
          )}
        </div>
        <ul className="nav flex-column">
          <Link to="/DashBoard" className={classNames('nav-item', { active: useLocation().pathname === '/DashBoard' })}>
            <FaChartBar className="me-2" />Dashboard
          </Link>
          <Link to="/Reports" className={classNames('nav-item', { active: useLocation().pathname === '/Reports' })}>
            <FaClipboard className="me-2" />Reports
          </Link>
          <li className={classNames('nav-item active')}>
            <FaCog className="me-2" />Settings
          </li>
        </ul>
        <div className="user-info mt-auto">
          <FaUser className="me-2" />
          <div>
            <div>User</div>
            <small>user@example.com</small>
          </div>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="main-content p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <button className="btn btn-sm sidebar-toggle-btn me-2" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h4 className="fw-bold mb-0">Settings</h4>
        </div>

        <div className="settings-container">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Account Settings</h5>
              
              <div className="mb-4">
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <label className="form-check-label">
                    Receive email reminders for uncompleted habits
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                  <label className="form-check-label">
                    Receive in-app notifications for streaks and achievements
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Privacy</h5>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={allowDataCollection}
                  onChange={(e) => setAllowDataCollection(e.target.checked)}
                />
                <label className="form-check-label">
                  Allow anonymous usage data collection to improve the app
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-primary">Save Changes</button>
            <Link to = '/' ><button className="btn btn-outline-danger">Logout</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;