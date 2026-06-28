import React from 'react';
import { Download, BookOpen, Edit, Trash2, Calendar, HardDriveDownload } from 'lucide-react';
import { registrarDescargaLibro } from '../services/api';

export default function CardLibro({ libro, onEdit, onDelete, isAdmin, onDownloadSuccess }) {
  const { id, titulo, autor, carrera, curso, descripcion, enlace, portada, fechaAdicion, descargas } = libro;

  const handleDownload = () => {
    registrarDescargaLibro(id);
    if (onDownloadSuccess) {
      onDownloadSuccess(id);
    }
    // Abrir el enlace simulado en una pestaña nueva de forma segura
    window.open(enlace, '_blank');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row h-full">
      
      {/* Portada */}
      <div className="sm:w-1/3 shrink-0 relative bg-gray-50 dark:bg-slate-800 flex items-center justify-center min-h-[200px] sm:min-h-0 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-slate-800">
        <img 
          src={portada || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"} 
          alt={titulo} 
          className="w-full h-full object-cover max-h-[240px] sm:max-h-none"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold rounded-md">
          {carrera.split(' ').slice(0, 2).join(' ')}
        </div>
      </div>

      {/* Detalles */}
      <div className="p-5 flex flex-col justify-between flex-1">
        
        <div className="space-y-2">
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">
              {curso}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
              {titulo}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Por <span className="font-semibold">{autor}</span>
            </p>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
            {descripcion}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
            <div className="flex items-center text-gray-400 text-[10px]">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Agregado: {fechaAdicion}</span>
            </div>
            <div className="flex items-center text-gray-400 text-[10px]">
              <HardDriveDownload className="w-3.5 h-3.5 mr-1" />
              <span>{descargas} descargas</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-4 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between gap-2 mt-4">
          
          {/* Botón Descargar (Público/Estudiante) */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1.5 flex-1 justify-center cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </button>

          {/* Botones Admin */}
          {isAdmin && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(libro)}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors"
                title="Editar recurso"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`¿Estás seguro de que deseas eliminar el libro "${titulo}"?`)) {
                    onDelete(id);
                  }
                }}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/10 transition-colors"
                title="Eliminar recurso"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
