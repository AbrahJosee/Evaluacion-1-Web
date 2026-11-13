import { Link } from 'react-router-dom';
import blogs from '../data/blogs.json';
import productos from '../data/productos.json';
import { minutosLectura } from '../formato';
import Banner from './Banner';
import Recomendados from './Recomendados';

const inspiracion = productos.filter((p) => p.categoria === 'smart').slice(0, 3);

export default function DetalleBlog({ id }) {
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-journal-x display-4 text-body-secondary" aria-hidden="true" />
        <p className="mt-3">Artículo no encontrado.</p>
        <Link to="/blogs" className="btn btn-primary">
          Volver a blogs
        </Link>
      </div>
    );
  }

  const [primero, ...resto] = blog.cuerpo;
  const siguiente = blogs[(blogs.indexOf(blog) + 1) % blogs.length];

  return (
    <>
      <Banner
        titulo={blog.titulo}
        imagen={blog.imagen}
        texto={`${minutosLectura(blog.cuerpo)} min de lectura · Equipo Lumina Home`}
        migas={[['/blogs', 'Blogs']]}
      />
      <div className="container">
        <div className="row g-5">
          <article className="col-lg-8">
            <p className="lead fw-medium">{primero}</p>
            {resto.map((parrafo) => (
              <p key={parrafo} className="lh-lg text-body-secondary">
                {parrafo}
              </p>
            ))}

            {siguiente !== blog && (
              <Link
                to={`/blog/${siguiente.id}`}
                className="card border-0 shadow-sm hover-lift mt-5 text-reset"
              >
                <div className="card-body p-4 d-flex align-items-center gap-3">
                  <div className="flex-grow-1">
                    <small className="eyebrow">Siguiente artículo</small>
                    <p className="h5 mb-0 mt-1">{siguiente.titulo}</p>
                  </div>
                  <i
                    className="bi bi-arrow-right-circle fs-2 text-primary"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )}
          </article>

          <aside className="col-lg-4">
            <div className="d-grid gap-4 sticky-lg-top resumen">
              <Recomendados
                titulo="Inspírate con estos productos"
                productos={inspiracion}
              />
              <div className="card border-0 promo-lateral">
                <div className="card-body p-4">
                  <i className="bi bi-lightbulb fs-2 text-primary" aria-hidden="true" />
                  <p className="fw-semibold text-white mt-2 mb-1">Asesoría gratuita</p>
                  <p className="small">
                    Te ayudamos a elegir la luz ideal para tu hogar.
                  </p>
                  <Link to="/contacto" className="btn btn-primary btn-sm">
                    Contáctanos
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
