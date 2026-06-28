import React from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Eye, EyeOff, ShieldAlert, 
  MessageSquareCode, FileText, Image, UserCheck, MessageSquarePlus
} from 'lucide-react';

export default function CardReporte({ reporte, onManage, isAdmin }) {
  const { 
    id, codigo, categoria, visibilidad, descripcion, imagen, 
    fecha, estado, observaciones, estudianteNombre, estudianteCarrera 
  } = reporte;

  // Iconos por categoría
  const getCategoriaIcon = (cat) => {
    switch (cat) {
      case 'Infraestructura': return <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Académico': return <MessageSquareCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Bullying': return <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'Acoso': return <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Servicios': return <AlertTriangle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Administrativo': return <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  // Colores del estado
  const getStatusBadge = (est) => {
    switch (est) {
      case 'Pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/50">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pendiente
          </span>
        );
      case 'En revisión':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />
            En revisión
          </span>
        );
      case 'Resuelto':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Resuelto
          </span>
        );
      case 'Rechazado':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  // Badge de visibilidad
  const getVisibilidadBadge = (vis) => {
    if (vis === 'Público') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-50 text-gray-600 dark:bg-slate-800 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
          <Eye className="w-3 h-3 mr-1" />
          Público
        </span>
      );
    } else if (vis === 'Privado') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
          <EyeOff className="w-3 h-3 mr-1" />
          Privado
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">
          <EyeOff className="w-3 h-3 mr-1" />
          Anónimo
        </span>
      );
    }
  };

  // Nombre de quien reporta
  const renderAutor = () => {
    if (visibilidad === 'Anónimo' && !isAdmin) {
      return 'Anónimo';
    }
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {visibilidad === 'Anónimo' ? `${estudianteNombre} (Reportado Anónimamente)` : estudianteNombre}
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
          {estudianteCarrera}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200">
      
      {/* Cabecera del Reporte */}
      <div className="p-5 border-b border-gray-50 dark:border-slate-800/50 flex justify-between items-start gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gray-50 dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-800">
            {getCategoriaIcon(categoria)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{codigo}</span>
              {getVisibilidadBadge(visibilidad)}
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{categoria}</h3>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          {getStatusBadge(estado)}
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{fecha}</span>
        </div>
      </div>

      {/* Contenido / Cuerpo */}
      <div className="p-5 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {descripcion}
        </p>

        {/* Imagen del reporte */}
        {imagen && (
          <div className="relative rounded-xl overflow-hidden max-h-48 border border-gray-100 dark:border-slate-800">
            <img src={imagen} alt="Evidencia de reporte" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold rounded-md flex items-center space-x-1">
              <Image className="w-3 h-3" />
              <span>Evidencia adjunta</span>
            </div>
          </div>
        )}

        {/* Datos del estudiante (para administradores o reportes públicos/privados no anónimos) */}
        <div className="flex items-center space-x-2.5 pt-3 border-t border-gray-50 dark:border-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-gray-200 dark:border-slate-700">
            <UserCheck className="w-4 h-4" />
          </div>
          {renderAutor()}
        </div>

        {/* Observación de Admin */}
        {observaciones && (
          <div className="mt-4 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100/60 dark:border-emerald-900/30 rounded-xl">
            <div className="flex items-center space-x-1.5 mb-1 text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wide">
              <MessageSquarePlus className="w-4 h-4" />
              <span>Respuesta de la Administración</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              {observaciones}
            </p>
          </div>
        )}

        {/* Acciones del Administrador */}
        {isAdmin && onManage && (
          <div className="pt-3 border-t border-gray-50 dark:border-slate-800/50 flex justify-end">
            <button
              onClick={() => onManage(reporte)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Administrar reporte</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
