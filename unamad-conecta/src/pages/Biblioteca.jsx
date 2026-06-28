import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLibros, agregarLibro, editarLibro, eliminarLibro } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CardLibro from '../components/CardLibro';
import { 
  BookOpen, Search, Plus, X, UploadCloud, Library, 
  Trash2, Edit, Save, BookOpenCheck, HelpCircle, CheckCircle2 
} from 'lucide-react';

export default function Biblioteca() {
  const { user, globalSearch, reloadKey, triggerReload } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [libros, setLibros] = useState([]);
  const [filteredLibros, setFilteredLibros] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState('Todas');
  const [successMessage, setSuccessMessage] = useState('');

  // Formularios de agregar/editar
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Campos del libro
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [carrera, setCarrera] = useState('');
  const [curso, setCurso] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enlace, setEnlace] = useState('');
  const [portada, setPortada] = useState('');
  const [error, setError] = useState('');

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

  // Cargar biblioteca
  useEffect(() => {
    setLibros(getLibros());
  }, [reloadKey]);

  // Filtrado de biblioteca
  useEffect(() => {
    let result = [...libros];

    // Buscar por buscador local o global
    const query = (search || globalSearch).toLowerCase().trim();
    if (query) {
      result = result.filter(l => 
        l.titulo.toLowerCase().includes(query) ||
        l.autor.toLowerCase().includes(query) ||
        l.curso.toLowerCase().includes(query) ||
        l.descripcion.toLowerCase().includes(query)
      );
    }

    // Filtrar por carrera
    if (selectedCarrera !== 'Todas') {
      result = result.filter(l => l.carrera === selectedCarrera);
    }

    setFilteredLibros(result);
  }, [libros, search, globalSearch, selectedCarrera]);

  const resetForm = () => {
    setTitulo('');
    setAutor('');
    setCarrera('');
    setCurso('');
    setDescripcion('');
    setEnlace('');
    setPortada('');
    setError('');
    setIsEditing(false);
    setEditId(null);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEditForm = (libro) => {
    setTitulo(libro.titulo);
    setAutor(libro.autor);
    setCarrera(libro.carrera);
    setCurso(libro.curso);
    setDescripcion(libro.descripcion);
    setEnlace(libro.enlace);
    setPortada(libro.portada);
    setError('');
    setIsEditing(true);
    setEditId(libro.id);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!titulo || !autor || !carrera || !curso || !descripcion || !enlace) {
      setError('Por favor, completa todos los campos obligatorios del libro.');
      return;
    }

    const defaultPortada = portada || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop";

    const payload = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      carrera,
      curso: curso.trim(),
      descripcion: descripcion.trim(),
      enlace: enlace.trim(),
      portada: defaultPortada
    };

    if (isEditing) {
      const editado = editarLibro(editId, payload);
      if (editado) {
        setSuccessMessage(`El libro digital "${titulo}" ha sido modificado exitosamente.`);
      }
    } else {
      const agregado = agregarLibro(payload);
      if (agregado) {
        setSuccessMessage(`El recurso digital "${titulo}" fue añadido exitosamente al catálogo.`);
      }
    }

    triggerReload();
    setShowForm(false);
    resetForm();

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleDeleteBook = (id) => {
    eliminarLibro(id);
    setSuccessMessage("El libro ha sido eliminado del catálogo.");
    triggerReload();
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handleDownloadSuccess = (id) => {
    triggerReload(); // Refrescar contador de descargas
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
                <Library className="w-6.5 h-6.5 text-emerald-600" />
                <span>Biblioteca Digital UNAMAD</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Accede a textos guía, diapositivas y manuales autorizados de las escuelas profesionales de UNAMAD.
              </p>
            </div>
            
            {/* Botón Añadir Libro (Solo Admin) */}
            {isAdmin && (
              <button
                onClick={handleOpenAddForm}
                className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar nuevo libro</span>
              </button>
            )}
          </div>

          {/* Éxito */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 text-emerald-800 dark:text-emerald-400 text-xs animate-in slide-in-from-top-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Formulario de Agregar / Editar Libro */}
          {showForm && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-5 shadow-sm max-w-3xl mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-slate-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <BookOpenCheck className="w-5 h-5 text-emerald-600" />
                  <span>{isEditing ? 'Modificar Recurso Digital' : 'Añadir Libro al Catálogo'}</span>
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 rounded-xl text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Título */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Título del Libro <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Introducción a la Anatomía Veterinaria"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  {/* Autor */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Autor o Compilador <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. James Cunningham"
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Carrera */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Carrera Asociada <span className="text-red-500">*</span></label>
                    <select
                      value={carrera}
                      required
                      onChange={(e) => setCarrera(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="">Selecciona la carrera</option>
                      {carreras.map(car => (
                        <option key={car} value={car}>{car}</option>
                      ))}
                    </select>
                  </div>
                  {/* Curso */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Curso Académico <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Anatomía Animal I"
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Enlace */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Enlace de Descarga PDF <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      required
                      placeholder="https://ejemplo.com/recursos/libro.pdf"
                      value={enlace}
                      onChange={(e) => setEnlace(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  {/* Portada */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Enlace Portada de Libro (Opcional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... (link de imagen)"
                      value={portada}
                      onChange={(e) => setPortada(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Resumen / Descripción <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Escribe una pequeña sinopsis del libro, los temas principales que cubre o el público al que va dirigido..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    {isEditing ? 'Guardar Cambios' : 'Registrar Libro'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Listado de Biblioteca y Barra de Búsqueda */}
          <div className="space-y-5">
            
            {/* Caja de Búsqueda y Filtro por Carrera */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              
              {/* Buscador Local */}
              <div className="relative w-full md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar títulos, autores, cursos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtro Carrera */}
              <div className="flex items-center space-x-1.5 w-full md:w-auto">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Carrera Profesional:</span>
                <select
                  value={selectedCarrera}
                  onChange={(e) => setSelectedCarrera(e.target.value)}
                  className="block w-full md:w-auto py-1.5 px-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Todas">Todas las carreras</option>
                  {carreras.map(car => (
                    <option key={car} value={car}>{car}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Catálogo en Rejilla */}
            {filteredLibros.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Library className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Catálogo vacío</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    No se encontraron recursos que coincidan con la búsqueda "{search || globalSearch}" o los filtros elegidos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredLibros.map(libro => (
                  <CardLibro
                    key={libro.id}
                    libro={libro}
                    isAdmin={isAdmin}
                    onEdit={handleOpenEditForm}
                    onDelete={handleDeleteBook}
                    onDownloadSuccess={handleDownloadSuccess}
                  />
                ))}
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}
