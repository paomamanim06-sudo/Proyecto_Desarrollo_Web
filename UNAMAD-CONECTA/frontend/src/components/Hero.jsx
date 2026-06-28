import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Apoyo Estudiantil de Clase Mundial</h1>

          <p>
            Nuestra plataforma permite reportar incidencias,
            compartir apuntes, encontrar ayuda académica y
            mantenerse informado sobre las actividades de la
            Universidad Nacional Amazónica de Madre de Dios.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">
              Crear Reporte
            </button>

            <button className="btn-secondary">
              Biblioteca
            </button>
          </div>
        </div>

        <div className="hero-image">
          📚
        </div>
      </div>
    </section>
  );
}

export default Hero;