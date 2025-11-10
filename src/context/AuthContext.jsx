import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Mock users for authentication
  const mockUsers = {
    owner: { id: 'OWNER001', password: 'owner123', role: 'owner', name: 'Rajesh Kumar' },
    staff1: { id: 'STAFF001', password: 'staff123', role: 'staff', name: 'Priya Sharma' },
    staff2: { id: 'STAFF002', password: 'staff123', role: 'staff', name: 'Amit Patel' },
  };

  const login = (userId, password) => {
    // Find user by ID
    const foundUser = Object.values(mockUsers).find(
      (u) => u.id === userId && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        role: foundUser.role,
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

