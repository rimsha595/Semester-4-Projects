import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to store error message
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Predefined username and password
    const validEmail = 'user@example.com';
    const validPassword = '123456';

    // Check if email and password match the valid credentials
    if (email === validEmail && password === validPassword) {
      setError(''); // Clear any previous error
      navigate('/dashboard'); // Navigate to Dashboard on successful login
    } else {
      setError('Invalid email or password'); // Set error message on failed login
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-5 rounded shadow" style={{ minWidth: '350px', width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <div
            className="mx-auto d-flex justify-content-center align-items-center rounded-circle"
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#b197fc',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '18px',
            }}
          >
            HB
          </div>
          <h4 className="mt-3 mb-1">Welcome back</h4>
          <p className="text-muted small">Log in to your HabitBloom account</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#b197fc' }}>
            Log in
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don’t have an account? <a href="#" className="text-decoration-none">Sign up</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
