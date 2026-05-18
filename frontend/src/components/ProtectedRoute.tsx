import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


// Customer-only
export const CustomerRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Provider-only
export const ProviderRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('providerToken');
  return token ? <>{children}</> : <Navigate to="/provider/login" replace />;
};

// Admin-only — reads directly from localStorage to avoid race condition
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('userRole');
  
  console.log('AdminRoute check - token:', token, 'role:', role);
  
  if (!token) return <Navigate to="/login" replace />;
  if (role?.toLowerCase() !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default CustomerRoute;