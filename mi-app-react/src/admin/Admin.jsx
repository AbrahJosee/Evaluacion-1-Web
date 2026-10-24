import { useState } from 'react';
import Logo from '../components/Logo';
import Login from '../components/Login';
import Dashboard from './Dashboard';
import TablaProductos from './TablaProductos';
import TablaUsuarios from './TablaUsuarios';

const SECCIONES = [
  { id: 'dashboard', titulo: 'Dashboard', icono: 'bi-speedometer2' },
  { id: 'productos', titulo: 'Productos', icono: 'bi-box-seam' },
  { id: 'usuarios', titulo: 'Usuarios', icono: 'bi-people' },
];

function usuarioGuardado() {
  try {
    const usuario = JSON.parse(sessionStorage.getItem('lumina_usuario'));
    return usuario && usuario.tipoUsuario !== 'cliente' ? usuario : null;
  } catch {
    return null;
  }
}

export default function Admin() {
  const [usuario, setUsuario] = useState(usuarioGuardado);
  const [seccion, setSeccion] = useState('dashboard');

  function entrar(candidato) {
    if (candidato.tipoUsuario === 'cliente') return false;
    setUsuario(candidato);
  }

  function cerrarSesion() {
    sessionStorage.removeItem('lumina_usuario');
    setUsuario(null);
  }

  if (!usuario) {
    return <Login onLogin={entrar} />;
  }

  const actual = SECCIONES.find((s) => s.id === seccion);
  const enlaces = SECCIONES.map((s) => (
    <li className="nav-item" key={s.id}>
      <a
        href={`#${s.id}`}
        className={`nav-link${seccion === s.id ? ' active' : ''}`}
        aria-current={seccion === s.id ? 'page' : undefined}
        onClick={() => setSeccion(s.id)}
      >
        <i className={`bi ${s.icono} me-2`} aria-hidden="true" />
        {s.titulo}
      </a>
    </li>
  ));

  return (
    <div className="d-lg-flex min-vh-100">
      <aside className="admin-sidebar d-none d-lg-flex flex-column p-3">
        <div className="brand px-2 pb-4">
          <Logo />
        </div>
        <ul className="nav nav-pills flex-column gap-1 flex-grow-1">{enlaces}</ul>
        <hr className="border-secondary" />
        <a href="/" className="nav-link px-3">
          <i className="bi bi-shop me-2" aria-hidden="true" />
          Volver a la tienda
        </a>
      </aside>

      <div className="flex-grow-1 d-flex flex-column">
        <header className="d-flex align-items-center justify-content-between gap-3 px-3 px-lg-4 py-3 bg-white border-bottom">
          <h1 className="h5 mb-0">{actual.titulo}</h1>
          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-sm-inline small text-body-secondary">
              <i className="bi bi-person-circle me-1" aria-hidden="true" />
              {usuario.nombre} · {usuario.tipoUsuario}
            </span>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={cerrarSesion}
            >
              <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
              Salir
            </button>
          </div>
        </header>

        <nav
          className="d-lg-none bg-white border-bottom px-3 py-2"
          aria-label="Secciones del panel"
        >
          <ul className="nav nav-pills flex-nowrap overflow-auto">
            {enlaces}
            <li className="nav-item">
              <a href="/" className="nav-link" aria-label="Volver a la tienda">
                <i className="bi bi-shop" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </nav>

        <main className="p-3 p-lg-4">
          {seccion === 'dashboard' && <Dashboard usuario={usuario} onIr={setSeccion} />}
          {seccion === 'productos' && <TablaProductos />}
          {seccion === 'usuarios' && <TablaUsuarios />}
        </main>
      </div>
    </div>
  );
}
