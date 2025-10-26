import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, redirectTo = "/" }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#FEF9E7'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#B8860B',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#FEF9E7',
        flexDirection: 'column'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#B8860B',
          fontSize: '24px',
          marginBottom: '1rem'
        }}>
          🚫 Access Denied
        </div>
        <div style={{
          color: '#666',
          fontSize: '16px'
        }}>
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return children;
}
