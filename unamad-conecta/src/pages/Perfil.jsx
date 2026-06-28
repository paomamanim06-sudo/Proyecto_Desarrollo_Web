import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsuarios, actualizarUsuario, toggleEstadoUsuario } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  User, ShieldCheck, Mail, Phone, Lock, Hash, GraduationCap, 
  Calendar, Key, CheckCircle2, AlertCircle, Edit, Search, UserMinus, 
  UserCheck, Save, X 
} from 'lucide-react';

export default function Perfil() {
  const { user, updateUser, reloadKey, triggerReload } = useAuth();
  const isAdmin = user?.rol === 'admin';

  // Estados para Estudiante (Editar Perfil Propio)
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [semestre, setSemestre] = useState('');
  const [foto, setFoto] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Estados para Administrador (Gestión de Estudiantes)
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [search, setSearch] = useState('');
  
  // Estado para Edición Admin de Alumno
  const [editingAlumnoId, setEditingAlumnoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCarrera, setEditCarrera] = useState('');
  const [editSemestre, setEditSemestre] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const carreras = [
    'Ingeniería de Sistemas e Informática',
    'Medicina Veterinaria y Zootecnia',
    'Derecho y Ciencias Políticas',
    'Administración',
    'Contabilidad y Finanzas',
    'Ingeniería Forestal y Medio Ambiente',
    'Ecoturismo',
    'Educación'
  ];

  const semestres = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  // Cargar datos propios
  useEffect(() => {
    if (user && !isAdmin) {
      setNombre(user.nombre);
      setTelefono(user.telefono || '');
      setSemestre(user.semestre || '');
      setFoto(user.foto || '');
      setContrasena('');
      setConfirmarContrasena('');
    }
  }, [user, isAdmin]);

  // Cargar listado de alumnos para Administrador
  useEffect(() => {
    if (isAdmin) {
      const todos = getUsuarios();
      // Filtrar administradores para no mostrarlos en la gestión de alumnos
      const soloEstudiantes = todos.filter(u => u.rol === 'estudiante');
      setAlumnos(soloEstudiantes);
    }
  }, [isAdmin, reloadKey]);

  // Filtrado de alumnos para Administrador
  useEffect(() => {
    let result = [...alumnos];
    const query = search.toLowerCase().trim();
    if (query) {
      result = result.filter(u => 
        u.nombre.toLowerCase().includes(query) ||
        u.codigo.toLowerCase().includes(query) ||
        u.correo.toLowerCase().includes(query) ||
        u.carrera.toLowerCase().includes(query)
      );
    }
    setFilteredAlumnos(result);
  }, [alumnos, search]);

  // Guardar perfil propio (Estudiante)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nombre) {
      setError('El nombre completo es obligatorio.');
      return;
    }

    // Validar contraseña si se ingresó algo
    if (contrasena) {
      if (contrasena.length < 6) {
        setError('La nueva contraseña debe tener un mínimo de 6 caracteres.');
        return;
      }
      if (contrasena !== confirmarContrasena) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    const payload = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      semestre,
      foto: foto.trim() || null
    };

    if (contrasena) {
      payload.contrasena = contrasena;
    }

    const actualizado = actualizarUsuario(user.id, payload);
    if (actualizado) {
      // Actualizar sesión global
      updateUser(actualizado);
      setSuccess('Tu perfil estudiantil se ha actualizado de forma exitosa.');
      setContrasena('');
      setConfirmarContrasena('');
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError('No se pudo actualizar la información en este momento.');
    }
  };

  // Guardar cambios sobre Alumno (Administrador)
  const handleSaveAlumnoByAdmin = (id) => {
    if (!editNombre) {
      alert("El nombre completo no puede estar vacío.");
      return;
    }

    const payload = {
      nombre: editNombre.trim(),
      carrera: editCarrera,
      semestre: editSemestre
    };

    if (editPassword) {
      if (editPassword.length < 6) {
        alert("La contraseña debe ser de al menos 6 caracteres.");
        return;
      }
      payload.contrasena = editPassword;
    }

    const actualizado = actualizarUsuario(id, payload);
    if (actualizado) {
      setSuccess(`Los datos de ${editNombre} han sido actualizados con éxito.`);
      setEditingAlumnoId(null);
      setEditPassword('');
      triggerReload();
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  // Desactivar o Activar Alumno (Administrador)
  const handleToggleEstado = (id, nombre, estadoActual) => {
    const accion = estadoActual ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro que deseas ${accion} la cuenta del estudiante ${nombre}?`)) {
      toggleEstadoUsuario(id);
      setSuccess(`La cuenta de ${nombre} ha sido ${estadoActual ? 'desactivada' : 'reactivada'} con éxito.`);
      triggerReload();
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  const handleStartEditAlumno = (alumno) => {
    setEditingAlumnoId(alumno.id);
    setEditNombre(alumno.nombre);
    setEditCarrera(alumno.carrera);
    setEditSemestre(alumno.semestre);
    setEditPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
          
          {/* Cabecera contextual */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
              <User className="w-6.5 h-6.5 text-emerald-600" />
              <span>{isAdmin ? 'Gestión y Control de Estudiantes' : 'Mi Perfil UNAMAD'}</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin 
                ? 'Administra el padrón general de estudiantes registrados, bloquea accesos y rectifica matrículas.' 
                : 'Mantén al día tu información académica de contacto y seguridad de tus credenciales.'
              }
            </p>
          </div>

          {/* Éxito */}
          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 text-emerald-800 dark:text-emerald-400 text-xs animate-in slide-in-from-top-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Errores */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start space-x-2 text-red-700 dark:text-red-400 text-xs">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* CUERPO CENTRAL */}
          {!isAdmin ? (
            
            /* VISTA DEL ESTUDIANTE: EDITAR PERFIL PROPIO */
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Columna Izquierda: Foto de Perfil */}
              <div className="md:col-span-4 flex flex-col items-center text-center space-y-4 pb-6 md:pb-0 md:border-r border-gray-50 dark:border-slate-800">
                <img
                  src={foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"}
                  alt={user?.nombre}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user?.nombre}</h3>
                  <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block tracking-wider">Estudiante</span>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl w-full text-left space-y-1 text-xs text-gray-500">
                  <p>Código: <strong className="text-gray-800 dark:text-gray-300 font-bold">{user?.codigo}</strong></p>
                  <p className="truncate">Correo: <strong className="text-gray-800 dark:text-gray-300 font-bold">{user?.correo}</strong></p>
                  <p>Carrera: <strong className="text-gray-800 dark:text-gray-300 font-semibold">{user?.carrera}</strong></p>
                </div>
              </div>

              {/* Columna Derecha: Formulario de actualización */}
              <form onSubmit={handleSaveProfile} className="md:col-span-8 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Ajustes de Cuenta</h3>
                
                {/* Nombre */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Nombre Completo <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Teléfono */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Teléfono de Contacto</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="984 000 000"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Semestre */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Semestre Académico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <select
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {semestres.map(sem => (
                          <option key={sem} value={sem}>Semestre {sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Enlace Foto */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Enlace Avatar (URL de Imagen)</label>
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/mifoto.jpg"
                    value={foto}
                    onChange={(e) => setFoto(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-gray-50 dark:border-slate-800/40 space-y-4">
                  <h4 className="text-[11px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider flex items-center"><Key className="w-4 h-4 mr-1" />Cambiar Contraseña (Dejar en blanco si no deseas cambiarla)</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block">Nueva Contraseña</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 block">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                  >
                    Guardar Cambios de Perfil
                  </button>
                </div>
              </form>

            </div>
          ) : (
            
            /* VISTA DEL ADMINISTRADOR: GESTIÓN DE CUENTAS DE ALUMNOS */
            <div className="space-y-4">
              
              {/* Barra de Búsqueda de Alumnos */}
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center shadow-sm">
                <div className="relative w-full md:max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar estudiante por nombre, código, correo, carrera..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Formulario Inline de Edición (Cuando Admin edita un Alumno) */}
              {editingAlumnoId && (
                <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm max-w-3xl space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800">
                    <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center"><Edit className="w-4.5 h-4.5 mr-1" />Editar Matrícula del Estudiante</h3>
                    <button onClick={() => setEditingAlumnoId(null)} className="p-1 hover:bg-red-50 text-gray-400 rounded-lg">
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block uppercase">Nombre Completo</label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block uppercase">Carrera Profesional</label>
                      <select
                        value={editCarrera}
                        onChange={(e) => setEditCarrera(e.target.value)}
                        className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                      >
                        {carreras.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block uppercase">Semestre</label>
                      <select
                        value={editSemestre}
                        onChange={(e) => setEditSemestre(e.target.value)}
                        className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                      >
                        {semestres.map(s => <option key={s} value={s}>Semestre {s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 block uppercase">Forzar Restablecimiento Clave (Opcional)</label>
                      <input
                        type="password"
                        placeholder="Ingresar nueva contraseña"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="block w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setEditingAlumnoId(null)}
                      className="px-4 py-1.5 border border-gray-100 rounded-lg text-xs text-gray-500"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveAlumnoByAdmin(editingAlumnoId)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Ajustes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Listado en Tabla */}
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-50 dark:border-slate-800/40">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Estudiantes Inscritos en UNAMAD Conecta</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-800/40 text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-50 dark:border-slate-800">
                        <th className="py-3 px-5">Estudiante</th>
                        <th className="py-3 px-4">Código / Matrícula</th>
                        <th className="py-3 px-4">Correo Institucional</th>
                        <th className="py-3 px-4">Carrera Profesional</th>
                        <th className="py-3 px-4">Ciclo</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                        <th className="py-3 px-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800 text-xs text-gray-600 dark:text-gray-300">
                      {filteredAlumnos.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-10 text-gray-400">
                            No se encontraron estudiantes que coincidan con la búsqueda "{search}".
                          </td>
                        </tr>
                      ) : (
                        filteredAlumnos.map(alum => (
                          <tr key={alum.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                            
                            {/* Avatar + Nombre */}
                            <td className="py-3.5 px-5 flex items-center space-x-3">
                              <img
                                src={alum.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                                alt={alum.nombre}
                                className="w-8 h-8 rounded-full object-cover border shrink-0"
                              />
                              <span className="font-bold text-gray-800 dark:text-gray-200">{alum.nombre}</span>
                            </td>

                            {/* Código */}
                            <td className="py-3.5 px-4 font-mono text-[11px] font-bold select-all">{alum.codigo}</td>

                            {/* Correo */}
                            <td className="py-3.5 px-4 select-all text-gray-500 dark:text-gray-400">{alum.correo}</td>

                            {/* Carrera */}
                            <td className="py-3.5 px-4 truncate max-w-[150px]" title={alum.carrera}>{alum.carrera}</td>

                            {/* Semestre */}
                            <td className="py-3.5 px-4 text-center font-bold">Semestre {alum.semestre}</td>

                            {/* Estado */}
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                alum.estado === 'activo' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                  : 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-400'
                              }`}>
                                {alum.estado === 'activo' ? 'Activo' : 'Baneado / Inactivo'}
                              </span>
                            </td>

                            {/* Acciones */}
                            <td className="py-3.5 px-5 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                              <button
                                onClick={() => handleStartEditAlumno(alum)}
                                className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-gray-100 dark:border-slate-700 inline-flex items-center"
                                title="Editar Datos"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleEstado(alum.id, alum.nombre, alum.estado === 'activo')}
                                className={`p-1.5 rounded-lg transition-colors border inline-flex items-center ${
                                  alum.estado === 'activo' 
                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-100' 
                                    : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border-emerald-100'
                                }`}
                                title={alum.estado === 'activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                              >
                                {alum.estado === 'activo' ? <UserMinus className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              </button>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
