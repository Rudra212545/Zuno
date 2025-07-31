// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // console.log("Checking token in ProtectedRoute:", localStorage.getItem('token'));
  const token = localStorage.getItem('token');


  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
