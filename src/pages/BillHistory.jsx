import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  mockInvoices,
  mockInvoiceItems,
  mockEmployees,
  getInvoiceWithDetails,
} from '../data/mockData';
import styles from './BillHistory.module.css';

const BillHistory = () => {
  const { user } = useAuth();
  const [invoices] = useState(mockInvoices);
  const [filters, setFilters] = useState({
    date: '',
    employee: '',
    status: '',
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEmployeeName = (employeeId) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId);
    return employee ? employee.full_name : 'Unknown';
  };

  const filteredInvoices = invoices.filter((invoice) => {
    if (filters.date) {
      const invoiceDate = new Date(invoice.created_at).toISOString().split('T')[0];
      if (invoiceDate !== filters.date) return false;
    }
    if (filters.employee) {
      const empName = getEmployeeName(invoice.employee_id);
      if (empName !== filters.employee) return false;
    }
    if (filters.status && invoice.status !== filters.status) return false;
    if (filters.minTotal && invoice.total_amount < parseFloat(filters.minTotal))
      return false;
    if (filters.maxTotal && invoice.total_amount > parseFloat(filters.maxTotal))
      return false;
    return true;
  });

  const employees = [
    ...new Set(
      invoices
        .map((inv) => getEmployeeName(inv.employee_id))
        .filter((name) => name !== 'Unknown')
    ),
  ];

  const statusOptions = [
    'draft',
    'preparing',
    'served',
    'finalized',
    'paid',
    'cancelled',
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return styles.statusPaid;
      case 'finalized':
        return styles.statusFinalized;
      case 'cancelled':
        return styles.statusCancelled;
      case 'draft':
        return styles.statusDraft;
      default:
        return styles.statusPending;
    }
  };

  const handleEdit = (invoice) => {
    alert(`Edit invoice ${invoice.invoice_number} (Mock action)`);
  };

  const handleDelete = (invoice) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${invoice.invoice_number}?`
      )
    ) {
      alert(`Invoice ${invoice.invoice_number} deleted (Mock action)`);
    }
  };

  const handleView = (invoice) => {
    const invoiceDetails = getInvoiceWithDetails(invoice.id);
    console.log('Invoice Details:', invoiceDetails);
    alert(`View invoice ${invoice.invoice_number} (Mock action)`);
  };

  return (
    <div className={styles.billHistory}>
      <div className={styles.header}>
        <h2>Invoice History</h2>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Employee</label>
          <select
            value={filters.employee}
            onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
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
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
            setFilters({
              date: '',
              employee: '',
              status: '',
              minTotal: '',
              maxTotal: '',
            })
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
              <th>Table</th>
              <th>Order Type</th>
              <th>Employee</th>
              <th>Amount</th>
              <th>Status</th>
              {isOwner && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={isOwner ? 8 : 7} className={styles.noData}>
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <button
                      className={styles.invoiceLink}
                      onClick={() => handleView(invoice)}
                    >
                      {invoice.invoice_number}
                    </button>
                  </td>
                  <td>{formatDate(invoice.created_at)}</td>
                  <td>{invoice.table_number || '-'}</td>
                  <td>
                    <span className={styles.orderType}>
                      {invoice.order_type || '-'}
                    </span>
                  </td>
                  <td>{getEmployeeName(invoice.employee_id)}</td>
                  <td>{formatCurrency(invoice.total_amount)}</td>
                  <td>
                    <span
                      className={`${styles.status} ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </td>
                  {isOwner && (
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => handleView(invoice)}
                        >
                          View
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(invoice)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(invoice)}
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
