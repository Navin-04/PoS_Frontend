import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.unauthorized}>
      <div className={styles.content}>
        <div className={styles.icon}>🔒</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

