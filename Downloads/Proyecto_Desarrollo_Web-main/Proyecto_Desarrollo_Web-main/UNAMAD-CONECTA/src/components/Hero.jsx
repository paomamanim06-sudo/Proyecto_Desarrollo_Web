import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Play, ChevronRight, GraduationCap, ArrowDown } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  const { user } = useAuth();

  return (
    <div id="hero" className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center bg-slate-900">
      
      {/* Video de fondo institucional de la UNAMAD */}
      {/* Usaremos un loop de video de dron universitario o campus académico de alta definición */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-55"
        poster="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=900&fit=crop"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-dolly-shot-of-empty-school-corridor-41617-large.mp4" 
          type="video/mp4" 
        />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Capa de degradado elegante para contraste */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/90"></div>

      {/* Contenido del Hero */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center text-white space-y-6">
        
        {/* Emblema pequeño animado */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider animate-pulse">
          <GraduationCap className="w-4.5 h-4.5" />
          <span>Universidad Nacional Amazónica de Madre de Dios</span>
        </div>

        {/* Título Principal */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">UNAMAD Conecta</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-200 font-medium max-w-3xl mx-auto leading-relaxed">
            Una plataforma moderna y unificada creada para mejorar la comunicación, el apoyo académico y la gestión estudiantil en la región Madre de Dios.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          {user ? (
            <Link
              to={user.rol === 'admin' ? '/admin' : '/dashboard'}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>Acceder a mi Portal</span>
              <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>Iniciar sesión</span>
                <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/registro"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700/90 text-white font-bold text-sm rounded-xl shadow-md border border-slate-700/60 backdrop-blur-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Registrarse</span>
              </Link>
            </>
          )}

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl border border-white/10 backdrop-blur-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Explorar plataforma</span>
          </button>
        </div>

      </div>

      {/* Flecha inferior indicando continuación */}
      <div className="absolute bottom-6 z-20 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 text-xs font-semibold uppercase tracking-wider animate-bounce">
        <span className="mb-1 text-[10px]">Ver servicios públicos</span>
        <ArrowDown className="w-4 h-4 text-emerald-400" />
      </div>

    </div>
  );
}
