import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  mockProducts,
  mockCategories,
  mockTaxSlabs,
} from '../data/mockData';
import styles from './MenuManagement.module.css';

const MenuManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category_id: '',
    current_unit_price: '',
    tax_slab_id: '',
    is_active: 1,
  });

  const isOwner = user?.role === 'owner';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const getCategoryName = (categoryId) => {
    const category = mockCategories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getTaxSlabName = (taxSlabId) => {
    const taxSlab = mockTaxSlabs.find((t) => t.id === taxSlabId);
    return taxSlab ? taxSlab.name : 'Unknown';
  };

  const getTaxRate = (taxSlabId) => {
    const taxSlab = mockTaxSlabs.find((t) => t.id === taxSlabId);
    return taxSlab ? taxSlab.rate : 0;
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      sku: '',
      name: '',
      category_id: '',
      current_unit_price: '',
      tax_slab_id: '',
      is_active: 1,
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name,
      category_id: product.category_id || '',
      current_unit_price: product.current_unit_price.toString(),
      tax_slab_id: product.tax_slab_id,
      is_active: product.is_active,
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
                current_unit_price: parseFloat(formData.current_unit_price),
                tax_slab_id: parseInt(formData.tax_slab_id),
                category_id: formData.category_id
                  ? parseInt(formData.category_id)
                  : null,
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        ...formData,
        current_unit_price: parseFloat(formData.current_unit_price),
        tax_slab_id: parseInt(formData.tax_slab_id),
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : null,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

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
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Tax Slab</th>
              <th>Tax Rate (%)</th>
              <th>Status</th>
              {isOwner && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) => p.is_active === 1)
              .map((product) => (
                <tr key={product.id}>
                  <td>{product.sku || '-'}</td>
                  <td>{product.name}</td>
                  <td>{getCategoryName(product.category_id)}</td>
                  <td>{formatCurrency(product.current_unit_price)}</td>
                  <td>{getTaxSlabName(product.tax_slab_id)}</td>
                  <td>{getTaxRate(product.tax_slab_id)}%</td>
                  <td>
                    <span
                      className={
                        product.is_active === 1
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      {product.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
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
                <label>SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Product Name *</label>
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
                <label>Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {mockCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.current_unit_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current_unit_price: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tax Slab *</label>
                <select
                  value={formData.tax_slab_id}
                  onChange={(e) =>
                    setFormData({ ...formData, tax_slab_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Tax Slab</option>
                  {mockTaxSlabs.map((taxSlab) => (
                    <option key={taxSlab.id} value={taxSlab.id}>
                      {taxSlab.name} ({taxSlab.rate}%)
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={formData.is_active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
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
