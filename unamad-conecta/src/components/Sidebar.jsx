import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, AlertTriangle, BookOpen, MessageSquare, Bell, User, 
  Shield, Settings, Users, Library, MessageCircle, Calendar
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isStudent = user.rol === 'estudiante';

  // Menús del estudiante
  const studentMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Mis Reportes', path: '/reportes', icon: AlertTriangle },
    { name: 'Biblioteca Digital', path: '/biblioteca', icon: BookOpen },
    { name: 'Comunidad Académica', path: '/comunidad', icon: MessageSquare },
    { name: 'Anuncios y Noticias', path: '/anuncios', icon: Bell },
    { name: 'Mi Perfil', path: '/perfil', icon: User },
  ];

  // Menús del administrador
  const adminMenu = [
    { name: 'Panel de Control', path: '/admin', icon: Shield },
    { name: 'Gestión de Reportes', path: '/reportes', icon: AlertTriangle },
    { name: 'Gestión Biblioteca', path: '/biblioteca', icon: Library },
    { name: 'Gestión Comunidad', path: '/comunidad', icon: MessageSquare },
    { name: 'Gestión de Anuncios', path: '/anuncios', icon: Calendar },
    { name: 'Gestión de Estudiantes', path: '/perfil', icon: Users }, // Reutilizamos /perfil o colocamos en su página correspondiente
  ];

  const menuItems = isStudent ? studentMenu : adminMenu;

  return (
    <aside id="sidebar" className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 space-y-1 transition-colors duration-200 shrink-0">
      
      {/* Tarjeta de usuario en el Sidebar */}
      <div className="flex items-center space-x-3 p-3 mb-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800/60">
        <img
          src={user.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
          alt={user.nombre}
          className="w-11 h-11 rounded-xl object-cover border border-white dark:border-slate-800 shadow-sm"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-snug">{user.nombre}</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate leading-none mt-0.5">{user.correo}</p>
          <span className="inline-block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1.5 leading-none">
            {user.rol === 'admin' ? 'Administrador' : `Semestre ${user.semestre || 'N/A'}`}
          </span>
        </div>
      </div>

      {/* Título de Sección */}
      <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
        Navegación {user.rol === 'admin' ? 'Administrativa' : 'Estudiantil'}
      </p>

      {/* Menú Dinámico */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isItemActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/15'
                  : 'text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isItemActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600 dark:text-gray-500'}`} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Info Pie del Sidebar */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">UNAMAD Conecta © 2026</p>
        <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-semibold uppercase tracking-wider">Portal de Apoyo</span>
      </div>

    </aside>
  );
}
