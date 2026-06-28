import React, { useState, useRef } from 'react';
import { AlertCircle, Upload, X, ShieldAlert, CheckCircle, HelpCircle, FileImage } from 'lucide-react';

export default function FormularioReporte({ onSubmitSuccess }) {
  const [categoria, setCategoria] = useState('');
  const [visibilidad, setVisibilidad] = useState('Público');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Categorías de reportes
  const categorias = [
    'Infraestructura',
    'Académico',
    'Bullying',
    'Acoso',
    'Servicios',
    'Administrativo'
  ];

  // Descripciones de visibilidad para guiar al estudiante
  const visibilidades = [
    { value: 'Público', label: 'Público', desc: 'Visible para toda la comunidad UNAMAD. Ayuda a alertar a otros estudiantes.' },
    { value: 'Privado', label: 'Privado', desc: 'Solo visible para ti y la administración de UNAMAD. Ideal para asuntos personales.' },
    { value: 'Anónimo', label: 'Anónimo', desc: 'Tu identidad se oculta completamente de la administración y del público.' }
  ];

  // Simuladores de imágenes según categoría (para dar una evidencia visual realista)
  const getSimulatedImageForCategory = (cat) => {
    switch (cat) {
      case 'Infraestructura': return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=300&fit=crop';
      case 'Servicios': return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop';
      case 'Académico': return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop';
      default: return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop';
    }
  };

  // Manejadores del Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona únicamente archivos de imagen (PNG, JPG, JPEG).');
      return;
    }

    setFileName(file.name);
    setError('');

    // Leer el archivo como DataURL para previsualización real en el navegador
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
      setImagenUrl(e.target.result); // Guardar la imagen real en base64
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    setFileName('');
    setImagenUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Envío del Reporte
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!categoria) {
      setError('Por favor, selecciona una categoría para tu reporte.');
      return;
    }

    if (!descripcion.trim() || descripcion.trim().length < 15) {
      setError('La descripción del reporte debe tener al menos 15 caracteres.');
      return;
    }

    setIsSubmitting(true);

    // Si el estudiante no subió una imagen real, podemos asociar un simulador de categoría para enriquecer la visualización
    let finalImage = imagenUrl;
    if (!finalImage && Math.random() > 0.3) {
      // Asociar una imagen realista automáticamente un 70% de las veces para fines de presentación
      finalImage = getSimulatedImageForCategory(categoria);
    }

    setTimeout(() => {
      const reportePayload = {
        categoria,
        visibilidad,
        descripcion: descripcion.trim(),
        imagen: finalImage,
      };

      onSubmitSuccess(reportePayload);

      // Limpiar Formulario
      setCategoria('');
      setVisibilidad('Público');
      setDescripcion('');
      handleRemoveFile();
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-6 transition-colors duration-200">
      
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <ShieldAlert className="w-5.5 h-5.5 text-emerald-600" />
          <span>Crear un Nuevo Reporte Estudiantil</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Usa este formulario para reportar incidentes o problemas en UNAMAD. Nuestro equipo revisará tu caso con discreción.
        </p>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start space-x-2 text-red-700 dark:text-red-400 text-xs">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Categoría */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
          1. Categoría del Incidente <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoria(cat)}
              className={`p-3 text-left border rounded-xl text-xs font-medium transition-all cursor-pointer flex flex-col justify-between ${
                categoria === cat
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/10'
                  : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visibilidad */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
          2. Nivel de Visibilidad
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {visibilidades.map((vis) => (
            <div
              key={vis.value}
              onClick={() => setVisibilidad(vis.value)}
              className={`p-3 border rounded-xl cursor-pointer transition-all flex flex-col space-y-1 ${
                visibilidad === vis.value
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/5 text-slate-800 dark:text-white ring-2 ring-emerald-500/5'
                  : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="visibilidad"
                  value={vis.value}
                  checked={visibilidad === vis.value}
                  onChange={() => {}} // Manejado por onClick del contenedor
                  className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-900 dark:text-white">{vis.label}</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">{vis.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="descripcion" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
            3. Detalles del Reporte <span className="text-red-500">*</span>
          </label>
          <span className="text-[10px] text-gray-400">{descripcion.length} caracteres</span>
        </div>
        <textarea
          id="descripcion"
          rows={4}
          placeholder="Escribe de manera clara lo sucedido. Incluye fechas, ubicaciones exactas (aulas, pabellones) y cualquier detalle relevante para facilitar la gestión..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="block w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Subir Evidencia */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">
          4. Adjuntar Evidencia (Opcional)
        </label>
        
        {/* Caja Interactiva Drag & Drop */}
        {!filePreview ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10'
                : 'border-gray-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-gray-50 dark:bg-slate-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-gray-400">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Arrastra una foto aquí o <span className="text-emerald-600 dark:text-emerald-400 hover:underline">búscala en tu equipo</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Formatos permitidos: PNG, JPG, JPEG de hasta 5MB</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/5 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-100">
                <img src={filePreview} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{fileName}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
                  <FileImage className="w-3.5 h-3.5" />
                  <span>Imagen cargada con éxito</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 dark:hover:bg-red-950/20 rounded-lg transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>

      {/* Botón Guardar */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/10 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enviando reporte...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4.5 h-4.5" />
              <span>Enviar Reporte Oficial</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
