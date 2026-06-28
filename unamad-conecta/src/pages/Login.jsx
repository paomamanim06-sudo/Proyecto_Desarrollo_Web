import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para recuperación de contraseña ("¿Olvidaste tu contraseña?")
  const [showRecover, setShowRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSuccess, setRecoverSuccess] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      if (user.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !contrasena) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validación básica de correo institucional
    if (!correo.endsWith('@unamad.edu.pe')) {
      setError('Por favor, ingresa un correo institucional válido (@unamad.edu.pe).');
      return;
    }

    setIsLoading(true);

    const result = await login(correo, contrasena);
    if (result.success) {
      // Redirección manejada por el useEffect o manual
      if (correo === 'admin@unamad.edu.pe') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleRecoverSubmit = (e) => {
    e.preventDefault();
    setRecoverError('');
    setRecoverSuccess('');

    if (!recoverEmail) {
      setRecoverError('Por favor, ingresa tu correo institucional.');
      return;
    }

    if (!recoverEmail.endsWith('@unamad.edu.pe')) {
      setRecoverError('El correo ingresado debe pertenecer a la UNAMAD (@unamad.edu.pe).');
      return;
    }

    setIsRecovering(true);

    // Simular envío de correo de restablecimiento
    setTimeout(() => {
      setRecoverSuccess(`Se ha enviado un enlace de recuperación simulado a: ${recoverEmail}. Revisa tu bandeja de entrada.`);
      setIsRecovering(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-md">
        
        {/* Vista Estándar del Login */}
        {!showRecover ? (
          <>
            {/* Header del formulario */}
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/15">
                <Shield className="w-8 h-8" />
              </Link>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Iniciar sesión en UNAMAD Conecta
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Usa tus credenciales oficiales de estudiante o administrador.
              </p>
            </div>

            {/* Alerta de Error */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start space-x-2 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulario */}
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              
              <div className="space-y-1">
                <label htmlFor="correo" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                  Correo Institucional <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="correo"
                    type="email"
                    required
                    placeholder="usuario@unamad.edu.pe"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <span className="text-[10px] text-gray-400 block pl-1">Debe finalizar en @unamad.edu.pe</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="contrasena" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecover(true);
                      setRecoverEmail(correo); // Llevar el correo si ya lo escribió
                      setRecoverSuccess('');
                      setRecoverError('');
                    }}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="contrasena"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/10 transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>

            </form>

            {/* Separador de registro */}
            <div className="pt-4 border-t border-gray-50 dark:border-slate-800 text-center">
              <p className="text-xs text-gray-500">
                ¿Aún no tienes una cuenta?{' '}
                <Link to="/registro" className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  Regístrate aquí
                </Link>
              </p>
              <div className="mt-4 bg-emerald-50/40 dark:bg-emerald-950/10 p-3 rounded-2xl border border-emerald-100/30 text-left space-y-1.5 text-[11px] text-gray-600 dark:text-gray-400">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-[10px]">Credenciales de Prueba:</p>
                <p>🎓 Estudiante: <span className="font-semibold select-all">estudiante@unamad.edu.pe</span> / Clave: <span className="font-semibold select-all">123456</span></p>
                <p>💼 Administrador: <span className="font-semibold select-all">admin@unamad.edu.pe</span> / Clave: <span className="font-semibold select-all">admin123</span></p>
              </div>
            </div>
          </>
        ) : (
          /* Vista de Recuperación de Contraseña */
          <>
            <div className="space-y-4">
              <button
                onClick={() => setShowRecover(false)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Login</span>
              </button>

              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  ¿Olvidaste tu contraseña?
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Ingresa tu correo institucional `@unamad.edu.pe` registrado en el portal. Te enviaremos un correo para restablecer tus claves.
                </p>
              </div>

              {/* Errores de Recuperación */}
              {recoverError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start space-x-2 text-red-700 dark:text-red-400 text-xs">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{recoverError}</span>
                </div>
              )}

              {/* Éxito de Recuperación */}
              {recoverSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl space-y-3">
                  <div className="flex items-start space-x-2 text-emerald-800 dark:text-emerald-400 text-xs">
                    <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                    <span>{recoverSuccess}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowRecover(false);
                      setRecoverSuccess('');
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Iniciar Sesión con mi nueva clave
                  </button>
                </div>
              )}

              {/* Formulario de Recuperación */}
              {!recoverSuccess && (
                <form onSubmit={handleRecoverSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label htmlFor="recoverEmail" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                      Correo Institucional Estudiantil
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="recoverEmail"
                        type="email"
                        required
                        placeholder="usuario@unamad.edu.pe"
                        value={recoverEmail}
                        onChange={(e) => setRecoverEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRecovering}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRecovering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Buscando en servidor...</span>
                      </>
                    ) : (
                      <span>Enviar Enlace de Recuperación</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
