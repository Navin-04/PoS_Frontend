import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockOrganization } from '../data/mockData';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockOrganization);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    alert('Organization details updated successfully! (Mock action)');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(mockOrganization);
    setIsEditing(false);
  };

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h2>Organization Profile</h2>
        {isOwner && !isEditing && (
          <button className={styles.editBtn} onClick={handleEdit}>
            Edit Profile
          </button>
        )}
      </div>

      <div className={styles.profileCard}>
        <div className={styles.section}>
          <h3>Organization Information</h3>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>Organization Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <div className={styles.value}>{formData.name}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>GST Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.gst}
                  onChange={(e) =>
                    setFormData({ ...formData, gst: e.target.value })
                  }
                />
              ) : (
                <div className={styles.value}>{formData.gst}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Address</label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows="3"
                />
              ) : (
                <div className={styles.value}>{formData.address}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <div className={styles.value}>{formData.phone}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <div className={styles.value}>{formData.email}</div>
              )}
            </div>

            {isEditing && (
              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  Cancel
                </button>
                <button className={styles.saveBtn} onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

