import "../styles/reports.css";

function ReportsSection() {
  return (
    <section className="reports">
      <div className="container">
        <h2>Reportes Estudiantiles</h2>

        <p className="subtitle">
          Reporta incidencias, problemas académicos o sugerencias para mejorar la universidad.
        </p>

        <div className="cards">

          <div className="card">
            <h3>Infraestructura</h3>
            <p>Reporta problemas en aulas, laboratorios o mobiliario.</p>
          </div>

          <div className="card">
            <h3>Académico</h3>
            <p>Informa inconvenientes relacionados con cursos o docentes.</p>
          </div>

          <div className="card">
            <h3>Bienestar</h3>
            <p>Solicita apoyo o reporta situaciones que afecten a los estudiantes.</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ReportsSection;