import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  // Check if user is authenticated
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (!authToken) {
    // Redirect to landing page if not authenticated
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to landing if role doesn't match
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
