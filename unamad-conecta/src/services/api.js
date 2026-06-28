// Servicio de base de datos simulada utilizando Fetch API y localStorage

// Inicializa la base de datos local a partir de los JSONs públicos si no existe
export async function initializeDatabase() {
  if (localStorage.getItem('unamad_initialized') === 'true') {
    return true;
  }

  try {
    const [usuariosRes, reportesRes, librosRes, anunciosRes, voluntariosRes, apuntesRes] = await Promise.all([
      fetch('/data/usuarios.json'),
      fetch('/data/reportes.json'),
      fetch('/data/libros.json'),
      fetch('/data/anuncios.json'),
      fetch('/data/voluntarios.json'),
      fetch('/data/apuntes.json')
    ]);

    if (!usuariosRes.ok || !reportesRes.ok || !librosRes.ok || !anunciosRes.ok || !voluntariosRes.ok || !apuntesRes.ok) {
      throw new Error("Uno o más archivos de datos JSON no se pudieron cargar.");
    }

    const usuarios = await usuariosRes.json();
    const reportes = await reportesRes.json();
    const libros = await librosRes.json();
    const anuncios = await anunciosRes.json();
    const voluntarios = await voluntariosRes.json();
    const apuntes = await apuntesRes.json();

    localStorage.setItem('unamad_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('unamad_reportes', JSON.stringify(reportes));
    localStorage.setItem('unamad_libros', JSON.stringify(libros));
    localStorage.setItem('unamad_anuncios', JSON.stringify(anuncios));
    localStorage.setItem('unamad_voluntarios', JSON.stringify(voluntarios));
    localStorage.setItem('unamad_apuntes', JSON.stringify(apuntes));
    localStorage.setItem('unamad_initialized', 'true');
    
    // Inicializar un buzón de notificaciones vacío para reportes de estudiantes
    localStorage.setItem('unamad_notificaciones', JSON.stringify([]));
    
    return true;
  } catch (error) {
    console.error("Error al inicializar la base de datos local:", error);
    return false;
  }
}

// Auxiliares genéricos para localStorage
const getLocalData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- USUARIOS ---
export const getUsuarios = () => getLocalData('unamad_usuarios');
export const saveUsuarios = (usuarios) => setLocalData('unamad_usuarios', usuarios);

export const loginUsuario = (correo, contrasena) => {
  const usuarios = getUsuarios();
  const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase() && u.contrasena === contrasena);
  if (!usuario) return null;
  if (usuario.estado === 'desactivado') {
    throw new Error("Esta cuenta ha sido desactivada por el administrador.");
  }
  return usuario;
};

export const registrarUsuario = (nuevoEstudiante) => {
  const usuarios = getUsuarios();
  
  // Validar si el correo ya existe
  const existeCorreo = usuarios.some(u => u.correo.toLowerCase() === nuevoEstudiante.correo.toLowerCase());
  if (existeCorreo) {
    throw new Error("El correo institucional ya se encuentra registrado.");
  }

  // Validar código universitario
  const existeCodigo = usuarios.some(u => u.codigo === nuevoEstudiante.codigo);
  if (existeCodigo) {
    throw new Error("El código universitario ya se encuentra registrado.");
  }

  const estudianteCompleto = {
    id: `user-${Date.now()}`,
    rol: 'estudiante',
    estado: 'activo',
    foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop", // placeholder elegante
    ...nuevoEstudiante
  };

  usuarios.push(estudianteCompleto);
  saveUsuarios(usuarios);
  return estudianteCompleto;
};

export const actualizarUsuario = (id, camposActualizados) => {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1) return null;

  usuarios[index] = { ...usuarios[index], ...camposActualizados };
  saveUsuarios(usuarios);
  return usuarios[index];
};

export const toggleEstadoUsuario = (id) => {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  if (index === -1) return null;

  usuarios[index].estado = usuarios[index].estado === 'activo' ? 'desactivado' : 'activo';
  saveUsuarios(usuarios);
  return usuarios[index];
};

// --- REPORTES ---
export const getReportes = () => getLocalData('unamad_reportes');
export const saveReportes = (reportes) => setLocalData('unamad_reportes', reportes);

export const crearReporte = (nuevoReporte) => {
  const reportes = getReportes();
  const codigoNum = Math.floor(1000 + Math.random() * 9000); // Genera un código tipo REP-XXXX
  
  const reporteCompleto = {
    id: `REP-${Date.now()}`,
    codigo: `REP-${codigoNum}`,
    fecha: new Date().toISOString().split('T')[0],
    estado: 'Pendiente',
    observaciones: '',
    ...nuevoReporte
  };

  reportes.unshift(reporteCompleto); // Añadir al inicio
  saveReportes(reportes);
  return reporteCompleto;
};

export const actualizarEstadoReporte = (id, nuevoEstado, observaciones) => {
  const reportes = getReportes();
  const index = reportes.findIndex(r => r.id === id);
  if (index === -1) return null;

  const reporteAnterior = reportes[index];
  reportes[index] = { 
    ...reporteAnterior, 
    estado: nuevoEstado, 
    observaciones: observaciones || '' 
  };
  saveReportes(reportes);

  // Crear notificación para el estudiante dueño del reporte
  if (reporteAnterior.estudianteId && reporteAnterior.estudianteId !== 'Anónimo') {
    const notificaciones = getLocalData('unamad_notificaciones');
    notificaciones.unshift({
      id: `NOT-${Date.now()}`,
      estudianteId: reporteAnterior.estudianteId,
      reporteCodigo: reporteAnterior.codigo,
      mensaje: `El estado de tu reporte ${reporteAnterior.codigo} (${reporteAnterior.categoria}) ha sido actualizado a: "${nuevoEstado}".`,
      fecha: new Date().toISOString().split('T')[0],
      leida: false
    });
    setLocalData('unamad_notificaciones', notificaciones);
  }

  return reportes[index];
};

// --- NOTIFICACIONES ---
export const getNotificaciones = (estudianteId) => {
  const notificaciones = getLocalData('unamad_notificaciones');
  return notificaciones.filter(n => n.estudianteId === estudianteId);
};

export const marcarNotificacionesLeidas = (estudianteId) => {
  const notificaciones = getLocalData('unamad_notificaciones');
  const actualizadas = notificaciones.map(n => {
    if (n.estudianteId === estudianteId) {
      return { ...n, leida: true };
    }
    return n;
  });
  setLocalData('unamad_notificaciones', actualizadas);
};

// --- BIBLIOTECA ---
export const getLibros = () => getLocalData('unamad_libros');
export const saveLibros = (libros) => setLocalData('unamad_libros', libros);

export const agregarLibro = (nuevoLibro) => {
  const libros = getLibros();
  const libroCompleto = {
    id: `LIB-${Date.now()}`,
    fechaAdicion: new Date().toISOString().split('T')[0],
    descargas: 0,
    ...nuevoLibro
  };
  libros.unshift(libroCompleto);
  saveLibros(libros);
  return libroCompleto;
};

export const editarLibro = (id, libroActualizado) => {
  const libros = getLibros();
  const index = libros.findIndex(l => l.id === id);
  if (index === -1) return null;

  libros[index] = { ...libros[index], ...libroActualizado };
  saveLibros(libros);
  return libros[index];
};

export const eliminarLibro = (id) => {
  const libros = getLibros();
  const filtrados = libros.filter(l => l.id !== id);
  saveLibros(filtrados);
  return true;
};

// Simular descarga de un libro
export const registrarDescargaLibro = (id) => {
  const libros = getLibros();
  const index = libros.findIndex(l => l.id === id);
  if (index !== -1) {
    libros[index].descargas += 1;
    saveLibros(libros);
  }
};

// --- COMUNIDAD: VOLUNTARIOS ---
export const getVoluntarios = () => getLocalData('unamad_voluntarios');
export const saveVoluntarios = (voluntarios) => setLocalData('unamad_voluntarios', voluntarios);

export const agregarVoluntario = (nuevoVoluntario) => {
  const voluntarios = getVoluntarios();
  const voluntarioCompleto = {
    id: `VOL-${Date.now()}`,
    ...nuevoVoluntario
  };
  voluntarios.unshift(voluntarioCompleto);
  saveVoluntarios(voluntarios);
  return voluntarioCompleto;
};

export const eliminarVoluntario = (id) => {
  const voluntarios = getVoluntarios();
  const filtrados = voluntarios.filter(v => v.id !== id);
  saveVoluntarios(filtrados);
  return true;
};

// --- COMUNIDAD: APUNTES COMPARTIDOS ---
export const getApuntes = () => getLocalData('unamad_apuntes');
export const saveApuntes = (apuntes) => setLocalData('unamad_apuntes', apuntes);

export const subirApunte = (nuevoApunte) => {
  const apuntes = getApuntes();
  const apunteCompleto = {
    id: `APU-${Date.now()}`,
    fecha: new Date().toISOString().split('T')[0],
    descargas: 0,
    meGusta: 0,
    ...nuevoApunte
  };
  apuntes.unshift(apunteCompleto);
  saveApuntes(apuntes);
  return apunteCompleto;
};

export const eliminarApunte = (id) => {
  const apuntes = getApuntes();
  const filtrados = apuntes.filter(a => a.id !== id);
  saveApuntes(filtrados);
  return true;
};

export const darMeGustaApunte = (id) => {
  const apuntes = getApuntes();
  const index = apuntes.findIndex(a => a.id === id);
  if (index !== -1) {
    apuntes[index].meGusta += 1;
    saveApuntes(apuntes);
  }
};

// --- ANUNCIOS ---
export const getAnuncios = () => getLocalData('unamad_anuncios');
export const saveAnuncios = (anuncios) => setLocalData('unamad_anuncios', anuncios);

export const agregarAnuncio = (nuevoAnuncio) => {
  const anuncios = getAnuncios();
  const anuncioCompleto = {
    id: `ANU-${Date.now()}`,
    fechaPublicacion: new Date().toISOString().split('T')[0],
    ...nuevoAnuncio
  };
  anuncios.unshift(anuncioCompleto);
  saveAnuncios(anuncios);
  return anuncioCompleto;
};

export const editarAnuncio = (id, anuncioActualizado) => {
  const anuncios = getAnuncios();
  const index = anuncios.findIndex(a => a.id === id);
  if (index === -1) return null;

  anuncios[index] = { ...anuncios[index], ...anuncioActualizado };
  saveAnuncios(anuncios);
  return anuncios[index];
};

export const eliminarAnuncio = (id) => {
  const anuncios = getAnuncios();
  const filtrados = anuncios.filter(a => a.id !== id);
  saveAnuncios(filtrados);
  return true;
};
