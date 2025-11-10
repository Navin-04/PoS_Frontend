import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['owner'] },
    { path: '/billing', label: 'Billing', icon: '🧾', roles: ['owner', 'staff'] },
    { path: '/menu', label: 'Menu Management', icon: '📋', roles: ['owner', 'staff'] },
    { path: '/bill-history', label: 'Bill History', icon: '📜', roles: ['owner', 'staff'] },
    { path: '/profile', label: 'Profile', icon: '👤', roles: ['owner', 'staff'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Hotel Billing</h2>
      </div>
      <nav className={styles.nav}>
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

