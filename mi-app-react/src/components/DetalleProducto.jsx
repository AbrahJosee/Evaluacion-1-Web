import { Link } from 'react-router-dom';
import { useState } from 'react';
import productos from '../data/productos.json';
import categorias from '../data/categorias.json';
import { ENVIO_GRATIS, formatCLP } from '../formato';
import Imagen from './Imagen';
import ListaProductos from './ListaProductos';

const PESTANAS = [
  ['descripcion', 'Descripción'],
  ['despacho', 'Despacho'],
  ['garantia', 'Garantía'],
];

const GARANTIAS = [
  ['bi-truck', 'Despacho en 2 a 5 días'],
  ['bi-shield-check', 'Garantía de 12 meses'],
  ['bi-arrow-repeat', 'Cambios en 10 días'],
];

export default function DetalleProducto({ codigo, onAgregar }) {
  const [cantidad, setCantidad] = useState(1);
  const [pestana, setPestana] = useState('descripcion');
  const producto = productos.find((p) => p.codigo === codigo);

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <i
          className="bi bi-question-circle display-4 text-body-secondary"
          aria-hidden="true"
        />
        <p className="mt-3">Producto no encontrado.</p>
        <Link to="/productos" className="btn btn-primary">
          Volver a productos
        </Link>
      </div>
    );
  }

  const { nombre, categoria, precio, descripcion, imagen, stock, stockCritico } =
    producto;
  const critico = stock <= stockCritico;
  const relacionados = productos
    .filter((p) => p.categoria === categoria && p.codigo !== codigo)
    .slice(0, 4);
  const contenidos = {
    descripcion,
    despacho: `Despacho a todo Chile en 2 a 5 días hábiles. Gratis en compras sobre ${formatCLP(ENVIO_GRATIS)}.`,
    garantia:
      'Garantía de 12 meses por defectos de fabricación y cambios dentro de 10 días.',
  };

  function ajustar(valor) {
    setCantidad(Math.min(stock, Math.max(1, Number(valor) || 1)));
  }

  return (
    <div className="container py-4">
      <nav aria-label="Ruta de navegación">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-5 mb-5">
        <div className="col-lg-6">
          <div className="position-relative imagen-redondeada overflow-hidden">
            <Imagen src={imagen} alt={nombre} className={`tone-${categoria} ratio-1-1`} />
            {critico && (
              <span className="badge text-bg-danger position-absolute top-0 start-0 m-3">
                ¡Últimas unidades!
              </span>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <span className="badge bg-primary-subtle text-primary-emphasis mb-2">
            {categorias.find((c) => c.id === categoria)?.nombre ?? categoria}
          </span>
          <h1 className="h2 mb-1">{nombre}</h1>
          <p className="small text-body-secondary mb-3">Código: {codigo}</p>
          <p className="detalle-precio mb-2">{formatCLP(precio)}</p>
          <p className={`fw-semibold small ${critico ? 'text-danger' : 'text-success'}`}>
            <i
              className={`bi ${critico ? 'bi-exclamation-circle' : 'bi-check-circle'} me-1`}
              aria-hidden="true"
            />
            {critico
              ? `Stock bajo: quedan ${stock} unidades`
              : `Stock disponible: ${stock} unidades`}
          </p>

          <div className="d-flex flex-wrap gap-3 my-4">
            <div className="input-group cantidad">
              <button
                className="btn btn-outline-dark"
                type="button"
                aria-label="Restar"
                onClick={() => ajustar(cantidad - 1)}
              >
                <i className="bi bi-dash" aria-hidden="true" />
              </button>
              <input
                type="number"
                className="form-control text-center"
                min="1"
                max={stock}
                value={cantidad}
                aria-label="Cantidad"
                onChange={(event) => ajustar(event.target.value)}
              />
              <button
                className="btn btn-outline-dark"
                type="button"
                aria-label="Sumar"
                onClick={() => ajustar(cantidad + 1)}
              >
                <i className="bi bi-plus" aria-hidden="true" />
              </button>
            </div>
            <button
              className="btn btn-primary btn-lg flex-grow-1"
              type="button"
              onClick={() => onAgregar(codigo, cantidad)}
            >
              <i className="bi bi-bag-plus me-2" aria-hidden="true" />
              Añadir al carrito
            </button>
          </div>

          <div className="row row-cols-1 row-cols-sm-3 g-2 mb-4">
            {GARANTIAS.map(([icono, texto]) => (
              <div className="col" key={texto}>
                <div className="garantia d-flex align-items-center gap-2 p-2 h-100 small">
                  <i className={`bi ${icono} text-primary fs-5`} aria-hidden="true" />
                  {texto}
                </div>
              </div>
            ))}
          </div>

          <ul className="nav nav-tabs" role="tablist">
            {PESTANAS.map(([id, texto]) => (
              <li className="nav-item" role="presentation" key={id}>
                <button
                  type="button"
                  role="tab"
                  className={`nav-link${pestana === id ? ' active' : ''}`}
                  aria-selected={pestana === id}
                  onClick={() => setPestana(id)}
                >
                  {texto}
                </button>
              </li>
            ))}
          </ul>
          <div
            className="border border-top-0 rounded-bottom bg-white p-3"
            role="tabpanel"
          >
            <p className="mb-0 text-body-secondary">{contenidos[pestana]}</p>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <>
          <p className="eyebrow mb-1">Completa tu espacio</p>
          <h2 className="h3 mb-4">Productos relacionados</h2>
          <ListaProductos productos={relacionados} onAgregar={onAgregar} />
        </>
      )}
    </div>
  );
}
