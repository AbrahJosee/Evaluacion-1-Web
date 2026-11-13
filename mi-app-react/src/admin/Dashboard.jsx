import productos from '../data/productos.json';
import categorias from '../data/categorias.json';
import usuarios from '../data/usuarios.json';
import { formatCLP } from '../formato';

export default function Dashboard({ usuario, onIr }) {
  const criticos = productos.filter((p) => p.stock <= p.stockCritico);
  const inventario = productos.reduce((total, p) => total + p.precio * p.stock, 0);
  const estadisticas = [
    ['Productos publicados', productos.length, 'bi-box-seam', 'primary'],
    ['Con stock crítico', criticos.length, 'bi-exclamation-triangle', 'danger'],
    ['Usuarios registrados', usuarios.length, 'bi-people', 'success'],
    ['Valor del inventario', formatCLP(inventario), 'bi-cash-stack', 'dark'],
  ];

  return (
    <>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 d-md-flex align-items-center justify-content-between gap-3">
          <div>
            <h2 className="h4">¡Bienvenido, {usuario.nombre}!</h2>
            <p className="text-body-secondary mb-md-0">
              Gestiona el catálogo de productos y los usuarios de Lumina Home.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onIr('productos')}
            >
              Ver productos
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => onIr('usuarios')}
            >
              Ver usuarios
            </button>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        {estadisticas.map(([etiqueta, valor, icono, color]) => (
          <div className="col" key={etiqueta}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <span className={`stat-icon bg-${color}-subtle text-${color}`}>
                  <i className={`bi ${icono}`} aria-hidden="true" />
                </span>
                <div>
                  <div className="small text-body-secondary text-uppercase">
                    {etiqueta}
                  </div>
                  <div className="fs-4 fw-bold">{valor}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="h6 mb-4">Productos por categoría</h3>
              {categorias.map((c) => {
                const cantidad = productos.filter((p) => p.categoria === c.id).length;
                const porcentaje = Math.round((cantidad / productos.length) * 100);
                return (
                  <div className="mb-3" key={c.id}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{c.nombre}</span>
                      <span className="text-body-secondary">{cantidad} productos</span>
                    </div>
                    <div
                      className="progress progress-delgada"
                      role="progressbar"
                      aria-label={`${c.nombre}: ${porcentaje}% del catálogo`}
                      aria-valuenow={porcentaje}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="h6 mb-3">Alertas de stock crítico</h3>
              {criticos.length === 0 ? (
                <p className="text-body-secondary mb-0">Todo el stock está en orden.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {criticos.map((p) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                      key={p.codigo}
                    >
                      <span>
                        <i
                          className="bi bi-exclamation-circle text-danger me-2"
                          aria-hidden="true"
                        />
                        {p.nombre}
                      </span>
                      <span className="badge rounded-pill text-bg-danger">
                        {p.stock} u.
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
