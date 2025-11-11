import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { mockProducts } from '../data/mockData';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  
  // Calculate stats from current invoices
  const stats = {
    totalRevenue: invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0),
    totalBills: invoices.length,
    totalProducts: mockProducts.filter((p) => p.is_active === 1).length,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Dashboard</h2>
        <p>Welcome to your hotel management dashboard</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3>Total Revenue</h3>
            <p className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧾</div>
          <div className={styles.statContent}>
            <h3>Total Bills</h3>
            <p className={styles.statValue}>{stats.totalBills}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Total Products</h3>
            <p className={styles.statValue}>{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <button
            className={styles.actionBtn}
            onClick={() => navigate('/billing')}
          >
            <span className={styles.btnIcon}>➕</span>
            <span>New Bill</span>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => navigate('/menu')}
          >
            <span className={styles.btnIcon}>📋</span>
            <span>Manage Menu</span>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => navigate('/bill-history')}
          >
            <span className={styles.btnIcon}>📜</span>
            <span>View Bill History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

