import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { checkAuth, logout } from './service/authService';
import MainDashboard from "./Pages/MainDashboard";
import Login from "./Pages/Login";
import { CircularProgress, Box } from '@mui/material';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = checkAuth();
    setIsAuthenticated(auth);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    // Perform logout operations
    logout();
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: '#F6C000' }} />
        </Box>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;