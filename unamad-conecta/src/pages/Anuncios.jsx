import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnuncios, agregarAnuncio, editarAnuncio, eliminarAnuncio } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CardAnuncio from '../components/CardAnuncio';
import { 
  Bell, Search, Plus, X, Tag, FileText, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function Anuncios() {
  const { user, globalSearch, reloadKey, triggerReload } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [anuncios, setAnuncios] = useState([]);
  const [filteredAnuncios, setFilteredAnuncios] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados de formularios
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Campos formulario anuncio
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState('');
  const [area, setArea] = useState('');
  const [prioridad, setPrioridad] = useState('Normal');
  const [error, setError] = useState('');

  const categorias = ['Todos', 'General', 'Académico', 'Beca', 'Evento', 'Trámite'];

  // Cargar anuncios
  useEffect(() => {
    setAnuncios(getAnuncios());
  }, [reloadKey]);

  // Filtrado de anuncios
  useEffect(() => {
    let result = [...anuncios];

    // Buscar por buscador local o global
    const query = (search || globalSearch).toLowerCase().trim();
    if (query) {
      result = result.filter(a => 
        a.titulo.toLowerCase().includes(query) ||
        a.contenido.toLowerCase().includes(query) ||
        a.area.toLowerCase().includes(query)
      );
    }

    // Filtrar por categoría
    if (selectedCategoria !== 'Todos') {
      result = result.filter(a => a.categoria === selectedCategoria);
    }

    setFilteredAnuncios(result);
  }, [anuncios, search, globalSearch, selectedCategoria]);

  const resetForm = () => {
    setTitulo('');
    setCategoria('General');
    setContenido('');
    setImagen('');
    setArea('');
    setPrioridad('Normal');
    setError('');
    setIsEditing(false);
    setEditId(null);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEditForm = (anuncio) => {
    setTitulo(anuncio.titulo);
    setCategoria(anuncio.categoria);
    setContenido(anuncio.contenido);
    setImagen(anuncio.imagen || '');
    setArea(anuncio.area);
    setPrioridad(anuncio.prioridad || 'Normal');
    setError('');
    setIsEditing(true);
    setEditId(anuncio.id);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!titulo || !categoria || !contenido || !area) {
      setError('Por favor, completa todos los campos obligatorios del anuncio.');
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      categoria,
      contenido: contenido.trim(),
      imagen: imagen.trim() || null,
      area: area.trim(),
      prioridad
    };

    if (isEditing) {
      const editado = editarAnuncio(editId, payload);
      if (editado) {
        setSuccessMessage(`El anuncio oficial "${titulo}" ha sido modificado de forma exitosa.`);
      }
    } else {
      const agregado = agregarAnuncio(payload);
      if (agregado) {
        setSuccessMessage(`El comunicado oficial "${titulo}" fue redactado y emitido con éxito.`);
      }
    }

    triggerReload();
    setShowForm(false);
    resetForm();

    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleDeleteAnuncio = (id) => {
    eliminarAnuncio(id);
    setSuccessMessage("El anuncio oficial ha sido retirado del portal de noticias.");
    triggerReload();
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
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
                <Bell className="w-6.5 h-6.5 text-emerald-600" />
                <span>Portal de Anuncios y Noticias</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mantente al día con los comunicados oficiales de Rectorado, Bienestar, Admisión y Coordinación Académica.
              </p>
            </div>

            {/* Redactar Anuncio (Solo Admin) */}
            {isAdmin && (
              <button
                onClick={handleOpenAddForm}
                className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Emitir comunicado oficial</span>
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

          {/* Formulario de Emisión / Edición Anuncio */}
          {showForm && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-5 shadow-sm max-w-3xl mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-slate-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>{isEditing ? 'Editar Comunicado Oficial' : 'Redactar Nuevo Comunicado UNAMAD'}</span>
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
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Título del Comunicado <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Convocatoria Beca Alimentaria 2026-I"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  {/* Área Emisora */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Oficina Emisora <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Oficina de Bienestar Universitario"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Categoría */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Categoría <span className="text-red-500">*</span></label>
                    <select
                      value={categoria}
                      required
                      onChange={(e) => setCategoria(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="General">General</option>
                      <option value="Académico">Académico</option>
                      <option value="Beca">Beca</option>
                      <option value="Evento">Evento</option>
                      <option value="Trámite">Trámite</option>
                    </select>
                  </div>

                  {/* Prioridad */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Prioridad</label>
                    <select
                      value={prioridad}
                      onChange={(e) => setPrioridad(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Alta">Urgente / Alta</option>
                    </select>
                  </div>

                  {/* Foto/Banner (Opcional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Imagen del Comunicado (Link)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... (Opcional)"
                      value={imagen}
                      onChange={(e) => setImagen(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contenido */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block">Cuerpo del Comunicado <span className="text-red-500">*</span></label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Escribe la noticia, fechas límite, requisitos o detalles del comunicado en un lenguaje claro para los alumnos..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
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
                    {isEditing ? 'Aplicar Cambios' : 'Emitir Comunicado'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Listado de Comunicados */}
          <div className="space-y-5">
            
            {/* Buscador Local e Selector Categorías */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
              
              {/* Buscador local */}
              <div className="relative w-full md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar noticias o eventos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800/40 text-gray-900 dark:text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtro Categorías */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto md:justify-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mr-1.5 flex items-center"><Tag className="w-3.5 h-3.5 mr-1" />Categorías:</span>
                <div className="flex flex-wrap gap-1">
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoria(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedCategoria === cat
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 dark:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Listado en tarjetas */}
            {filteredAnuncios.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Bell className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Portal sin noticias</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    No se han cargado anuncios oficiales para la categoría "{selectedCategoria}" que coincidan con la búsqueda "{search || globalSearch}".
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnuncios.map(anuncio => (
                  <CardAnuncio
                    key={anuncio.id}
                    anuncio={anuncio}
                    isAdmin={isAdmin}
                    onEdit={handleOpenEditForm}
                    onDelete={handleDeleteAnuncio}
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
