import React from 'react';
import { Calendar, Trash2, Edit, Megaphone, Info, Clock, User } from 'lucide-react';

export default function CardAnuncio({ anuncio, onEdit, onDelete, isAdmin }) {
  const { id, titulo, contenido, tipo, fechaPublicacion, fechaEvento, imagen, autor } = anuncio;

  // Estilos según el tipo de anuncio
  const getTipoStyle = (t) => {
    switch (t) {
      case 'Evento':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/40';
      case 'Comunicado':
        return 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-400 border-red-100 dark:border-red-900/40';
      case 'Noticia':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900/40';
      default:
        return 'bg-gray-50 text-gray-800 dark:bg-slate-850 dark:text-gray-400 border-gray-100 dark:border-slate-800';
    }
  };

  const getTipoIcon = (t) => {
    switch (t) {
      case 'Evento': return <Calendar className="w-3.5 h-3.5 mr-1" />;
      case 'Comunicado': return <Megaphone className="w-3.5 h-3.5 mr-1" />;
      case 'Noticia': return <Info className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
      
      {/* Imagen */}
      {imagen && (
        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 shrink-0">
          <img src={imagen} alt={titulo} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 flex space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-sm ${getTipoStyle(tipo)}`}>
              {getTipoIcon(tipo)}
              {tipo}
            </span>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
        
        <div className="space-y-2">
          {!imagen && (
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTipoStyle(tipo)}`}>
                {getTipoIcon(tipo)}
                {tipo}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{fechaPublicacion}</span>
            </div>
          )}
          
          {imagen && (
            <span className="text-xs text-gray-400 dark:text-gray-500 block">{fechaPublicacion}</span>
          )}

          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
            {titulo}
          </h3>

          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line line-clamp-4">
            {contenido}
          </p>
        </div>

        {/* Footer del Anuncio */}
        <div className="pt-4 border-t border-gray-50 dark:border-slate-800/50 space-y-3">
          
          {/* Detalles del Evento */}
          {tipo === 'Evento' && fechaEvento && (
            <div className="flex items-center text-xs text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/10 p-2.5 rounded-xl border border-amber-100/40 dark:border-amber-900/20">
              <Clock className="w-4 h-4 mr-2 shrink-0 text-amber-500" />
              <span>Fecha del evento: <span className="font-semibold">{fechaEvento}</span></span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
              <User className="w-3.5 h-3.5 mr-1" />
              <span>Por: {autor}</span>
            </div>

            {/* Acciones del Admin */}
            {isAdmin && (
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => onEdit(anuncio)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors"
                  title="Editar anuncio"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar el anuncio "${titulo}"?`)) {
                      onDelete(id);
                    }
                  }}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/10 transition-colors"
                  title="Eliminar anuncio"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
