import React, { useState } from 'react';
import { mockProducts } from '../data/mockData';
import styles from './Billing.module.css';

const Billing = () => {
  const [items, setItems] = useState([
    { productId: '', quantity: 1, unit: 'pcs' },
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const getProduct = (productId) => {
    return mockProducts.find((p) => p.id === parseInt(productId));
  };

  const calculateItemTotal = (item) => {
    if (!item.productId) return 0;
    const product = getProduct(item.productId);
    if (!product) return 0;
    const basePrice = product.price * item.quantity;
    const tax = (basePrice * product.taxRate) / 100;
    return basePrice + tax;
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      if (!item.productId) return sum;
      const product = getProduct(item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);

    const tax = items.reduce((sum, item) => {
      if (!item.productId) return sum;
      const product = getProduct(item.productId);
      if (!product) return sum;
      const basePrice = product.price * item.quantity;
      return sum + (basePrice * product.taxRate) / 100;
    }, 0);

    return { subtotal, tax, total: subtotal + tax };
  };

  const handleProductChange = (index, productId) => {
    const newItems = [...items];
    const product = getProduct(productId);
    newItems[index] = {
      ...newItems[index],
      productId,
      unit: product ? product.unit : 'pcs',
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, parseInt(quantity) || 1);
    setItems(newItems);
  };

  const handleUnitChange = (index, unit) => {
    const newItems = [...items];
    newItems[index].unit = unit;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1, unit: 'pcs' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSaveBill = () => {
    alert('Bill saved successfully! (Mock action)');
    setItems([{ productId: '', quantity: 1, unit: 'pcs' }]);
  };

  const handlePrint = () => {
    window.print();
  };

  const totals = calculateTotals();

  return (
    <div className={styles.billing}>
      <div className={styles.header}>
        <h2>Create New Bill</h2>
      </div>

      <div className={styles.billContainer}>
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <h3>Bill Items</h3>
            <button className={styles.addItemBtn} onClick={handleAddItem}>
              + Add Item
            </button>
          </div>

          <div className={styles.itemsList}>
            {items.map((item, index) => {
              const product = getProduct(item.productId);
              const itemTotal = calculateItemTotal(item);

              return (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemField}>
                    <label>Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {mockProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.itemField}>
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className={styles.itemField}>
                    <label>Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleUnitChange(index, e.target.value)}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="pcs">pcs</option>
                    </select>
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
                    <label>Total</label>
                    <input
                      type="text"
                      value={formatCurrency(itemTotal)}
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
            <h3>Bill Summary</h3>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
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
                Save Bill
              </button>
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

