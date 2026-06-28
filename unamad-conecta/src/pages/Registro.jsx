import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, AlertCircle, CheckCircle, GraduationCap, Calendar, Hash } from 'lucide-react';

export default function Registro() {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [correo, setCorreo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // Lista de carreras de la UNAMAD
  const carrerasUnamad = [
    'Ingeniería de Sistemas e Informática',
    'Medicina Veterinaria y Zootecnia',
    'Derecho y Ciencias Políticas',
    'Administración',
    'Contabilidad y Finanzas',
    'Ingeniería Forestal y Medio Ambiente',
    'Ecoturismo',
    'Educación: Especialidad Inicial y Primaria'
  ];

  // Lista de semestres académicos
  const semestres = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar obligatoriedad
    if (!nombre || !codigo || !correo || !carrera || !semestre || !contrasena || !confirmarContrasena) {
      setError('Todos los campos son estrictamente obligatorios.');
      return;
    }

    // Validar formato de correo institucional
    if (!correo.endsWith('@unamad.edu.pe')) {
      setError('El correo institucional debe ser un correo válido de la UNAMAD (@unamad.edu.pe).');
      return;
    }

    // Validar que el código universitario tenga el formato o largo correcto
    if (codigo.trim().length < 6) {
      setError('El código universitario debe tener un mínimo de 6 caracteres.');
      return;
    }

    // Validar coincidencia de contraseña
    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    const result = await register({
      nombre: nombre.trim(),
      codigo: codigo.trim(),
      correo: correo.trim(),
      carrera,
      semestre,
      contrasena,
      telefono: '984000000', // Teléfono inicial por defecto
    });

    if (result.success) {
      setSuccess('¡Registro completado con éxito! Redirigiendo al login en 2 segundos...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl w-full space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-md">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-xl shadow-md">
            <Shield className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Registro de Estudiantes
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Regístrate hoy para acceder a reportes, biblioteca y comunidad.
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start space-x-2 text-red-700 dark:text-red-400 text-xs">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-start space-x-2 text-emerald-700 dark:text-emerald-400 text-xs animate-bounce">
            <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Nombre */}
          <div className="space-y-1">
            <label htmlFor="nombre" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="nombre"
                type="text"
                required
                placeholder="Juan Pérez Quispe"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Código universitario */}
            <div className="space-y-1">
              <label htmlFor="codigo" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Código Universitario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  id="codigo"
                  type="text"
                  required
                  placeholder="23121005"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Correo institucional */}
            <div className="space-y-1">
              <label htmlFor="correo" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Correo Institucional <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="correo"
                  type="email"
                  required
                  placeholder="estudiante@unamad.edu.pe"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Carrera */}
            <div className="space-y-1">
              <label htmlFor="carrera" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Carrera Profesional <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <select
                  id="carrera"
                  required
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona tu carrera</option>
                  {carrerasUnamad.map((car) => (
                    <option key={car} value={car}>{car}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Semestre */}
            <div className="space-y-1">
              <label htmlFor="semestre" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Semestre Académico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <select
                  id="semestre"
                  required
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona semestre</option>
                  {semestres.map((sem) => (
                    <option key={sem} value={sem}>Semestre {sem}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contraseña */}
            <div className="space-y-1">
              <label htmlFor="contrasena" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="contrasena"
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-1">
              <label htmlFor="confirmarContrasena" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmarContrasena"
                  type="password"
                  required
                  placeholder="Repite la contraseña"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Botón */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/10 transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registrando Estudiante...</span>
                </>
              ) : (
                <span>Crear Cuenta Estudiantil</span>
              )}
            </button>
          </div>

        </form>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-50 dark:border-slate-800 text-center text-xs">
          <p className="text-gray-500">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
              Ingresa aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
