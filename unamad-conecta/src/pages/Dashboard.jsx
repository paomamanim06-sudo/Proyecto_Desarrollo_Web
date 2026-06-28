import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReportes, getApuntes, getNotificaciones, marcarNotificacionesLeidas } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FileText, ShieldAlert, CheckCircle, Clock, Upload, Bell, 
  ArrowRight, Award, PlusCircle, Activity, Heart, UserCheck
} from 'lucide-react';

export default function Dashboard() {
  const { user, reloadKey } = useAuth();
  
  const [totalReportes, setTotalReportes] = useState(0);
  const [reportesPendientes, setReportesPendientes] = useState(0);
  const [reportesRevision, setReportesRevision] = useState(0);
  const [reportesResueltos, setReportesResueltos] = useState(0);
  const [recursosCompartidos, setRecursosCompartidos] = useState(0);
  
  const [recentReports, setRecentReports] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (user) {
      // 1. Cargar reportes del estudiante
      const todosLosReportes = getReportes();
      const reportesEstudiante = todosLosReportes.filter(r => r.estudianteId === user.id);
      
      setTotalReportes(reportesEstudiante.length);
      setReportesPendientes(reportesEstudiante.filter(r => r.estado === 'Pendiente').length);
      setReportesRevision(reportesEstudiante.filter(r => r.estado === 'En revisión').length);
      setReportesResueltos(reportesEstudiante.filter(r => r.estado === 'Resuelto').length);
      
      // Tomar los 3 reportes más recientes del estudiante
      setRecentReports(reportesEstudiante.slice(0, 3));

      // 2. Cargar recursos compartidos por este estudiante (apuntes)
      const todosLosApuntes = getApuntes();
      const apuntesEstudiante = todosLosApuntes.filter(a => a.autor === user.nombre);
      setRecursosCompartidos(apuntesEstudiante.length);

      // 3. Notificaciones recientes
      const listNotif = getNotificaciones(user.id);
      setNotificaciones(listNotif.slice(0, 4));

      // 4. Armar lista de Actividad Reciente combinada
      const actividad = [];
      reportesEstudiante.forEach(r => {
        actividad.push({
          id: r.id,
          tipo: 'reporte',
          titulo: `Reporte ${r.codigo} enviado`,
          desc: `Categoría: ${r.categoria} - Estado: ${r.estado}`,
          fecha: r.fecha,
          iconColor: r.estado === 'Resuelto' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
        });
      });

      apuntesEstudiante.forEach(a => {
        actividad.push({
          id: a.id,
          tipo: 'apunte',
          titulo: `Apunte compartido: ${a.titulo}`,
          desc: `Curso: ${a.curso}`,
          fecha: a.fecha,
          iconColor: 'bg-blue-100 text-blue-600'
        });
      });

      // Ordenar por fecha desc
      actividad.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setRecentActivity(actividad.slice(0, 4));
    }
  }, [user, reloadKey]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Frame Layout */}
      <div className="flex-1 flex">
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dashboard Workspace */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
          
          {/* Tarjeta de Bienvenida */}
          <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left relative z-10">
              <img
                src={user?.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"}
                alt={user?.nombre}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
                    ¡Hola, {user?.nombre.split(' ')[0]}!
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                    Estudiante Activo
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {user?.carrera}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 pt-1">
                  <span>Código: <strong className="text-gray-600 dark:text-gray-300 font-bold">{user?.codigo}</strong></span>
                  <span>Semestre: <strong className="text-gray-600 dark:text-gray-300 font-bold">{user?.semestre}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 shrink-0 w-full md:w-auto relative z-10">
              <Link
                to="/reportes"
                className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Crear reporte</span>
              </Link>
              <Link
                to="/comunidad"
                className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-semibold text-xs rounded-xl border border-gray-100 dark:border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Compartir apuntes</span>
              </Link>
            </div>
          </section>

          {/* Fila de Métricas / KPIs */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Reportes */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Reportes Enviados</span>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <ShieldAlert className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white block leading-none">{totalReportes}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Registrados en total</span>
              </div>
            </div>

            {/* Pendientes/En revisión */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">En Trámite</span>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Clock className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white block leading-none">{reportesPendientes + reportesRevision}</span>
                <span className="text-[10px] text-gray-400 block mt-1">{reportesPendientes} pendientes / {reportesRevision} revisión</span>
              </div>
            </div>

            {/* Resueltos */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Casos Resueltos</span>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white block leading-none">{reportesResueltos}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  {totalReportes > 0 ? `${Math.round((reportesResueltos / totalReportes) * 100)}% de efectividad` : 'Sin reportes aún'}
                </span>
              </div>
            </div>

            {/* Recursos Compartidos */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4.5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Aportes a Comunidad</span>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Upload className="w-4.5 h-4.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white block leading-none">{recursosCompartidos}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Apuntes y PDFs compartidos</span>
              </div>
            </div>

          </section>

          {/* Dos Columnas: Recientes vs Notificaciones */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Seguimiento de Reportes Recientes (Izquierda - 7 cols) */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 lg:col-span-7 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span>Seguimiento de mis Reportes</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">Revisa el estado de procesamiento de tus últimas alertas.</p>
                </div>
                <Link to="/reportes" className="text-xs font-bold text-emerald-600 hover:underline">Ver todos</Link>
              </div>

              <div className="space-y-3">
                {recentReports.length === 0 ? (
                  <div className="text-center py-10 space-y-2 border border-dashed border-gray-100 dark:border-slate-800 rounded-2xl">
                    <p className="text-xs text-gray-400">No has enviado ningún reporte oficial.</p>
                    <Link to="/reportes" className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100">Crear mi primer reporte</Link>
                  </div>
                ) : (
                  recentReports.map(rep => (
                    <div key={rep.id} className="p-3.5 border border-gray-50 dark:border-slate-800/80 rounded-xl hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors flex items-center justify-between gap-4">
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{rep.codigo}</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{rep.categoria}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px] mt-0.5">{rep.descripcion}</p>
                        <span className="text-[10px] text-gray-400 block mt-1">{rep.fecha}</span>
                      </div>
                      
                      {/* Estado Badge */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.estado === 'Resuelto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        rep.estado === 'En revisión' ? 'bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400' :
                        rep.estado === 'Rechazado' ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-400' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-950/40 dark:text-yellow-400'
                      }`}>
                        {rep.estado}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Historial de Actividad & Notificaciones (Derecha - 5 cols) */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 lg:col-span-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <span>Notificaciones de Trámite</span>
                </h3>
                <p className="text-[11px] text-gray-400">Actualizaciones de tus reportes en tiempo real.</p>
              </div>

              <div className="space-y-3.5">
                {notificaciones.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-10">No tienes alertas de estado recientes.</p>
                ) : (
                  notificaciones.map(not => (
                    <div key={not.id} className={`p-3 rounded-xl border border-gray-50 dark:border-slate-800/50 flex items-start space-x-2.5 ${
                      !not.leida ? 'bg-emerald-50/20 border-emerald-100 dark:bg-emerald-950/10' : ''
                    }`}>
                      <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg mt-0.5 shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-normal">{not.mensaje}</p>
                        <span className="text-[9px] text-gray-400 block mt-1">{not.fecha}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </section>

          {/* Línea de tiempo de Actividad General */}
          <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Mi Historial de Actividad</span>
              </h3>
              <p className="text-[11px] text-gray-400">Tus últimas interacciones dentro de UNAMAD Conecta.</p>
            </div>

            <div className="relative border-l-2 border-gray-100 dark:border-slate-800 ml-3.5 space-y-5 py-2">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-gray-400 pl-4 py-4">No se registra actividad reciente.</p>
              ) : (
                recentActivity.map(act => (
                  <div key={act.id} className="relative pl-6">
                    {/* Icono Conector */}
                    <div className={`absolute -left-3.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 text-xs shadow-sm ${act.iconColor}`}>
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{act.titulo}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{act.desc}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">{act.fecha}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}
