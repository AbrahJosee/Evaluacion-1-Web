import { Link } from 'react-router-dom';
import categorias from '../data/categorias.json';
import Logo from './Logo';

const anioActual = new Date().getFullYear();

const REDES = [
  ['bi-instagram', 'Instagram', 'https://www.instagram.com/'],
  ['bi-facebook', 'Facebook', 'https://www.facebook.com/'],
  ['bi-pinterest', 'Pinterest', 'https://www.pinterest.com/'],
  ['bi-tiktok', 'TikTok', 'https://www.tiktok.com/'],
];

export default function Footer({ onCategoria, avisar }) {
  function suscribir(event) {
    event.preventDefault();
    event.currentTarget.reset();
    avisar('¡Gracias por suscribirte!');
  }

  return (
    <footer className="site-footer mt-5 pt-5">
      <div className="container">
        <div className="row g-4 pb-4">
          <div className="col-lg-4">
            <div className="text-white mb-3">
              <Logo />
            </div>
            <p className="small">
              Tienda boutique de diseño de interiores: lámparas inteligentes, iluminación
              LED minimalista y objetos decorativos para el hogar.
            </p>
            <div className="d-flex gap-2">
              {REDES.map(([icono, nombre, enlace]) => (
                <a
                  key={nombre}
                  href={enlace}
                  className="social-link"
                  aria-label={nombre}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className={`bi ${icono}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="col-6 col-lg-2">
            <h2 className="mb-3">Categorías</h2>
            <ul className="list-unstyled small d-grid gap-2">
              {categorias.map((c) => (
                <li key={c.id}>
                  <Link to="/productos" onClick={() => onCategoria(c.id)}>
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h2 className="mb-3">Empresa</h2>
            <ul className="list-unstyled small d-grid gap-2">
              <li>
                <Link to="/nosotros">Nosotros</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h2 className="mb-3">Mantente al día</h2>
            <p className="small">
              Recibe tendencias de iluminación y ofertas exclusivas.
            </p>
            <form className="input-group" onSubmit={suscribir}>
              <input
                type="email"
                className="form-control"
                placeholder="tu@correo.com"
                aria-label="Correo para el boletín"
                required
              />
              <button className="btn btn-primary" type="submit">
                Suscribirme
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3 small">
          <span>© {anioActual} Lumina Home. Todos los derechos reservados.</span>
          <span className="d-flex gap-3 fs-5" title="Medios de pago">
            <i className="bi bi-credit-card" aria-hidden="true" />
            <i className="bi bi-bank" aria-hidden="true" />
            <i className="bi bi-wallet2" aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
}
