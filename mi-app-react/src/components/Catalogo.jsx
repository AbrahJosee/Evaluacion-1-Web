import { useState } from 'react';
import productos from '../data/productos.json';
import categorias from '../data/categorias.json';
import { ENVIO_GRATIS, contiene, formatCLP } from '../formato';
import Banner from './Banner';
import ListaProductos from './ListaProductos';
import './Catalogo.css';

const PRODUCTOS_POR_PAGINA = 9;
const FILTROS = [{ id: '', nombre: 'Todos' }, ...categorias];
const PRECIO_TOPE =
  Math.ceil(Math.max(...productos.map((p) => p.precio)) / 10000) * 10000;
const ORDENES = {
  relevancia: null,
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
};

function cantidadEn(id) {
  return id ? productos.filter((p) => p.categoria === id).length : productos.length;
}

export default function Catalogo({ categoria, onCategoria, onAgregar }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('relevancia');
  const [precioMax, setPrecioMax] = useState(PRECIO_TOPE);

  const lista = productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      p.precio <= precioMax &&
      contiene(p.nombre, busqueda),
  );
  if (ORDENES[orden]) lista.sort(ORDENES[orden]);

  const totalPaginas = Math.ceil(lista.length / PRODUCTOS_POR_PAGINA);
  const paginaVisible = Math.min(paginaActual, Math.max(1, totalPaginas));
  const inicio = (paginaVisible - 1) * PRODUCTOS_POR_PAGINA;
  const visibles = lista.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  const paginas = Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
  const nombreCategoria = categorias.find((c) => c.id === categoria)?.nombre;

  function filtrar(id) {
    onCategoria(id);
    setPaginaActual(1);
  }

  function limpiar() {
    filtrar('');
    setBusqueda('');
    setOrden('relevancia');
    setPrecioMax(PRECIO_TOPE);
  }

  const chips = [
    nombreCategoria && [nombreCategoria, () => filtrar('')],
    busqueda.trim() && [`“${busqueda.trim()}”`, () => setBusqueda('')],
    precioMax < PRECIO_TOPE && [
      `Hasta ${formatCLP(precioMax)}`,
      () => setPrecioMax(PRECIO_TOPE),
    ],
  ].filter(Boolean);

  return (
    <>
      <Banner
        titulo="Productos"
        imagen="/img/techo 4.jpg"
        texto="Explora nuestro catálogo de lámparas, iluminación inteligente, exterior y objetos decorativos."
      />
      <div className="container">
        <div className="row g-4">
          <aside className="col-lg-3">
            <div className="card border-0 shadow-sm sticky-lg-top filtros-panel">
              <div className="card-body p-4">
                <h2 className="h6 text-uppercase fw-bold small mb-3">Categorías</h2>
                <div className="list-group filtros gap-1 mb-4">
                  {FILTROS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${f.id === categoria ? ' active' : ''}`}
                      aria-pressed={f.id === categoria}
                      onClick={() => filtrar(f.id)}
                    >
                      {f.nombre}
                      <span
                        className={`badge rounded-pill ${f.id === categoria ? 'text-bg-light' : 'bg-primary-subtle text-primary-emphasis'}`}
                        aria-hidden="true"
                      >
                        {cantidadEn(f.id)}
                      </span>
                    </button>
                  ))}
                </div>

                <h2 className="h6 text-uppercase fw-bold small mb-2">
                  <label htmlFor="precio-max">Precio máximo</label>
                </h2>
                <input
                  id="precio-max"
                  type="range"
                  className="form-range"
                  min={5000}
                  max={PRECIO_TOPE}
                  step={5000}
                  value={precioMax}
                  onChange={(event) => {
                    setPrecioMax(Number(event.target.value));
                    setPaginaActual(1);
                  }}
                />
                <div className="d-flex justify-content-between small text-body-secondary">
                  <span>{formatCLP(5000)}</span>
                  <strong className="text-primary">{formatCLP(precioMax)}</strong>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm w-100 mt-4"
                  onClick={limpiar}
                >
                  <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
                  Limpiar filtros
                </button>
              </div>
              <div className="promo-lateral rounded-bottom p-4 d-none d-lg-block">
                <i className="bi bi-truck fs-2 text-primary" aria-hidden="true" />
                <p className="fw-semibold text-white mb-1 mt-2">Despacho gratis</p>
                <p className="small mb-0">
                  En compras sobre {formatCLP(ENVIO_GRATIS)} a todo Chile.
                </p>
              </div>
            </div>
          </aside>

          <div className="col-lg-9">
            <div className="row g-3 mb-3">
              <div className="col-md-7">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search" aria-hidden="true" />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Buscar productos..."
                    aria-label="Buscar productos"
                    value={busqueda}
                    onChange={(event) => {
                      setBusqueda(event.target.value);
                      setPaginaActual(1);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <select
                  className="form-select"
                  aria-label="Ordenar productos"
                  value={orden}
                  onChange={(event) => setOrden(event.target.value)}
                >
                  <option value="relevancia">Ordenar: destacados</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="nombre">Nombre: A–Z</option>
                </select>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
              <p className="text-body-secondary small mb-0 me-2" role="status">
                {lista.length > 0
                  ? `Mostrando ${inicio + 1}–${inicio + visibles.length} de ${lista.length} productos`
                  : 'No hay productos para mostrar.'}
              </p>
              {chips.map(([texto, quitar]) => (
                <span className="badge rounded-pill text-bg-dark chip-filtro" key={texto}>
                  {texto}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label={`Quitar filtro ${texto}`}
                    onClick={quitar}
                  />
                </span>
              ))}
            </div>

            {visibles.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5 text-body-secondary">
                <i className="bi bi-search display-4 d-block mb-3" aria-hidden="true" />
                No encontramos productos con esos filtros.
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={limpiar}
                  >
                    Ver todo el catálogo
                  </button>
                </div>
              </div>
            ) : (
              <ListaProductos
                productos={visibles}
                onAgregar={onAgregar}
                columnas="row-cols-lg-3"
              />
            )}

            {totalPaginas > 1 && (
              <nav className="mt-5" aria-label="Páginas del catálogo">
                <ul className="pagination justify-content-center">
                  <li className={`page-item${paginaVisible === 1 ? ' disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      aria-label="Página anterior"
                      disabled={paginaVisible === 1}
                      onClick={() => setPaginaActual(paginaVisible - 1)}
                    >
                      <i className="bi bi-chevron-left" aria-hidden="true" />
                    </button>
                  </li>
                  {paginas.map((numero) => (
                    <li
                      key={numero}
                      className={`page-item${numero === paginaVisible ? ' active' : ''}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        aria-label={`Página ${numero}`}
                        aria-current={numero === paginaVisible ? 'page' : undefined}
                        onClick={() => setPaginaActual(numero)}
                      >
                        {numero}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item${paginaVisible === totalPaginas ? ' disabled' : ''}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      aria-label="Página siguiente"
                      disabled={paginaVisible === totalPaginas}
                      onClick={() => setPaginaActual(paginaVisible + 1)}
                    >
                      <i className="bi bi-chevron-right" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
