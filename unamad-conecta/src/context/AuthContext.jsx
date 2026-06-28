import React, { createContext, useState, useEffect, useContext } from 'react';
import { initializeDatabase, loginUsuario, registrarUsuario, actualizarUsuario } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('unamad_theme') === 'dark';
  });
  const [globalSearch, setGlobalSearch] = useState('');
  
  // Para forzar la recarga de componentes que consumen datos de localStorage cuando estos cambian
  const [reloadKey, setReloadKey] = useState(0);

  const triggerReload = () => {
    setReloadKey(prev => prev + 1);
  };

  // Inicializar base de datos y restaurar sesión del usuario
  useEffect(() => {
    async function init() {
      const ready = await initializeDatabase();
      setDbReady(ready);

      const savedUser = localStorage.getItem('unamad_current_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('unamad_current_user');
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  // Manejar cambios en el DOM para el modo oscuro
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('unamad_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('unamad_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const login = async (correo, contrasena) => {
    setLoading(true);
    try {
      const loggedUser = loginUsuario(correo, contrasena);
      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem('unamad_current_user', JSON.stringify(loggedUser));
        triggerReload();
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales inválidas. Verifique su correo y contraseña.' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unamad_current_user');
    triggerReload();
  };

  const register = async (nuevoEstudiante) => {
    setLoading(true);
    try {
      const registrado = registrarUsuario(nuevoEstudiante);
      triggerReload();
      return { success: true, user: registrado };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (camposActualizados) => {
    if (!user) return { success: false, error: 'No hay usuario autenticado.' };
    
    try {
      const usuarioActualizado = actualizarUsuario(user.id, camposActualizados);
      if (usuarioActualizado) {
        setUser(usuarioActualizado);
        localStorage.setItem('unamad_current_user', JSON.stringify(usuarioActualizado));
        triggerReload();
        return { success: true, user: usuarioActualizado };
      }
      return { success: false, error: 'No se pudo actualizar el perfil.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        dbReady,
        darkMode,
        globalSearch,
        reloadKey,
        setGlobalSearch,
        toggleDarkMode,
        login,
        logout,
        register,
        updateProfile,
        triggerReload
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
