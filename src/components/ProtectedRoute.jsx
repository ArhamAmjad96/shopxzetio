import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, admin = false }) {
  const { loading, profileLoading, profile, isCustomer, isAdmin } = useAuth();
  const location = useLocation();
  // Only block rendering if session is still loading or initial profile hasn't loaded yet
  if (loading || (isCustomer && profileLoading && !profile)) {
    return <main className="account-shell"><div className="auth-card">Checking secure session…</div></main>;
  }
  if (!isCustomer) return <Navigate to={`${admin ? '/admin/login' : '/login'}?return=${encodeURIComponent(location.pathname)}`} replace />;
  if (admin && !isAdmin) return <Navigate to="/admin/login?error=not-admin" replace />;
  if (!admin && isAdmin) return <Navigate to="/admin" replace />;
  return children;
}
