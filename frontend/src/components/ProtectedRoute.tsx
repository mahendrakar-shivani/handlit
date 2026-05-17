import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token') || localStorage.getItem('providerToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;