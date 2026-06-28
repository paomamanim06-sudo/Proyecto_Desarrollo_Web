import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getApuntes, subirApunte, eliminarApunte, darMeGustaApunte,
  getVoluntarios, agregarVoluntario, eliminarVoluntario 
} from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  MessageSquare, FileText, Users, Search, Plus, ThumbsUp, Download, 
  Trash2, Mail, Clock, CheckCircle2, GraduationCap, X, Calendar, UploadCloud 
} from 'lucide-react';

export default function Comunidad() {
  const { user, globalSearch, reloadKey, triggerReload } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [activeTab, setActiveTab] = useState('apuntes'); // 'apuntes' o 'voluntarios'
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Datos
  const [apuntes, setApuntes] = useState([]);
  const [filteredApuntes, setFilteredApuntes] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [filteredVoluntarios, setFilteredVoluntarios] = useState([]);

  // Estados Formularios
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showVolForm, setShowVolForm] = useState(false);
  const [error, setError] = useState('');

  // Campos Formulario Apuntes
  const [noteTitulo, setNoteTitulo] = useState('');
  const [noteCurso, setNoteCurso] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteFile, setNoteFile] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Campos Formulario Voluntario
  const [volNombre, setVolNombre] = useState(user?.nombre || '');
  const [volCarrera, setVolCarrera] = useState(user?.carrera || '');
  const [volSemestre, setVolSemestre] = useState(user?.semestre || '');
  const [volMaterias, setVolMaterias] = useState('');
  const [volContacto, setVolContacto] = useState(user?.correo || '');
  const [volDispo, setVolDispo] = useState('');

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

  // Cargar datos
  useEffect(() => {
    setApuntes(getApuntes());
    setVoluntarios(getVoluntarios());
  }, [reloadKey]);

  // Filtrado Apuntes
  useEffect(() => {
    let result = [...apuntes];
    const query = (search || globalSearch).toLowerCase().trim();
    if (query) {
      result = result.filter(a => 
        a.titulo.toLowerCase().includes(query) ||
        a.autor.toLowerCase().includes(query) ||
        a.curso.toLowerCase().includes(query) ||
        a.carrera.toLowerCase().includes(query) ||
        a.descripcion.toLowerCase().includes(query)
      );
    }
    setFilteredApuntes(result);
  }, [apuntes, search, globalSearch]);

  // Filtrado Voluntarios
  useEffect(() => {
    let result = [...voluntarios];
    const query = (search || globalSearch).toLowerCase().trim();
    if (query) {
      result = result.filter(v => 
        v.nombre.toLowerCase().includes(query) ||
        v.carrera.toLowerCase().includes(query) ||
        v.materias.some(m => m.toLowerCase().includes(query))
      );
    }
    setFilteredVoluntarios(result);
  }, [voluntarios, search, globalSearch]);

  const handleLikeNote = (id) => {
    darMeGustaApunte(id);
    triggerReload();
  };

  const handleDownloadNote = (note) => {
    // Simular descarga de apunte
    const apuntesLocales = getApuntes();
    const idx = apuntesLocales.findIndex(a => a.id === note.id);
    if (idx !== -1) {
      apuntesLocales[idx].descargas += 1;
      localStorage.setItem('unamad_apuntes', JSON.stringify(apuntesLocales));
    }
    triggerReload();
    setSuccessMessage(`Descargando el apunte "${note.titulo}"...`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!noteTitulo || !noteCurso || !noteDesc) {
      setError('Por favor, completa los campos requeridos para compartir tu apunte.');
      return;
    }

    const payload = {
      titulo: noteTitulo.trim(),
      autor: user ? user.nombre : 'Estudiante Visitante',
      carrera: user ? user.carrera : 'General',
      curso: noteCurso.trim(),
      descripcion: noteDesc.trim(),
      archivo: noteFile || 'apuntes_compartidos.pdf'
    };

    const creado = subirApunte(payload);
    if (creado) {
      setSuccessMessage(`¡Gracias por cooperar! Tu apunte "${noteTitulo}" ha sido publicado.`);
      setNoteTitulo('');
      setNoteCurso('');
      setNoteDesc('');
      setNoteFile('');
      setShowNoteForm(false);
      triggerReload();
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  };

  const handleVolSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!volNombre || !volCarrera || !volSemestre || !volMaterias || !volContacto || !volDispo) {
      setError('Por favor, completa todos los campos del voluntario.');
      return;
    }

    // Dividir las materias ingresadas por comas
    const materiasArr = volMaterias.split(',').map(m => m.trim()).filter(Boolean);
    if (materiasArr.length === 0) {
      setError('Debes ingresar al menos una materia para dictar tutorías.');
      return;
    }

    const payload = {
      nombre: volNombre.trim(),
      carrera: volCarrera,
      semestre: volSemestre,
      materias: materiasArr,
      contacto: volContacto.trim(),
      foto: user?.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      disponibilidad: volDispo.trim()
    };

    const creado = agregarVoluntario(payload);
    if (creado) {
      setSuccessMessage(`¡Felicidades, ${volNombre}! Te has registrado exitosamente como Voluntario Académico.`);
      setVolMaterias('');
      setVolDispo('');
      setShowVolForm(false);
      triggerReload();
      setTimeout(() => {
        setSuccessMessage('');
      }, 6000);
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este apunte académico?")) {
      eliminarApunte(id);
      setSuccessMessage("Publicación de apunte eliminada con éxito.");
      triggerReload();
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handleDeleteVol = (id) => {
    if (window.confirm("¿Seguro que deseas dar de baja a este tutor voluntario?")) {
      eliminarVoluntario(id);
      setSuccessMessage("Voluntario dado de baja con éxito.");
      triggerReload();
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
          
          {/* Cabecera */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center space-x-2">
                <MessageSquare className="w-6.5 h-6.5 text-emerald-600" />
                <span>Comunidad Académica UNAMAD</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Aprende colaborativamente. Comparte apuntes valiosos o solicita asesorías personalizadas con tutores voluntarios.
              </p>
            </div>

            {/* Botones de acción contextuales */}
            <div className="shrink-0 flex gap-2 w-full sm:w-auto">
              {activeTab === 'apuntes' ? (
                <button
                  onClick={() => {
                    if (!user) {
                      alert("Debes iniciar sesión para compartir apuntes en la comunidad.");
                      return;
                    }
                    setShowNoteForm(!showNoteForm);
                    setShowVolForm(false);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showNoteForm ? 'Ver catálogo de apuntes' : 'Subir mis apuntes'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      alert("Debes iniciar sesión para registrarte como tutor voluntario.");
                      return;
                    }
                    setShowVolForm(!showVolForm);
                    setShowNoteForm(false);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showVolForm ? 'Ver lista de tutores' : 'Postular como tutor'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Éxito */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 text-emerald-800 dark:text-emerald-400 text-xs animate-in slide-in-from-top-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Selector de Pestañas (Tabs) */}
          <div className="flex border-b border-gray-200 dark:border-slate-800">
            <button
              onClick={() => {
                setActiveTab('apuntes');
                setSearch('');
                setShowNoteForm(false);
                setShowVolForm(false);
              }}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'apuntes'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Apuntes Compartidos ({apuntes.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('voluntarios');
                setSearch('');
                setShowNoteForm(false);
                setShowVolForm(false);
              }}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'voluntarios'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Voluntarios Académicos ({voluntarios.length})</span>
            </button>
          </div>

          {/* Formulario 1: Compartir Apuntes */}
          {showNoteForm && activeTab === 'apuntes' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-4 shadow-sm max-w-2xl mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-slate-800">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <UploadCloud className="w-5 h-5 text-emerald-600" />
                  <span>Subir Apuntes a la Comunidad</span>
                </h3>
                <button onClick={() => setShowNoteForm(false)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs">{error}</div>
              )}

              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Título del Apunte <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Resumen Capítulo 3 - Base de Datos"
                      value={noteTitulo}
                      onChange={(e) => setNoteTitulo(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Curso Académico <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Base de Datos I"
                      value={noteCurso}
                      onChange={(e) => setNoteCurso(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Descripción <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Escribe brevemente qué contiene este material y cómo ayudará a otros compañeros de la UNAMAD..."
                    value={noteDesc}
                    onChange={(e) => setNoteDesc(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Nombre del archivo PDF (Simulado)</label>
                  <input
                    type="text"
                    placeholder="resumen_bases_de_datos.pdf"
                    value={noteFile}
                    onChange={(e) => setNoteFile(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowNoteForm(false)} className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700">Subir Apunte</button>
                </div>
              </form>
            </div>
          )}

          {/* Formulario 2: Registro de Voluntarios */}
          {showVolForm && activeTab === 'voluntarios' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-4 shadow-sm max-w-2xl mx-auto animate-in fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-slate-800">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <span>Postular como Voluntario Académico</span>
                </h3>
                <button onClick={() => setShowVolForm(false)} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs">{error}</div>
              )}

              <form onSubmit={handleVolSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Nombre */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Nombre Completo</label>
                    <input
                      type="text"
                      disabled
                      value={volNombre}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs focus:outline-none"
                    />
                  </div>
                  {/* Carrera */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Carrera</label>
                    <input
                      type="text"
                      disabled
                      value={volCarrera}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs focus:outline-none"
                    />
                  </div>
                  {/* Semestre */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Semestre</label>
                    <input
                      type="text"
                      disabled
                      value={`Semestre ${volSemestre}`}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Cursos de Dominio (Separados por comas) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cálculo I, Algoritmos, Matemáticas Discretas"
                    value={volMaterias}
                    onChange={(e) => setVolMaterias(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 block pl-1">Ingresa las asignaturas oficiales que dominas y en las que dictarás asesoría.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contacto */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Correo de Contacto <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@unamad.edu.pe"
                      value={volContacto}
                      onChange={(e) => setVolContacto(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  {/* Disponibilidad */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">Horario de Disponibilidad <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Sábados de 9 AM a 12 PM"
                      value={volDispo}
                      onChange={(e) => setVolDispo(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowVolForm(false)} className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700">Registrarme como Voluntario</button>
                </div>
              </form>
            </div>
          )}

          {/* Barra de Búsqueda Común */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center shadow-sm">
            <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'apuntes' ? 'Buscar apuntes por tema, curso o autor...' : 'Buscar tutores por carrera o curso de dominio...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* CONTENEDOR DE CONTENIDOS CONTEXTUAL */}
          {activeTab === 'apuntes' ? (
            
            /* TAB 1: APUNTES COMPARTIDOS */
            <div className="space-y-4">
              {filteredApuntes.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">No hay apuntes disponibles</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">Sube el primer material para tus compañeros de clase y ayúdalos en su aprendizaje.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApuntes.map(note => (
                    <div 
                      key={note.id} 
                      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between space-y-4 h-full"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-md text-[9px] font-bold uppercase tracking-wider block">
                            {note.curso}
                          </span>
                          <span className="text-[10px] text-gray-400">{note.fecha}</span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{note.titulo}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">{note.descripcion}</p>
                        <div className="text-[10px] text-gray-400 pt-1.5 border-t border-gray-50 dark:border-slate-800/40">
                          <span>Subido por: <strong className="text-gray-600 dark:text-gray-300 font-bold">{note.autor}</strong></span>
                          <span className="block text-gray-400 mt-0.5">{note.carrera}</span>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="pt-3 border-t border-gray-50 dark:border-slate-800/50 flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleLikeNote(note.id)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 rounded-lg text-[11px] font-bold text-slate-600 dark:text-gray-300 transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{note.meGusta || 0}</span>
                          </button>
                          <button
                            onClick={() => handleDownloadNote(note)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{note.descargas || 0} descargas</span>
                          </button>
                        </div>

                        {/* Eliminar (Solo Admin o el mismo estudiante si se asocia) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Eliminar publicación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            
            /* TAB 2: VOLUNTARIOS ACADÉMICOS */
            <div className="space-y-4">
              {filteredVoluntarios.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
                  <Users className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white">Directorio vacío</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">No se encuentran tutores voluntarios inscritos bajo la búsqueda elegida.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVoluntarios.map(vol => (
                    <div 
                      key={vol.id} 
                      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between space-y-4 h-full"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={vol.foto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                            alt={vol.nombre}
                            className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{vol.nombre}</h3>
                            <span className="text-[10px] text-gray-400 font-semibold block uppercase">
                              {vol.carrera.split(' ').slice(0, 2).join(' ')} - Semestre {vol.semestre}
                            </span>
                          </div>
                        </div>

                        {/* Cursos dictados */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Cursos de Asesoría:</span>
                          <div className="flex flex-wrap gap-1">
                            {vol.materias.map((mat, i) => (
                              <span key={i} className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-md border border-emerald-100/40 text-[10px] font-semibold">
                                {mat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Disponibilidad */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                            <span>{vol.disponibilidad}</span>
                          </div>
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                            <a href={`mailto:${vol.contacto}`} className="hover:underline text-emerald-600 dark:text-emerald-400 font-medium select-all">{vol.contacto}</a>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="pt-3 border-t border-gray-50 dark:border-slate-800/50 flex justify-between items-center">
                        <a
                          href={`mailto:${vol.contacto}?subject=Solicitud de Ayuda Académica - UNAMAD Conecta`}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors text-center block flex-1 cursor-pointer"
                        >
                          Solicitar ayuda académica
                        </a>

                        {/* Baja Voluntario (Solo Admin) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteVol(vol.id)}
                            className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors border border-transparent hover:border-red-100 shrink-0"
                            title="Dar de baja voluntario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
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
