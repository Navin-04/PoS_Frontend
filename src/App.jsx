import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import Billing from './pages/Billing';
import BillHistory from './pages/BillHistory';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import './App.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <InvoiceProvider>
        <Router>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['owner']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <PrivateRoute allowedRoles={['owner', 'staff']}>
                <Billing />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute allowedRoles={['owner', 'staff']}>
                <MenuManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/bill-history"
            element={
              <PrivateRoute allowedRoles={['owner', 'staff']}>
                <BillHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={['owner', 'staff']}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        </Router>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;

