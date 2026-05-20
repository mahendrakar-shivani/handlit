import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const getUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem('user') || '{}'
    );
  } catch {
    return {};
  }
};

export const CustomerRoute = (
  { children }: { children: ReactNode }
) => {
  const token = localStorage.getItem('token');
  return token
    ? <>{children}</>
    : <Navigate to="/login" replace />;
};

export const ProviderRoute = (
  { children }: { children: ReactNode }
) => {
  const token =
    localStorage.getItem('providerToken');
  return token
    ? <>{children}</>
    : <Navigate to="/provider/login" replace />;
};

export const AdminRoute = (
  { children }: { children: ReactNode }
) => {
  const token = localStorage.getItem('token');
  const user  = getUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default CustomerRoute;