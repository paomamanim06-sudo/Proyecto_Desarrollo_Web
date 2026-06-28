import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getReportes, actualizarEstadoReporte, getUsuarios, getLibros, getVoluntarios 
} from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CardReporte from '../components/CardReporte';
import { 
  ShieldAlert, Users, Library, ShieldCheck, AlertTriangle, Search, Filter, 
  X, CheckCircle, Clock, Eye, AlertCircle, Save, MessageSquareText, HelpCircle 
} from 'lucide-react';

export default function AdminPanel() {
  const { user, globalSearch, reloadKey, triggerReload } = useAuth();
  
  // Datos generales para estadísticas
  const [totalAlumnos, setTotalAlumnos] = useState(0);
  const [totalLibros, setTotalLibros] = useState(0);
  const [totalVoluntarios, setTotalVoluntarios] = useState(0);

  // Estados de Reportes
  const [reportes, setReportes] = useState([]);
  const [filteredReportes, setFilteredReportes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');

  // Estado para Moderación de un Reporte
  const [moderarReporte, setModerarReporte] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observacionAdmin, setObservacionAdmin] = useState('');
  const [success, setSuccess] = useState('');

  const categorias = ['Todas', 'Infraestructura', 'Académico', 'Bullying', 'Acoso', 'Servicios', 'Administrativo'];
  const estados = ['Todos', 'Pendiente', 'En revisión', 'Resuelto', 'Rechazado'];

  // Cargar estadísticas y reportes
  useEffect(() => {
    // 1. Cargar estadísticas de usuarios (solo estudiantes)
    const alumnosInscritos = getUsuarios().filter(u => u.rol === 'estudiante');
    setTotalAlumnos(alumnosInscritos.length);

    // 2. Cargar libros
    setTotalLibros(getLibros().length);

    // 3. Cargar voluntarios
    setTotalVoluntarios(getVoluntarios().length);

    // 4. Cargar todos los reportes de la universidad
    const todosReportes = getReportes();
    // Ordenar por fecha desc (más recientes primero)
    todosReportes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    setReportes(todosReportes);
  }, [reloadKey]);

  // Filtrado de reportes
  useEffect(() => {
    let result = [...reportes];

    // Buscar por buscador local o global
    const query = (search || globalSearch).toLowerCase().trim();
    if (query) {
      result = result.filter(r => 
        r.codigo.toLowerCase().includes(query) ||
        r.estudianteNombre.toLowerCase().includes(query) ||
        r.categoria.toLowerCase().includes(query) ||
        r.descripcion.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategoria !== 'Todas') {
      result = result.filter(r => r.categoria === selectedCategoria);
    }

    // Filtrar por estado
    if (selectedEstado !== 'Todos') {
      result = result.filter(r => r.estado === selectedEstado);
    }

    setFilteredReportes(result);
  }, [reportes, search, globalSearch, selectedCategoria, selectedEstado]);

  const handleStartModeration = (reporte) => {
    setModerarReporte(reporte);
    setNuevoEstado(reporte.estado);
    setObservacionAdmin(reporte.observacionAdmin || '');
    setSuccess('');
  };

  const handleSaveModeration = (e) => {
    e.preventDefault();
    if (!moderarReporte) return;

    const actualizado = actualizarEstadoReporte(moderarReporte.id, nuevoEstado, observacionAdmin.trim());
    if (actualizado) {
      setSuccess(`El caso con código ${moderarReporte.codigo} ha sido actualizado a estado "${nuevoEstado}". Se le notificó al estudiante.`);
      setModerarReporte(null);
      setNuevoEstado('');
      setObservacionAdmin('');
      triggerReload();

      // Auto ocultar mensaje en 5 segundos
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
          
          {/* Cabecera */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
              <ShieldCheck className="w-6.5 h-6.5 text-emerald-600" />
              <span>Consola de Administración Central</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Modera y canaliza los reportes estudiantiles presentados de forma discreta a las Oficinas de Bienestar y Mantenimiento de la UNAMAD.
            </p>
          </div>

          {/* Fila de Estadísticas Rápidas (KPIs) */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Estudiantes</span>
                <Users className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white block leading-none">{totalAlumnos}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Cuentas activas en portal</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Reportes Pendientes</span>
                <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white block leading-none">
                  {reportes.filter(r => r.estado === 'Pendiente' || r.estado === 'En revisión').length}
                </span>
                <span className="text-[10px] text-gray-400 block mt-1">Requieren revisión inmediata</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Recursos Biblioteca</span>
                <Library className="w-4.5 h-4.5 text-blue-500" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white block leading-none">{totalLibros}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Libros y guías subidos</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Tutores Voluntarios</span>
                <Users className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white block leading-none">{totalVoluntarios}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Asesores de ciclo superior</span>
              </div>
            </div>

          </section>

          {/* Alerta de Éxito de Moderación */}
          {success && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 text-emerald-800 dark:text-emerald-400 text-xs animate-in slide-in-from-top-4">
              <CheckCircle className="w-5.5 h-5.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
              <span>{success}</span>
            </div>
          )}

          {/* Formulario de Moderación de Reporte (Flotante o Seccional) */}
          {moderarReporte && (
            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto space-y-4 animate-in slide-in-from-top-4 duration-300">
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-800/60">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Moderar Reporte: {moderarReporte.codigo}</span>
                </h3>
                <button
                  onClick={() => setModerarReporte(null)}
                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Información General del Reporte */}
              <div className="bg-gray-50 dark:bg-slate-800/40 p-4 rounded-xl text-xs space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-gray-400 font-medium">Estudiante Afectado:</p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    {moderarReporte.visibilidad === 'Anónimo' ? 'Anónimo (Ocultado por seguridad)' : moderarReporte.estudianteNombre}
                  </p>
                  <p className="text-gray-400 font-medium mt-2">Carrera / Ciclo:</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {moderarReporte.visibilidad === 'Anónimo' ? 'Confidencial' : moderarReporte.estudianteCarrera}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 font-medium">Categoría del Incidente:</p>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">{moderarReporte.categoria}</p>
                  <p className="text-gray-400 font-medium mt-2">Fecha de Reporte:</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">{moderarReporte.fecha}</p>
                </div>
                <div className="sm:col-span-2 border-t border-gray-100 dark:border-slate-800 pt-2 space-y-1">
                  <p className="text-gray-400 font-medium">Descripción del Suceso:</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-gray-100 dark:border-slate-800 font-sans">
                    {moderarReporte.descripcion}
                  </p>
                </div>
                
                {moderarReporte.adjunto && (
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-gray-400 font-medium">Documento / Evidencia Adjunta:</p>
                    <a
                      href={moderarReporte.adjunto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-600 font-bold hover:underline"
                    >
                      <span>Ver archivo adjunto ({moderarReporte.adjunto.split('/').pop()})</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Formulario de Transición de Estado y Observación */}
              <form onSubmit={handleSaveModeration} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Cambio de Estado */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Asignar Nuevo Estado:</label>
                    <select
                      value={nuevoEstado}
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Resuelto">Resuelto</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </div>
                </div>

                {/* Respuesta Oficial */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Observación / Respuesta Oficial:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Escribe la respuesta oficial, los pasos de solución tomados o el dictamen de las autoridades para que el alumno pueda revisarlo..."
                    value={observacionAdmin}
                    onChange={(e) => setObservacionAdmin(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 block pl-1">Este texto aparecerá de forma inmediata en la pestaña de seguimiento del estudiante.</span>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModerarReporte(null)}
                    className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1 hover:bg-emerald-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar dictamen</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* Sección Principal: Bandeja de Alertas */}
          <section className="space-y-5">
            
            {/* Barra de Filtros */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              
              {/* Buscador de Alertas */}
              <div className="relative w-full md:max-w-xs shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por código, alumno, tema..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtros dropdown */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
                
                {/* Categoría */}
                <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide hidden sm:block">Categoría:</span>
                  <select
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                    className="block w-full sm:w-auto py-1.5 px-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide hidden sm:block">Estado:</span>
                  <select
                    value={selectedEstado}
                    onChange={(e) => setSelectedEstado(e.target.value)}
                    className="block w-full sm:w-auto py-1.5 px-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {estados.map(est => (
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                </div>

              </div>

            </div>

            {/* Listado de Casos */}
            {filteredReportes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Bandeja de reportes vacía</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    No se encuentran reportes presentados de este tipo que coincidan con los filtros seleccionados en este momento.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReportes.map(rep => (
                  <CardReporte 
                    key={rep.id} 
                    reporte={rep} 
                    isAdmin={true} 
                    onModerarClick={handleStartModeration} 
                  />
                ))}
              </div>
            )}

          </section>

        </main>
      </div>

    </div>
  );
}
