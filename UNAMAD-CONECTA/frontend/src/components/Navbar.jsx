import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        🌿 <span>UNAMAD Conecta</span>
      </div>

      <nav>
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#reportes">Reportes</a></li>
          <li><a href="#comunidad">Comunidad</a></li>
          <li><a href="#biblioteca">Biblioteca</a></li>
          <li><a href="#anuncios">Anuncios</a></li>
        </ul>
      </nav>

      <button className="btn-panel">
        Mi Panel
      </button>
    </header>
  );
}

export default Navbar;