import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotificaciones, marcarNotificacionesLeidas } from '../services/api';
import { 
  Menu, X, Search, Bell, Sun, Moon, LogOut, User, Shield, 
  BookOpen, MessageSquare, AlertTriangle, Home as HomeIcon, Check
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, darkMode, toggleDarkMode, globalSearch, setGlobalSearch, reloadKey } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Cargar notificaciones cuando el usuario está logueado o cambia el reloadKey
  useEffect(() => {
    if (user && user.rol === 'estudiante') {
      const list = getNotificaciones(user.id);
      setNotifications(list);
    } else {
      setNotifications([]);
    }
  }, [user, reloadKey]);

  const unreadCount = notifications.filter(n => !n.leida).length;

  const handleMarkNotificationsRead = () => {
    if (user) {
      marcarNotificacionesLeidas(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, leida: true })));
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setGlobalSearch(value);
    
    // Si estamos en una página que no es de búsqueda o catálogo, podemos redirigir al catálogo o dashboard
    if (value && location.pathname === '/') {
      navigate('/biblioteca');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav id="navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight block">UNAMAD</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block -mt-1.5">Conecta</span>
              </div>
            </Link>
          </div>

          {/* Buscador Global */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar reportes, libros o anuncios..."
                value={globalSearch}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {globalSearch && (
                <button 
                  onClick={() => setGlobalSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Menú Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/biblioteca" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/biblioteca') 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              Biblioteca
            </Link>
            <Link 
              to="/comunidad" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/comunidad') 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              Comunidad
            </Link>
            <Link 
              to="/anuncios" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/anuncios') 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              Anuncios
            </Link>

            {user && (
              <Link 
                to={user.rol === 'admin' ? '/admin' : '/dashboard'} 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard') || isActive('/admin')
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {user.rol === 'admin' ? 'Panel Admin' : 'Mi Portal'}
              </Link>
            )}
          </div>

          {/* Acciones del lado derecho */}
          <div className="flex items-center space-x-3">
            
            {/* Botón Modo Oscuro */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Modo Claro" : "Modo Oscuro"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notificaciones (solo estudiantes) */}
            {user && user.rol === 'estudiante' && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserDropdownOpen(false);
                    if (!notificationsOpen) handleMarkNotificationsRead();
                  }}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown de Notificaciones */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">Notificaciones</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Nuevas actualizaciones</span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-500">No tienes notificaciones aún.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`px-4 py-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${
                              !notif.leida ? 'bg-emerald-50/20 dark:bg-emerald-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md mt-0.5">
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-normal leading-relaxed">{notif.mensaje}</p>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">{notif.fecha}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Perfil / Sesión */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 rounded-full"
                >
                  <img
                    src={user.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                    alt={user.nombre}
                    className="w-8.5 h-8.5 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                  />
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.nombre.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Usuario */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.correo}</p>
                      <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                        {user.rol === 'admin' ? 'Administrador' : 'Estudiante'}
                      </span>
                    </div>

                    <div className="py-1">
                      {user.rol === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                        >
                          <Shield className="w-4 h-4 text-emerald-600" />
                          <span>Panel de Control</span>
                        </Link>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                          >
                            <HomeIcon className="w-4 h-4 text-gray-500" />
                            <span>Mi Dashboard</span>
                          </Link>
                          <Link
                            to="/reportes"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                          >
                            <AlertTriangle className="w-4 h-4 text-gray-500" />
                            <span>Mis Reportes</span>
                          </Link>
                          <Link
                            to="/perfil"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                          >
                            <User className="w-4 h-4 text-gray-500" />
                            <span>Editar Perfil</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-slate-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Botón de Menú Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          
          {/* Input de Búsqueda Móvil */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={globalSearch}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
          >
            <HomeIcon className="w-5 h-5 text-gray-500" />
            <span>Inicio</span>
          </Link>
          <Link 
            to="/biblioteca" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-gray-500" />
            <span>Biblioteca Digital</span>
          </Link>
          <Link 
            to="/comunidad" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <span>Comunidad Académica</span>
          </Link>
          <Link 
            to="/anuncios" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            <span>Anuncios</span>
          </Link>

          {user ? (
            <>
              <div className="border-t border-gray-100 dark:border-slate-800 my-2 pt-2"></div>
              <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Mi Portal</p>
              {user.rol === 'admin' ? (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-emerald-600 bg-emerald-50/50 dark:text-emerald-400 dark:bg-emerald-500/5"
                >
                  <Shield className="w-5 h-5" />
                  <span>Panel Administrativo</span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-500" />
                    <span>Mi Dashboard</span>
                  </Link>
                  <Link 
                    to="/reportes" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5 text-gray-500" />
                    <span>Mis Reportes</span>
                  </Link>
                  <Link 
                    to="/perfil" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Editar Perfil</span>
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 px-3 py-2.5 mt-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-slate-800 pt-4 mt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:text-gray-200 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
