import { Link } from 'react-router-dom';
import productos from '../data/productos.json';
import categorias from '../data/categorias.json';
import { ENVIO_GRATIS, formatCLP } from '../formato';
import Portada from './Portada';
import Categorias from './Categorias';
import ListaProductos from './ListaProductos';

const BENEFICIOS = [
  ['bi-truck', 'Despacho a todo Chile', `Gratis sobre ${formatCLP(ENVIO_GRATIS)}`],
  ['bi-shield-check', 'Garantía de 12 meses', 'En toda la iluminación'],
  ['bi-credit-card', 'Hasta 6 cuotas', 'Sin interés con tarjetas'],
  ['bi-chat-heart', 'Asesoría de diseño', 'Te ayudamos a elegir'],
];

const destacados = categorias.map((c) => productos.find((p) => p.categoria === c.id));

export default function Inicio({ onCategoria, onAgregar }) {
  return (
    <>
      <h1 className="visually-hidden">
        Lumina Home · Iluminación y decoración de interiores
      </h1>
      <Portada onCategoria={onCategoria} />

      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 beneficios">
          {BENEFICIOS.map(([icono, titulo, detalle]) => (
            <div className="col" key={titulo}>
              <div className="beneficio d-flex align-items-center gap-3 h-100 p-3">
                <i className={`bi ${icono} fs-2 text-primary`} aria-hidden="true" />
                <div>
                  <strong className="d-block">{titulo}</strong>
                  <small className="text-body-secondary">{detalle}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="py-5">
          <p className="eyebrow mb-1">Categorías</p>
          <h2 className="mb-4">Explora por categoría</h2>
          <Categorias onCategoria={onCategoria} />
        </section>

        <section className="pb-5">
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-4">
            <div>
              <p className="eyebrow mb-1">Lo más buscado</p>
              <h2 className="mb-0">Productos destacados</h2>
            </div>
            <Link to="/productos" className="fw-semibold" onClick={() => onCategoria('')}>
              Ver todo el catálogo <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </div>
          <ListaProductos productos={destacados} onAgregar={onAgregar} />
        </section>

        <section className="cta-banner p-4 p-lg-5">
          <i className="bi bi-lightbulb-fill cta-icono" aria-hidden="true" />
          <div className="row align-items-center g-4 position-relative">
            <div className="col-lg-8">
              <span className="badge bg-primary mb-3">Gratis</span>
              <h2 className="mb-2">¿No sabes qué lámpara elegir?</h2>
              <p className="mb-0 text-white-50">
                Nuestro equipo de diseño te asesora para iluminar cada espacio de tu
                hogar.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contacto" className="btn btn-primary btn-lg">
                <i className="bi bi-chat-dots me-2" aria-hidden="true" />
                Pide tu asesoría
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
