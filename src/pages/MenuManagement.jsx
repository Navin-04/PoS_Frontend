import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockProducts } from '../data/mockData';
import styles from './MenuManagement.module.css';

const MenuManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'pcs',
    taxRate: '',
  });

  const isOwner = user?.role === 'owner';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      unit: 'pcs',
      taxRate: '',
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      unit: product.unit,
      taxRate: product.taxRate.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: parseFloat(formData.price),
                taxRate: parseFloat(formData.taxRate),
              }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct = {
        id: products.length + 1,
        ...formData,
        price: parseFloat(formData.price),
        taxRate: parseFloat(formData.taxRate),
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className={styles.menuManagement}>
      <div className={styles.header}>
        <h2>Menu Management</h2>
        {isOwner && (
          <button className={styles.addBtn} onClick={handleAdd}>
            + Add Product
          </button>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Tax Rate (%)</th>
              {isOwner && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.unit}</td>
                <td>{product.taxRate}%</td>
                {isOwner && (
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && isOwner && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  required
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({ ...formData, taxRate: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingProduct ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;

