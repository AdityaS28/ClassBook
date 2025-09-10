import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '@/lib/auth';

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  if (isAuthenticated()) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={isAdmin() ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return <>{children}</>;
};