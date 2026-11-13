import { Link } from 'react-router-dom';
export default function Banner({ titulo, texto, imagen, migas = [] }) {
  return (
    <header
      className="page-banner mb-5"
      style={imagen ? { backgroundImage: `url("${imagen}")` } : undefined}
    >
      <div className="container">
        <nav aria-label="Ruta de navegación">
          <ol className="breadcrumb mb-3">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            {migas.map(([enlace, texto]) => (
              <li className="breadcrumb-item" key={enlace}>
                <Link to={enlace}>{texto}</Link>
              </li>
            ))}
            <li className="breadcrumb-item active" aria-current="page">
              {titulo}
            </li>
          </ol>
        </nav>
        <h1 className="display-5 text-white mb-2">{titulo}</h1>
        {texto && <p className="lead banner-texto mb-0">{texto}</p>}
      </div>
    </header>
  );
}
