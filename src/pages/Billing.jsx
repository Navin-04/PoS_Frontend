import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInvoices } from '../context/InvoiceContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  mockProducts,
  mockTaxSlabs,
  mockEmployees,
  getProductWithDetails,
} from '../data/mockData';
import styles from './Billing.module.css';

const Billing = () => {
  const { user } = useAuth();
  const { addInvoice, updateInvoiceWithItems, invoices, invoiceItems } = useInvoices();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editInvoiceId = searchParams.get('edit');
  const isEditMode = !!editInvoiceId;

  const [items, setItems] = useState([
    { productId: '', quantity: 1, discount_amount: 0 },
  ]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    table_number: '',
    order_type: 'dine-in',
    status: 'draft',
    notes: '',
    employee_id: null,
  });

  // Load invoice data when in edit mode
  useEffect(() => {
    if (isEditMode && editInvoiceId) {
      const invoice = invoices.find(inv => inv.id === parseInt(editInvoiceId));
      if (invoice) {
        // Load invoice details
        setInvoiceDetails({
          table_number: invoice.table_number || '',
          order_type: invoice.order_type || 'dine-in',
          status: invoice.status || 'draft',
          notes: invoice.notes || '',
          employee_id: invoice.employee_id || null,
        });

        // Load invoice items
        const invoiceItemsList = invoiceItems.filter(
          item => item.invoice_id === parseInt(editInvoiceId)
        );
        if (invoiceItemsList.length > 0) {
          setItems(
            invoiceItemsList.map(item => ({
              productId: item.product_id.toString(),
              quantity: item.quantity,
              discount_amount: item.discount_amount,
            }))
          );
        }
      }
    }
  }, [isEditMode, editInvoiceId, invoices, invoiceItems]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const getProduct = (productId) => {
    return getProductWithDetails(parseInt(productId));
  };

  const calculateItemTotals = (item) => {
    if (!item.productId) return { exclTax: 0, tax: 0, inclTax: 0 };
    const product = getProduct(item.productId);
    if (!product) return { exclTax: 0, tax: 0, inclTax: 0 };

    const unitPrice = product.current_unit_price;
    const quantity = parseFloat(item.quantity) || 0;
    const discount = parseFloat(item.discount_amount) || 0;
    const taxRate = product.taxRate;

    const lineTotalExclTax = unitPrice * quantity - discount;
    const lineTaxAmount = (lineTotalExclTax * taxRate) / 100;
    const lineTotalInclTax = lineTotalExclTax + lineTaxAmount;

    return {
      exclTax: lineTotalExclTax,
      tax: lineTaxAmount,
      inclTax: lineTotalInclTax,
    };
  };

  const calculateTotals = () => {
    const totals = items.reduce(
      (acc, item) => {
        const itemTotals = calculateItemTotals(item);
        return {
          subtotal: acc.subtotal + itemTotals.exclTax,
          tax: acc.tax + itemTotals.tax,
          total: acc.total + itemTotals.inclTax,
        };
      },
      { subtotal: 0, tax: 0, total: 0 }
    );

    return totals;
  };

  const handleProductChange = (index, productId) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId,
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(0, parseFloat(quantity) || 0);
    setItems(newItems);
  };

  const handleDiscountChange = (index, discount) => {
    const newItems = [...items];
    newItems[index].discount_amount = Math.max(0, parseFloat(discount) || 0);
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, discount_amount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSaveBill = () => {
    if (items.some((item) => !item.productId || item.quantity <= 0)) {
      alert('Please fill all product fields and ensure quantity is greater than 0');
      return;
    }

    const invoiceData = {
      invoice_number: isEditMode 
        ? invoices.find(inv => inv.id === parseInt(editInvoiceId))?.invoice_number 
        : `TINV${Date.now()}`,
      created_by: user?.id || null,
      status: invoiceDetails.status,
      total_amount: calculateTotals().total,
      notes: invoiceDetails.notes,
      table_number: invoiceDetails.table_number,
      order_type: invoiceDetails.order_type,
      employee_id: invoiceDetails.employee_id || null,
      items: items.map((item) => {
        const product = getProduct(item.productId);
        const itemTotals = calculateItemTotals(item);
        return {
          product_id: parseInt(item.productId),
          description: product ? product.name : '',
          quantity: parseFloat(item.quantity),
          unit_price: product ? product.current_unit_price : 0,
          tax_rate: product ? product.taxRate : 0,
          discount_amount: parseFloat(item.discount_amount) || 0,
          line_total_excl_tax: itemTotals.exclTax,
          line_tax_amount: itemTotals.tax,
          line_total_incl_tax: itemTotals.inclTax,
        };
      }),
    };

    if (isEditMode) {
      // Update existing invoice
      updateInvoiceWithItems(parseInt(editInvoiceId), invoiceData);
      alert('Bill updated successfully!');
      navigate('/bill-history');
    } else {
      // Add new invoice
      addInvoice(invoiceData);
      console.log('Invoice Data:', invoiceData);
      alert('Bill saved successfully!');
      setItems([{ productId: '', quantity: 1, discount_amount: 0 }]);
      setInvoiceDetails({
        table_number: '',
        order_type: 'dine-in',
        status: 'draft',
        notes: '',
        employee_id: null,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totals = calculateTotals();
  const activeProducts = mockProducts.filter((p) => p.is_active === 1);

  const currentInvoice = isEditMode 
    ? invoices.find(inv => inv.id === parseInt(editInvoiceId))
    : null;

  return (
    <div className={styles.billing}>
      <div className={styles.header}>
        <h2>{isEditMode ? 'Edit Invoice' : 'Create New Invoice'}</h2>
        {isEditMode && currentInvoice && (
          <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
            Invoice Number: <strong>{currentInvoice.invoice_number}</strong>
          </p>
        )}
      </div>

      <div className={styles.invoiceDetails}>
        <div className={styles.detailsCard}>
          <h3>Invoice Details</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.formGroup}>
              <label>Table Number</label>
              <input
                type="text"
                value={invoiceDetails.table_number}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    table_number: e.target.value,
                  })
                }
                placeholder="e.g., T1"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Order Type *</label>
              <select
                value={invoiceDetails.order_type}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    order_type: e.target.value,
                  })
                }
                required
              >
                <option value="dine-in">Dine-in</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Status *</label>
              <select
                value={invoiceDetails.status}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    status: e.target.value,
                  })
                }
                required
              >
                <option value="draft">Draft</option>
                <option value="preparing">Preparing</option>
                <option value="served">Served</option>
                <option value="finalized">Finalized</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Employee</label>
              <select
                value={invoiceDetails.employee_id || ''}
                onChange={(e) =>
                  setInvoiceDetails({
                    ...invoiceDetails,
                    employee_id: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              >
                <option value="">Select Employee</option>
                {mockEmployees
                  .filter((emp) => emp.is_active === 1)
                  .map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.employee_code})
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Notes</label>
            <textarea
              value={invoiceDetails.notes}
              onChange={(e) =>
                setInvoiceDetails({
                  ...invoiceDetails,
                  notes: e.target.value,
                })
              }
              rows="2"
              placeholder="Additional notes..."
            />
          </div>
        </div>
      </div>

      <div className={styles.billContainer}>
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <h3>Invoice Items</h3>
            <button className={styles.addItemBtn} onClick={handleAddItem}>
              + Add Item
            </button>
          </div>

          <div className={styles.itemsList}>
            {items.map((item, index) => {
              const product = getProduct(item.productId);
              const itemTotals = calculateItemTotals(item);

              return (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemField}>
                    <label>Product *</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {activeProducts.map((prod) => {
                        const prodDetails = getProductWithDetails(prod.id);
                        return (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} - {formatCurrency(prod.current_unit_price)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className={styles.itemField}>
                    <label>Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className={styles.itemField}>
                    <label>Unit Price</label>
                    <input
                      type="text"
                      value={
                        product
                          ? formatCurrency(product.current_unit_price)
                          : '-'
                      }
                      disabled
                      className={styles.disabledInput}
                    />
                  </div>

                  <div className={styles.itemField}>
                    <label>Tax Rate</label>
                    <input
                      type="text"
                      value={product ? `${product.taxRate}%` : '-'}
                      disabled
                      className={styles.disabledInput}
                    />
                  </div>

                  <div className={styles.itemField}>
                    <label>Discount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount_amount}
                      onChange={(e) =>
                        handleDiscountChange(index, e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.itemField}>
                    <label>Total (Inc. Tax)</label>
                    <input
                      type="text"
                      value={formatCurrency(itemTotals.inclTax)}
                      disabled
                      className={styles.disabledInput}
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveItem(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.totalsSection}>
          <div className={styles.totalsCard}>
            <h3>Invoice Summary</h3>
            <div className={styles.totalRow}>
              <span>Subtotal (Excl. Tax):</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax:</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <div className={styles.totalRow + ' ' + styles.grandTotal}>
              <span>Grand Total:</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSaveBill}>
                {isEditMode ? 'Update Invoice' : 'Save Invoice'}
              </button>
              {isEditMode && (
                <button 
                  className={styles.cancelBtn} 
                  onClick={() => navigate('/bill-history')}
                  style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
              <button className={styles.printBtn} onClick={handlePrint}>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
