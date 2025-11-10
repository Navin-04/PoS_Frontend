import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(userId, password);

    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/billing');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Hotel Management System</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>
        <div className={styles.demoInfo}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Owner: OWNER001 / owner123</p>
          <p>Staff: STAFF001 / staff123</p>
          <p>Staff: STAFF002 / staff123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

