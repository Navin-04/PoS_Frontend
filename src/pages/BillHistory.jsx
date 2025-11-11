import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInvoices } from '../context/InvoiceContext';
import {
  mockEmployees,
  mockPayments,
  getProductWithDetails,
  mockOrganization,
} from '../data/mockData';
import styles from './BillHistory.module.css';

const BillHistory = () => {
  const { user } = useAuth();
  const { invoices, invoiceItems, deleteInvoice } = useInvoices();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    date: '',
    employee: '',
    status: '',
    minTotal: '',
    maxTotal: '',
  });

  const isOwner = user?.role === 'owner';

  // Helper function to get invoice with details using context data
  const getInvoiceWithDetails = (invoiceId) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return null;

    const items = invoiceItems.filter((item) => item.invoice_id === invoiceId);
    const employee = mockEmployees.find((emp) => emp.id === invoice.employee_id);
    const payment = mockPayments.find((pay) => pay.invoice_id === invoiceId);

    return {
      ...invoice,
      items: items.map((item) => {
        const product = getProductWithDetails(item.product_id);
        return {
          ...item,
          product: product,
        };
      }),
      employee: employee ? employee.full_name : 'Unknown',
      payment: payment || null,
    };
  };

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
    navigate(`/billing?edit=${invoice.id}`);
  };

  const handleDelete = (invoice) => {
    if (
      window.confirm(
        `Are you sure you want to delete invoice ${invoice.invoice_number}? This action cannot be undone.`
      )
    ) {
      deleteInvoice(invoice.id);
      alert(`Invoice ${invoice.invoice_number} deleted successfully!`);
    }
  };

  const generateReceiptHtml = (invoice) => {
    const currentDate = new Date(invoice.created_at).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const itemsRows = (invoice.items || [])
      .map((item) => {
        const desc = item.product ? item.product.name : item.description || '';
        const qty = item.quantity;
        const price = item.unit_price;
        const total = item.line_total_incl_tax ?? (qty * price);
        const discount = item.discount_amount || 0;
        return `
          <tr>
            <td style="text-align:left;padding:4px 0;">${desc}</td>
            <td style="text-align:center;padding:4px 0;">${qty}</td>
            <td style="text-align:right;padding:4px 0;">${formatCurrency(price)}</td>
            ${discount > 0 ? `<td style="text-align:right;padding:4px 0;">-${formatCurrency(discount)}</td>` : '<td style="text-align:right;padding:4px 0;">-</td>'}
            <td style="text-align:right;padding:4px 0;font-weight:600;">${formatCurrency(total)}</td>
          </tr>
        `;
      })
      .join('');

    const subtotal = (invoice.items || []).reduce(
      (sum, it) => sum + (it.line_total_excl_tax ?? (it.quantity * it.unit_price - (it.discount_amount || 0))),
      0
    );
    const tax = (invoice.items || []).reduce(
      (sum, it) => sum + (it.line_tax_amount ?? 0),
      0
    );
    const grandTotal = invoice.total_amount ?? (subtotal + tax);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: 'Courier New', monospace; margin: 0; padding: 16px; color: #000; }
            .toolbar { position: sticky; top: 0; background: #f9fafb; padding: 8px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 8px; }
            .toolbar button { padding: 8px 14px; margin-right: 8px; border: none; background: #3b82f6; color: #fff; border-radius: 6px; cursor: pointer; }
            .receipt { max-width: 80mm; margin: 0 auto; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .receipt-header h1 { font-size: 18px; margin: 0 0 4px 0; text-transform: uppercase; }
            .receipt-info { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed #000; }
            .row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            thead { border-top: 1px dashed #000; border-bottom: 1px dashed #000; }
            th { text-align: left; font-size: 11px; padding: 4px 0; }
            th:nth-child(2), th:nth-child(3), th:nth-child(4), th:nth-child(5) { text-align: right; }
            td { font-size: 12px; }
            .totals { border-top: 2px dashed #000; padding-top: 8px; }
            .grand { font-weight: 700; font-size: 14px; border-top: 2px solid #000; margin-top: 6px; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()" style="background:#6b7280">Close</button>
          </div>
          <div class="receipt">
            <div class="receipt-header">
              <h1>${mockOrganization.name}</h1>
              <div style="font-size:11px;">${mockOrganization.address}</div>
              <div style="font-size:11px;">Phone: ${mockOrganization.phone} • GST: ${mockOrganization.gst}</div>
            </div>
            <div class="receipt-info">
              <div class="row"><strong>Invoice No:</strong><span>${invoice.invoice_number}</span></div>
              <div class="row"><strong>Date:</strong><span>${currentDate}</span></div>
              ${invoice.table_number ? `<div class="row"><strong>Table:</strong><span>${invoice.table_number}</span></div>` : ''}
              <div class="row"><strong>Order Type:</strong><span>${(invoice.order_type || '').toUpperCase()}</span></div>
              ${invoice.employee ? `<div class="row"><strong>Staff:</strong><span>${invoice.employee}</span></div>` : ''}
              <div class="row"><strong>Status:</strong><span>${(invoice.status || '').toUpperCase()}</span></div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="text-align:left;">Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Disc</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            <div class="totals">
              <div class="row"><span>Subtotal (Excl. Tax):</span><span>${formatCurrency(subtotal)}</span></div>
              <div class="row"><span>Tax:</span><span>${formatCurrency(tax)}</span></div>
              <div class="row grand"><span>GRAND TOTAL:</span><span>${formatCurrency(grandTotal)}</span></div>
            </div>
            ${invoice.notes ? `<div style="margin-top:8px;font-size:11px;"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
          </div>
        </body>
      </html>
    `;
  };

  const handleView = (invoice) => {
    const details = getInvoiceWithDetails(invoice.id);
    if (!details) {
      alert('Invoice not found');
      return;
    }
    const w = window.open('', '_blank');
    w.document.write(generateReceiptHtml(details));
    w.document.close();
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
