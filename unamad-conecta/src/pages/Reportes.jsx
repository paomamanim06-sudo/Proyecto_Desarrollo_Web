import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReportes, crearReporte } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CardReporte from '../components/CardReporte';
import FormularioReporte from '../components/FormularioReporte';
import { 
  AlertTriangle, Search, Filter, Plus, ListFilter, ShieldAlert, 
  CheckCircle2, Loader2, X 
} from 'lucide-react';

export default function Reportes() {
  const { user, globalSearch, reloadKey, triggerReload } = useAuth();
  
  const [reportes, setReportes] = useState([]);
  const [filteredReportes, setFilteredReportes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [selectedEstado, setSelectedEstado] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Categorías y Estados para filtrar
  const categorias = ['Todas', 'Infraestructura', 'Académico', 'Bullying', 'Acoso', 'Servicios', 'Administrativo'];
  const estados = ['Todos', 'Pendiente', 'En revisión', 'Resuelto', 'Rechazado'];

  // Cargar reportes del estudiante
  useEffect(() => {
    if (user) {
      const todosLosReportes = getReportes();
      
      // Filtrar por estudiante actual
      const reportesEstudiante = todosLosReportes.filter(r => r.estudianteId === user.id);
      setReportes(reportesEstudiante);
    }
  }, [user, reloadKey]);

  // Aplicar filtros y búsquedas (incluye el Buscador Global de la barra de navegación)
  useEffect(() => {
    let result = [...reportes];

    // 1. Filtrar por buscador local o global
    const query = (search || globalSearch).toLowerCase().trim();
    if (query) {
      result = result.filter(r => 
        r.codigo.toLowerCase().includes(query) ||
        r.categoria.toLowerCase().includes(query) ||
        r.descripcion.toLowerCase().includes(query)
      );
    }

    // 2. Filtrar por Categoría
    if (selectedCategoria !== 'Todas') {
      result = result.filter(r => r.categoria === selectedCategoria);
    }

    // 3. Filtrar por Estado
    if (selectedEstado !== 'Todos') {
      result = result.filter(r => r.estado === selectedEstado);
    }

    setFilteredReportes(result);
  }, [reportes, search, globalSearch, selectedCategoria, selectedEstado]);

  // Manejador al enviar reporte exitoso
  const handleReportSubmit = (reportePayload) => {
    if (!user) return;

    const nuevoReporte = {
      estudianteId: user.id,
      estudianteNombre: user.nombre,
      estudianteCarrera: user.carrera,
      ...reportePayload
    };

    const creado = crearReporte(nuevoReporte);
    if (creado) {
      setSuccessMessage(`¡Reporte oficial enviado con éxito! Código generado: ${creado.codigo}. El área correspondiente ha sido notificada.`);
      triggerReload();
      setShowForm(false);
      
      // Auto ocultar mensaje de éxito en 6 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 6000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
          
          {/* Cabecera y botón de crear */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
                <AlertTriangle className="w-6.5 h-6.5 text-emerald-600" />
                <span>Mis Reportes Estudiantiles</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Visualiza, realiza seguimiento de tus alertas o envía un nuevo reporte seguro para soporte universitario.
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setSuccessMessage('');
              }}
              className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showForm ? 'Ver mis reportes' : 'Enviar nuevo reporte'}</span>
            </button>
          </div>

          {/* Éxito al guardar */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 text-emerald-800 dark:text-emerald-400 text-xs animate-in slide-in-from-top-4 duration-300">
              <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <p className="font-bold">¡Trámite de Reporte Iniciado!</p>
                <p className="leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Formulario de Registro de Reporte */}
          {showForm ? (
            <div className="max-w-3xl mx-auto">
              <FormularioReporte onSubmitSuccess={handleReportSubmit} />
            </div>
          ) : (
            /* Listado y Filtros */
            <div className="space-y-5">
              
              {/* Barra de Búsqueda y Filtros */}
              <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Input Buscador */}
                <div className="relative w-full md:max-w-xs shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por código o palabra..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filtros Dropdowns */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
                  
                  {/* Categoría */}
                  <div className="flex items-center space-x-1 w-full sm:w-auto">
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
                  <div className="flex items-center space-x-1 w-full sm:w-auto">
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

              {/* Grid de Reportes */}
              {filteredReportes.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">No se encontraron reportes</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                      No hay registros que coincidan con los filtros seleccionados o no has enviado alertas de este tipo aún.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredReportes.map(rep => (
                    <CardReporte 
                      key={rep.id} 
                      reporte={rep} 
                      isAdmin={false} 
                    />
                  ))}
                </div>
              )}

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
