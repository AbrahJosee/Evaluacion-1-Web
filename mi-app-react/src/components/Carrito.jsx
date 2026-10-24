import { Link } from 'react-router-dom';
import productos from '../data/productos.json';
import { ENVIO_GRATIS, formatCLP } from '../formato';
import Banner from './Banner';
import Imagen from './Imagen';
import ListaProductos from './ListaProductos';

const PASOS = ['Carrito', 'Despacho', 'Pago'];

export default function Carrito({ carrito, onCambiar, onAgregar, avisar }) {
  const lineas = carrito
    .map((item) => ({
      ...item,
      producto: productos.find((p) => p.codigo === item.codigo),
    }))
    .filter((linea) => linea.producto);
  const subtotal = lineas.reduce(
    (total, linea) => total + linea.producto.precio * linea.cantidad,
    0,
  );
  const faltante = Math.max(0, ENVIO_GRATIS - subtotal);
  const avance = Math.min(100, Math.round((subtotal / ENVIO_GRATIS) * 100));
  const sugeridos = productos
    .filter((p) => !carrito.some((item) => item.codigo === p.codigo))
    .slice(0, 4);

  return (
    <>
      <Banner
        titulo="Mi carrito"
        imagen="/img/adorno 3.jpg"
        texto="Revisa tus productos antes de pagar."
      />
      <div className="container">
        <ol
          className="pasos list-unstyled d-flex mx-auto mb-5"
          aria-label="Pasos de la compra"
        >
          {PASOS.map((paso, indice) => (
            <li
              key={paso}
              className={indice === 0 ? 'activo' : undefined}
              aria-current={indice === 0 ? 'step' : undefined}
            >
              {paso}
            </li>
          ))}
        </ol>

        {lineas.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5 mb-5">
            <i className="bi bi-bag-x display-3 text-body-secondary" aria-hidden="true" />
            <p className="lead mt-3">Tu carrito está vacío.</p>
            <div>
              <Link className="btn btn-primary" to="/productos">
                Ir a productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="alert alert-light border mb-4">
                {faltante > 0 ? (
                  <>
                    <i className="bi bi-truck me-2" aria-hidden="true" />
                    Te faltan <strong>{formatCLP(faltante)}</strong> para el despacho
                    gratis
                  </>
                ) : (
                  <>
                    <i className="bi bi-gift me-2 text-success" aria-hidden="true" />
                    ¡Tienes <strong>despacho gratis</strong>!
                  </>
                )}
                <div
                  className="progress progress-delgada mt-2"
                  role="progressbar"
                  aria-label="Avance hacia el despacho gratis"
                  aria-valuenow={avance}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className={`progress-bar ${faltante > 0 ? 'bg-primary' : 'bg-success'}`}
                    style={{ width: `${avance}%` }}
                  />
                </div>
              </div>

              <ul className="list-group">
                {lineas.map(({ codigo, cantidad, producto }) => (
                  <li
                    className="list-group-item d-flex flex-wrap align-items-center gap-3 py-3"
                    key={codigo}
                  >
                    <Imagen
                      src={producto.imagen}
                      alt={producto.nombre}
                      className={`carrito-thumb tone-${producto.categoria} ratio-1-1`}
                    />
                    <div className="flex-grow-1">
                      <h2 className="h6 mb-1">{producto.nombre}</h2>
                      <small className="text-body-secondary">
                        {formatCLP(producto.precio)} c/u
                      </small>
                      <div className="d-flex align-items-center gap-3 mt-2">
                        <div className="input-group input-group-sm carrito-cantidad">
                          <button
                            className="btn btn-outline-dark"
                            type="button"
                            aria-label={`Restar ${producto.nombre}`}
                            onClick={() => onCambiar(codigo, cantidad - 1)}
                          >
                            <i className="bi bi-dash" aria-hidden="true" />
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            min="1"
                            max={producto.stock}
                            value={cantidad}
                            aria-label={`Cantidad de ${producto.nombre}`}
                            onChange={(event) =>
                              onCambiar(
                                codigo,
                                Math.min(
                                  producto.stock,
                                  Math.max(1, Number(event.target.value) || 1),
                                ),
                              )
                            }
                          />
                          <button
                            className="btn btn-outline-dark"
                            type="button"
                            aria-label={`Sumar ${producto.nombre}`}
                            onClick={() =>
                              onCambiar(codigo, Math.min(producto.stock, cantidad + 1))
                            }
                          >
                            <i className="bi bi-plus" aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn btn-link text-danger btn-sm p-0"
                          onClick={() => onCambiar(codigo, 0)}
                        >
                          <i className="bi bi-trash me-1" aria-hidden="true" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <strong className="ms-auto">
                      {formatCLP(producto.precio * cantidad)}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-4">
              <aside className="card border-0 shadow-sm sticky-lg-top resumen">
                <div className="card-body p-4">
                  <h2 className="h5 mb-3">Resumen</h2>
                  <div className="d-flex justify-content-between small text-body-secondary mb-2">
                    <span>Subtotal</span>
                    <span className="resumen-subtotal">{formatCLP(subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-body-secondary mb-3">
                    <span>Despacho</span>
                    <span>{faltante > 0 ? 'A calcular en pago' : 'Gratis'}</span>
                  </div>
                  <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-3 mb-3">
                    <span>Total</span>
                    <span className="resumen-total">{formatCLP(subtotal)}</span>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cupón de descuento"
                      aria-label="Cupón de descuento"
                    />
                    <button
                      className="btn btn-outline-dark"
                      type="button"
                      onClick={() => avisar('Cupón no válido en esta demo')}
                    >
                      Aplicar
                    </button>
                  </div>
                  <button
                    className="btn btn-primary btn-lg w-100"
                    type="button"
                    onClick={() => avisar('Pago simulado: ¡gracias por tu compra!')}
                  >
                    <i className="bi bi-lock me-2" aria-hidden="true" />
                    Pagar
                  </button>
                  <p className="text-center small text-body-secondary mt-3 mb-0">
                    <i className="bi bi-shield-lock me-1" aria-hidden="true" />
                    Pago seguro con tarjetas y transferencia
                  </p>
                  <Link to="/productos" className="d-block text-center small mt-2">
                    <i className="bi bi-arrow-left me-1" aria-hidden="true" />
                    Seguir comprando
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        )}

        <section className="mt-5">
          <p className="eyebrow mb-1">Te podría gustar</p>
          <h2 className="h3 mb-4">Completa tu compra</h2>
          <ListaProductos productos={sugeridos} onAgregar={onAgregar} />
        </section>
      </div>
    </>
  );
}
