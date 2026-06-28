import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Reportes from './pages/Reportes';
import Biblioteca from './pages/Biblioteca';
import Comunidad from './pages/Comunidad';
import Anuncios from './pages/Anuncios';
import Perfil from './pages/Perfil';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/anuncios" element={<Anuncios />} />

          {/* Autenticación (Solo no autenticados) */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas Protegidas del Alumno */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reportes" 
            element={
              <ProtectedRoute allowedRoles={['estudiante']}>
                <Reportes />
              </ProtectedRoute>
            } 
          />
          
          {/* Perfil (Protegido - Estudiante edita perfil, Admin gestiona estudiantes) */}
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute allowedRoles={['estudiante', 'admin']}>
                <Perfil />
              </ProtectedRoute>
            } 
          />

          {/* Rutas Protegidas del Administrador */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
