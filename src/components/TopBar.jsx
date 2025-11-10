import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './TopBar.module.css';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    return role === 'owner' ? 'Owner' : 'Staff';
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>Hotel Management System</h1>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.full_name || user?.name}</span>
            <span className={styles.userRole}>{getRoleLabel(user?.role)}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

