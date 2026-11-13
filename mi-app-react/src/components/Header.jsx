import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ENVIO_GRATIS, formatCLP } from '../formato';
import Logo from './Logo';

const ENLACES = [
  { ruta: '/', texto: 'Home' },
  { ruta: '/productos', texto: 'Productos', detalle: '/producto/' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blogs', texto: 'Blogs', detalle: '/blog/' },
  { ruta: '/contacto', texto: 'Contacto' },
];

export default function Header({ unidades }) {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();

  function esActivo(enlace) {
    return (
      pathname === enlace.ruta || (enlace.detalle && pathname.startsWith(enlace.detalle))
    );
  }

  return (
    <>
      <div className="announcement-bar text-center small py-2">
        <i className="bi bi-truck me-2" aria-hidden="true" />
        Despacho gratis en compras sobre {formatCLP(ENVIO_GRATIS)}
      </div>
      <nav
        className="navbar navbar-expand-lg site-header sticky-top py-3"
        aria-label="Navegación principal"
      >
        <div className="container">
          <Link className="navbar-brand" to="/">
            <Logo />
          </Link>

          <div className="d-flex align-items-center gap-1 order-lg-last">
            <Link
              to="/carrito"
              className="btn btn-link cart-link position-relative"
              aria-label={`Carrito, ${unidades} productos`}
            >
              <i className="bi bi-bag fs-4" aria-hidden="true" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary carrito-badge">
                {unidades}
              </span>
            </Link>
            <button
              className="navbar-toggler ms-2"
              type="button"
              aria-controls="menu-principal"
              aria-expanded={abierto}
              aria-label="Abrir o cerrar menú"
              onClick={() => setAbierto(!abierto)}
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>

          <div
            id="menu-principal"
            className={`collapse navbar-collapse${abierto ? ' show' : ''}`}
            onClick={() => setAbierto(false)}
          >
            <ul className="navbar-nav mx-auto gap-lg-3">
              {ENLACES.map((enlace) => (
                <li className="nav-item" key={enlace.ruta}>
                  <Link
                    className={`nav-link${esActivo(enlace) ? ' active' : ''}`}
                    aria-current={esActivo(enlace) ? 'page' : undefined}
                    to={enlace.ruta}
                  >
                    {enlace.texto}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="d-flex gap-2 py-3 py-lg-0 me-lg-3">
              <Link to="/login" className="btn btn-outline-dark btn-sm">
                <i className="bi bi-person me-1" aria-hidden="true" />
                Ingresar
              </Link>
              <Link to="/registro" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
