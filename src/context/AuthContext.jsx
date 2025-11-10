import React, { createContext, useState, useContext } from 'react';
import { mockUserAccounts, mockRoles } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Find user by username
    const foundUser = mockUserAccounts.find(
      (u) => u.username === username && u.password_hash === password
    );

    if (foundUser) {
      const role = mockRoles.find((r) => r.id === foundUser.role_id);
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        full_name: foundUser.full_name,
        role: role ? role.name : 'staff',
        role_id: foundUser.role_id,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
