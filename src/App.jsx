import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from "./Pages/MainDashboard";
import Login from "./Pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Static credentials for demo purposes
  const staticCredentials = {
    username: 'demo',
    password: 'password123'
  };

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Login handler
  const handleLogin = (username, password) => {
    if (
      username === staticCredentials.username && 
      password === staticCredentials.password
    ) {
      // Store a token in localStorage
      localStorage.setItem('authToken', JSON.stringify({
        timestamp: Date.now()
      }));
      setIsAuthenticated(true);
      return true;
    } else {
      alert('Invalid credentials');
      return false;
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>; // Or a spinner component
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        {/* Redirect to login if accessing root */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        {/* Catch-all route */}
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