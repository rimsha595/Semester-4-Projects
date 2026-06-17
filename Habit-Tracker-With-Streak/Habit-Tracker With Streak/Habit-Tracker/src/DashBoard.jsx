import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashBoard.css';
import { FaChartBar, FaCheckCircle, FaCalendar, FaClipboard, FaCog, FaUser, FaPlus, FaBars, FaTimes } from 'react-icons/fa';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const colorOptions = ['purple', 'blue', 'pink', 'orange', 'green', 'red'];
  const HABITS_STORAGE_KEY = 'habitBloomHabits';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habits, setHabits] = useState(() => {
    const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    return storedHabits ? JSON.parse(storedHabits) : [];
  });
  const [newHabit, setNewHabit] = useState('');
  const [targetDays, setTargetDays] = useState('');
  const [category, setCategory] = useState('custom');
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    setCurrentDay(today.toLocaleDateString('en-US', { weekday: 'long' }));
  }, []);

  useEffect(() => {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return alert("Please enter a habit name.");
    const goal = parseInt(targetDays);
    if (isNaN(goal) || goal <= 0) return alert("Please enter a valid target.");

    const color = colorOptions[habits.length % colorOptions.length];
    setHabits(prev => [
      ...prev,
      {
        title: newHabit,
        category,
        count: 0,
        goal,
        percent: 0,
        badge: '0 days',
        color,
        completed: false,
        lastCompleted: null,
        completedDates: []
      }
    ]);
    setNewHabit('');
    setTargetDays('');
    setCategory('custom');
  };

  const deleteHabit = (index) => {
    if (window.confirm("Delete this habit?")) {
      setHabits(prev => prev.filter((_, i) => i !== index));
    }
  };

  const markDone = (index) => {
    const todayStr = new Date().toDateString();
    setHabits(prev => {
      const updated = [...prev];
      const habit = updated[index];
      if (habit.lastCompleted === todayStr) return updated;
      habit.count += 1;
      habit.percent = Math.min(100, Math.round((habit.count / habit.goal) * 100));
      habit.badge = `${habit.count} days`;
      habit.completed = habit.count >= habit.goal;
      habit.lastCompleted = todayStr;
      habit.completedDates = [...(habit.completedDates || []), todayStr];
      return updated;
    });
  };

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateStreak = (dates = []) => {
    const sorted = [...dates]
      .map(d => new Date(d))
      .sort((a, b) => b - a);
  
    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);
  
    for (let date of sorted) {
      date.setHours(0, 0, 0, 0);
      if (date.getTime() === current.getTime()) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
  
    return streak;
  };
  

  const location = useLocation();
  const currentStreak = Math.max(...habits.map(h => calculateStreak(h.completedDates)), 0);

  return (
    <div className={classNames('d-flex dashboard-container', { 'sidebar-open': sidebarOpen })}>
      <div className={`sidebar bg-white shadow-sm ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand mb-4 d-flex justify-content-start align-items-center">
          <div className="logo">HB</div>
          <span className="brand-name">HabitBloom</span>
          {isMobile && (
            <button className="btn btn-sm" onClick={toggleSidebar}><FaTimes /></button>
          )}
        </div>
        <ul className="nav flex-column">
          <li className={classNames('nav-item active', { active: location.pathname === '/' })}><FaChartBar className="me-2" />Dashboard</li>
          <Link to='/Reports' className={classNames('nav-item', { active: location.pathname == '/Reports.jsx' })}><FaClipboard className="me-2" />Reports </Link>
          <Link to='/Settings' className={classNames('nav-item', { active: location.pathname == '/Settings.jsx' })}><FaCog className="me-2" />Settings</Link>
        </ul>
        <div className="user-info mt-auto">
          <FaUser className="me-2" />
          <div>
            <div>User</div>
            <small>user@example.com</small>
          </div>
        </div>
      </div>

      <div className="main-content p-4">
        <div className="d-flex justify-content-between align-items-top mb-4 flex-wrap">
          <button className="btn btn-sm sidebar-toggle-btn mb-5" onClick={toggleSidebar}><FaBars /></button>
          <h4 className="fw-bold mb-0">Dashboard</h4>
          <p className="text-muted mb-0">{currentDay}, {currentDate}</p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="summary-box"><div>Total Habits</div><div className="value">{habits.length}</div></div></div>
          <div className="col-md-3"><div className="summary-box"><div>Completed Today</div><div className="value">{habits.filter(h => h.lastCompleted === new Date().toDateString()).length}</div></div></div>
          <div className="col-md-3"><div className="summary-box"><div>Current Streak</div><div className="value">{currentStreak}</div></div></div>
          <div className="col-md-3"><div className="summary-box"><div>Completion Rate</div><div className="value">{Math.round(habits.reduce((acc, h) => acc + h.percent, 0) / (habits.length || 1))}%</div></div></div>
        </div>

        <div className="input-group mb-4">
          <input type="text" className="form-control" value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Habit name..." />
          <input type="number" className="form-control" value={targetDays} onChange={e => setTargetDays(e.target.value)} placeholder="Target days..." min="1" />
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="health">Health</option>
            <option value="learning">Learning</option>
            <option value="custom">Custom</option>
          </select>
          <button className="btn btn-primary" onClick={addHabit}><FaPlus /> Add</button>
        </div>
        <div className="row g-3 mb-4">
          {habits.map((habit, index) => {
            const radius = 20;
            const circumference = 2 * Math.PI * radius;
            const progress = Math.min(100, habit.percent || 0);
            const offset = circumference * (1 - progress / 100);
            const colorMap = {
              purple: "#9966FF",
              blue: "#36A2EB",
              pink: "#FF6384",
              orange: "#FF9F40",
              green: "#4BC0C0",
              red: "#FF4D4D"
            };
            const strokeColor = colorMap[habit.color] || "#999";

            return (
              <div className="col-md-4" key={index}>
                <div className={`habit-card ${habit.completed ? 'completed' : ''} animate__animated animate__fadeIn`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold mb-1">{habit.title}</div>
                      <div className="text-muted small">{habit.category}</div>
                    </div>
                    <span className={`badge badge-${habit.color}`}>{habit.badge}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-sm btn-outline-success w-100"
                        onClick={() => markDone(index)}
                        disabled={habit.lastCompleted === new Date().toDateString()}>
                        {habit.lastCompleted === new Date().toDateString() ? 'Done Today' : 'Mark as Done'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger w-100"
                        onClick={() => deleteHabit(index)}>
                        Delete
                      </button>
                    </div>

                    <div className="text-center mx-2">
                      <svg width="50" height="50" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r={radius}
                          fill="transparent"
                          stroke="#e6e6e6"
                          strokeWidth="6"
                        />
                        <circle
                          cx="25"
                          cy="25"
                          r={radius}
                          fill="transparent"
                          stroke={strokeColor}
                          strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          transform="rotate(-90 25 25)"
                        />
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#333"
                        >
                          {progress}%
                        </text>
                      </svg>

                      <div className="small mt-1">{habit.count}/{habit.goal}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
