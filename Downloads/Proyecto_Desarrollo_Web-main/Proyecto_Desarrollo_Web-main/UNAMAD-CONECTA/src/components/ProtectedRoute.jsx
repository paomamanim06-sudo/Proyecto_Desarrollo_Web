import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Cargando plataforma...</p>
        </div>
      </div>
    );
  }

  // Si no está logueado, redirigir a Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el rol del usuario no está incluido, redirigir según su rol
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    if (user.rol === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
