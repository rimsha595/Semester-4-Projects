import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reports.css';
import { FaChartBar, FaCheckCircle, FaCalendar, FaClipboard, FaCog, FaUser, FaPlus, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import classNames from 'classnames';

const Reports = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const [habits, setHabits] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const stored = localStorage.getItem('habitBloomHabits');
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const trendingHabits = ["Meditation", "Journaling", "Walking", "Sleep Early"];

  const addHabitFromTrending = (habitTitle) => {
    const current = localStorage.getItem('habitBloomHabits');
    const parsed = current ? JSON.parse(current) : [];
    const colorOptions = ['purple', 'blue', 'pink', 'green', 'orange', 'teal'];
    const color = colorOptions[parsed.length % colorOptions.length];
    const newHabit = {
      title: habitTitle,
      category: 'trending',
      count: 0,
      goal: 20,
      percent: 0,
      badge: '0 days',
      color,
      completed: false,
      lastCompleted: null
    };
    const updated = [...parsed, newHabit];
    localStorage.setItem('habitBloomHabits', JSON.stringify(updated));
    setHabits(updated);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const categoryData = () => {
    const categoryCounts = {};
    habits.forEach(habit => {
      categoryCounts[habit.category] = (categoryCounts[habit.category] || 0) + 1;
    });

    return Object.keys(categoryCounts).map(category => ({
      name: category,
      value: categoryCounts[category],
    }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderCategoryBreakdown = () => {
    const data = categoryData();
    if (!data.length) {
      return <p className="text-muted">No habits added yet to show category breakdown.</p>;
    }

    return (
      <div className="card p-3 animate__animated animate__fadeInUp">
        <h5 className="fw-bold mb-3">Category Breakdown</h5>
        <div className="d-flex justify-content-center align-items-center">
          <div style={{ width: '100%', maxWidth: 600, padding: '0 40px' }}>
            <ResponsiveContainer width={600} height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelPosition="inside"
                >
                  {
                    data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={"d-flex dashboard-container" + (sidebarOpen ? " sidebar-open" : "")}>
      <div className={`sidebar bg-white shadow-sm ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand mb-4 d-flex justify-content-start align-items-center">
          <div className="logo">HB</div>
          <span className="brand-name">HabitBloom</span>
          {isMobile && (
                      <button className="btn btn-sm" onClick={toggleSidebar}><FaTimes /></button>
                    )}
        </div>
        <ul className="nav flex-column">
                  <Link to = '/DashBoard' className={classNames('nav-item ', { active: location.pathname === '/' })}><FaChartBar className="me-2" />Dashboard</Link>
                  <Link to = '/Reports' className={classNames('nav-item active', { active: location.pathname == '/Reports.jsx' })}><FaClipboard className="me-2" />Reports </Link>
                  <Link to = '/Settings' className={classNames('nav-item', { active: location.pathname == '/Settings.jsx' })}><FaCog className="me-2" />Settings</Link>
                </ul>
      </div>

      <div className="main-content p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <button className="btn btn-sm sidebar-toggle-btn me-2" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h4 className="fw-bold mb-0">Reports</h4>
            <p className="text-muted mb-0">Track your habit progress over time</p>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => handleTabChange('Overview')} href="#">Overview</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'Trends' ? 'active' : ''}`} onClick={() => handleTabChange('Trends')} href="#">Trends</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'Categories' ? 'active' : ''}`} onClick={() => handleTabChange('Categories')} href="#">Categories</a>
          </li>
        </ul>

        {activeTab === 'Overview' && (
          <div className="row mb-4 text-center animate__animated animate__fadeIn">
            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <h6 className="text-muted">Completion Rate</h6>
                <h2 className="text-purple fw-bold">{Math.round(habits.reduce((acc, h) => acc + h.percent, 0) / (habits.length || 1))}%</h2>
                <p className="text-muted small">Overall completion rate</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <h6 className="text-muted">Total Habits</h6>
                <h2 className="text-primary fw-bold">{habits.length}</h2>
                <p className="text-muted small">Active habits</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <h6 className="text-muted">Longest Streak</h6>
                <h2 className="text-success fw-bold">
                  {habits.length > 0 ? Math.max(...habits.map(h => h.count)) : 0}
                </h2>

                <p className="text-muted small">Days in a row</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Overview' && (
          <div className="card p-3 mb-4 animate__animated animate__fadeInUp">
            <h5 className="fw-bold mb-3">Habit Progress</h5>
            <p className="text-muted">All habits shown below by category</p>
            {habits.map((habit, index) => (
              <div className="habit-bar mb-3" key={index}>
                <div className="fw-semibold">{habit.title} <span className="text-muted small">({habit.category})</span></div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${habit.percent}%`, backgroundColor: habit.color }}>
                    {habit.percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Categories' && renderCategoryBreakdown()}

        {activeTab === 'Trends' && (
          <div className="card p-3 animate__animated animate__fadeInUp">
            <h5 className="fw-bold mb-3">Trending Habits to Start</h5>
            <div className="row">
              {trendingHabits.map((habit, index) => (
                <div className="col-md-3 mb-3" key={index}>
                  <div className="card h-100 p-2 shadow-sm text-center">
                    <h6 className="mb-2">{habit}</h6>
                    <button className="btn btn-sm btn-outline-success" onClick={() => addHabitFromTrending(habit)}>
                      <FaPlus className="me-1" /> Add Habit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;