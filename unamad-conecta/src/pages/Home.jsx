import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import CardAnuncio from '../components/CardAnuncio';
import CardLibro from '../components/CardLibro';
import { 
  getAnuncios, getLibros, getVoluntarios 
} from '../services/api';
import { 
  BookOpen, Users, Bell, ArrowRight, ShieldCheck, HeartHandshake, HelpCircle, GraduationCap 
} from 'lucide-react';

export default function Home() {
  const { user, globalSearch, setGlobalSearch, reloadKey } = useAuth();
  const navigate = useNavigate();
  const exploreSectionRef = useRef(null);

  const [recentAnuncios, setRecentAnuncios] = useState([]);
  const [featuredLibros, setFeaturedLibros] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  // Cargar datos públicos iniciales
  useEffect(() => {
    setRecentAnuncios(getAnuncios().slice(0, 3));
    setFeaturedLibros(getLibros().slice(0, 2));
    setVoluntarios(getVoluntarios().slice(0, 3));
  }, [reloadKey]);

  const scrollToExplore = () => {
    exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Hero Banner */}
      <Hero onExploreClick={scrollToExplore} />

      {/* Secciones Públicas */}
      <div ref={exploreSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Sección de Introducción de la plataforma */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Módulo de Reportes Seguro</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Reporta problemas académicos, de infraestructura o acoso con total discreción. Soporta reportes públicos, privados o 100% anónimos.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Biblioteca Digital Académica</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Accede a libros recomendados, PDFs y recursos compartidos de tus cursos y carreras profesionales de la UNAMAD de forma libre.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Comunidad y Voluntariado</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Encuentra apoyo estudiantil de compañeros de semestres superiores, solicita tutorías o comparte tus apuntes y resúmenes personales.
            </p>
          </div>
        </section>

        {/* Sección de Anuncios Universitarios Recientes */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
                <Bell className="w-6 h-6 text-emerald-600" />
                <span>Anuncios y Noticias Oficiales</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Entérate de los últimos comunicados, eventos y novedades de las Oficinas de la UNAMAD.
              </p>
            </div>
            <Link 
              to="/anuncios" 
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAnuncios.map(anuncio => (
              <CardAnuncio 
                key={anuncio.id} 
                anuncio={anuncio} 
                isAdmin={false} 
              />
            ))}
          </div>
        </section>

        {/* Banner Motivacional de Reportes */}
        <section className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-600/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute right-0 bottom-0 opacity-10">
            <GraduationCap className="w-96 h-96 -mr-16 -mb-16 text-white" />
          </div>
          <div className="space-y-2 relative z-10 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold">¿Tienes algún problema académico, de infraestructura o acoso?</h2>
            <p className="text-sm text-emerald-50 max-w-xl">
              Como estudiante de UNAMAD tienes derecho a un espacio seguro. Puedes enviar un reporte oficial de forma rápida y realizar el seguimiento en tiempo real.
            </p>
          </div>
          <div className="shrink-0 relative z-10 w-full md:w-auto">
            <Link
              to="/reportes"
              className="w-full md:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-emerald-700 font-bold text-sm rounded-xl transition-colors block text-center shadow-md"
            >
              Crear Reporte Oficial
            </Link>
          </div>
        </section>

        {/* Sección Biblioteca Digital */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <span>Biblioteca Digital Destacada</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Descarga recursos y libros recomendados para los primeros ciclos de las carreras.
              </p>
            </div>
            <Link 
              to="/biblioteca" 
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>Ir a la Biblioteca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredLibros.map(libro => (
              <CardLibro 
                key={libro.id} 
                libro={libro} 
                isAdmin={false} 
              />
            ))}
          </div>
        </section>

        {/* Voluntarios Destacados */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
                <Users className="w-6 h-6 text-emerald-600" />
                <span>Nuestros Voluntarios Académicos</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Compañeros de ciclos avanzados dispuestos a ayudarte a resolver dudas de cursos difíciles.
              </p>
            </div>
            <Link 
              to="/comunidad" 
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>Ver todos los voluntarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {voluntarios.map(vol => (
              <div 
                key={vol.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 text-center flex flex-col items-center space-y-4"
              >
                <img
                  src={vol.foto}
                  alt={vol.nombre}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{vol.nombre}</h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block uppercase tracking-wider mt-0.5">
                    {vol.carrera.split(' ').slice(0, 2).join(' ')} - Semestre {vol.semestre}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  {vol.materias.slice(0, 2).map((mat, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md text-[9px] font-semibold text-gray-500 dark:text-gray-400">
                      {mat}
                    </span>
                  ))}
                  {vol.materias.length > 2 && (
                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md text-[9px] font-semibold text-gray-400">
                      +{vol.materias.length - 2} más
                    </span>
                  )}
                </div>

                <div className="w-full pt-4 border-t border-gray-50 dark:border-slate-800 flex justify-center">
                  <Link
                    to="/comunidad"
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Contactar Tutor
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de FAQ Básica de la UNAMAD */}
        <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <HelpCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Preguntas Frecuentes</h2>
            <p className="text-xs text-gray-500">¿Tienes dudas sobre cómo funciona la plataforma UNAMAD Conecta? Aquí respondemos las principales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white">¿Quiénes pueden usar UNAMAD Conecta?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Cualquier estudiante registrado con su correo institucional `@unamad.edu.pe`. Sin embargo, la sección de biblioteca y anuncios es de acceso libre para toda la comunidad y postulantes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white">¿Mis reportes anónimos son verdaderamente seguros?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Sí. Al seleccionar la visibilidad "Anónimo", tus datos de perfil (nombre, código) son completamente ocultados en la interfaz de estudiantes y administradores, asegurando tu protección en casos de acoso o bullying.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white">¿Cómo me convierto en voluntario académico?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Si vas en el V ciclo o superior, con un promedio ponderado sobresaliente y tienes vocación de apoyo, puedes registrarte como voluntario directamente desde la pestaña de Comunidad.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white">¿Quién revisa los reportes de infraestructura?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Los reportes son gestionados directamente por la Oficina de Infraestructura y Mantenimiento, o la Oficina de Bienestar Universitario, según corresponda a la categoría asignada.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
