import { Link } from 'react-router-dom';
import blogs from '../data/blogs.json';
import productos from '../data/productos.json';
import { minutosLectura } from '../formato';
import Banner from './Banner';
import Imagen from './Imagen';
import Recomendados from './Recomendados';

const TEMAS = [
  'Temperatura de color',
  'Minimalismo',
  'Iluminación smart',
  'Decoración',
  'Exterior',
  'Ahorro energético',
];

const masVendidos = ['SMT-001', 'LMP-001', 'EXT-003'].map((codigo) =>
  productos.find((p) => p.codigo === codigo),
);

export default function Blogs() {
  return (
    <>
      <Banner
        titulo="Blogs"
        imagen="/img/blog 2.jpg"
        texto="Noticias, tendencias y consejos para iluminar tu hogar."
      />
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-8 d-grid gap-4">
            {blogs.map((b, indice) => (
              <article
                className="card blog-card blog-horizontal border-0 shadow-sm overflow-hidden hover-lift"
                key={b.id}
              >
                <div className="row g-0">
                  <div className={`col-md-6${indice % 2 ? ' order-md-last' : ''}`}>
                    <Imagen src={b.imagen} alt={b.titulo} className="tone-blog" />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body p-4 p-lg-5 d-flex flex-column h-100">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span
                          className={`badge ${indice === 0 ? 'bg-primary' : 'bg-primary-subtle text-primary-emphasis'}`}
                        >
                          {indice === 0 ? 'Destacado' : 'Tendencias'}
                        </span>
                        <small className="text-body-secondary">
                          <i className="bi bi-clock me-1" aria-hidden="true" />
                          {minutosLectura(b.cuerpo)} min de lectura
                        </small>
                      </div>
                      <h2 className="h4 card-title">{b.titulo}</h2>
                      <p className="text-body-secondary">{b.resumen}</p>
                      <Link
                        className="btn btn-outline-dark mt-auto align-self-start"
                        to={`/blog/${b.id}`}
                      >
                        Leer artículo{' '}
                        <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="col-lg-4 d-grid gap-4 align-content-start">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h6 text-uppercase fw-bold small mb-3">Temas populares</h2>
                <div className="d-flex flex-wrap gap-2">
                  {TEMAS.map((tema) => (
                    <span
                      className="badge rounded-pill text-bg-light border fw-medium px-3 py-2"
                      key={tema}
                    >
                      {tema}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Recomendados titulo="Lo más vendido" productos={masVendidos} />
            <div className="card border-0 promo-lateral">
              <div className="card-body p-4">
                <i className="bi bi-chat-heart fs-2 text-primary" aria-hidden="true" />
                <p className="fw-semibold text-white mt-2 mb-1">¿Necesitas ideas?</p>
                <p className="small">Te asesoramos gratis para iluminar tu espacio.</p>
                <Link to="/contacto" className="btn btn-primary btn-sm">
                  Pide tu asesoría
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
