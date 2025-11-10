import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockBills } from '../data/mockData';
import styles from './BillHistory.module.css';

const BillHistory = () => {
  const { user } = useAuth();
  const [bills] = useState(mockBills);
  const [filters, setFilters] = useState({
    date: '',
    employee: '',
    minTotal: '',
    maxTotal: '',
  });

  const isOwner = user?.role === 'owner';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredBills = bills.filter((bill) => {
    if (filters.date && bill.date !== filters.date) return false;
    if (filters.employee && bill.employee !== filters.employee) return false;
    if (filters.minTotal && bill.total < parseFloat(filters.minTotal))
      return false;
    if (filters.maxTotal && bill.total > parseFloat(filters.maxTotal))
      return false;
    return true;
  });

  const employees = [...new Set(bills.map((bill) => bill.employee))];

  const handleEdit = (bill) => {
    alert(`Edit bill ${bill.invoiceNo} (Mock action)`);
  };

  const handleDelete = (bill) => {
    if (window.confirm(`Are you sure you want to delete ${bill.invoiceNo}?`)) {
      alert(`Bill ${bill.invoiceNo} deleted (Mock action)`);
    }
  };

  const handleView = (bill) => {
    alert(`View bill ${bill.invoiceNo} (Mock action)`);
  };

  return (
    <div className={styles.billHistory}>
      <div className={styles.header}>
        <h2>Bill History</h2>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Employee</label>
          <select
            value={filters.employee}
            onChange={(e) =>
              setFilters({ ...filters, employee: e.target.value })
            }
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Min Total</label>
          <input
            type="number"
            placeholder="Min amount"
            value={filters.minTotal}
            onChange={(e) =>
              setFilters({ ...filters, minTotal: e.target.value })
            }
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Max Total</label>
          <input
            type="number"
            placeholder="Max amount"
            value={filters.maxTotal}
            onChange={(e) =>
              setFilters({ ...filters, maxTotal: e.target.value })
            }
          />
        </div>
        <button
          className={styles.clearBtn}
          onClick={() =>
            setFilters({ date: '', employee: '', minTotal: '', maxTotal: '' })
          }
        >
          Clear Filters
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Employee</th>
              <th>Amount</th>
              <th>Status</th>
              {isOwner && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={isOwner ? 6 : 5} className={styles.noData}>
                  No bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td>
                    <button
                      className={styles.invoiceLink}
                      onClick={() => handleView(bill)}
                    >
                      {bill.invoiceNo}
                    </button>
                  </td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{bill.employee}</td>
                  <td>{formatCurrency(bill.total)}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        bill.status === 'Paid'
                          ? styles.statusPaid
                          : styles.statusPending
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  {isOwner && (
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => handleView(bill)}
                        >
                          View
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(bill)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(bill)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillHistory;

