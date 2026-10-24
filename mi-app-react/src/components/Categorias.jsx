import { Link } from 'react-router-dom';
import categorias from '../data/categorias.json';
import productos from '../data/productos.json';
import Imagen from './Imagen';

export default function Categorias({ onCategoria }) {
  return (
    <div className="row row-cols-2 row-cols-md-4 g-3">
      {categorias.map((c) => {
        const deCategoria = productos.filter((p) => p.categoria === c.id);
        return (
          <div className="col" key={c.id}>
            <Link
              className="card category-card border-0 text-white h-100 hover-lift"
              to="/productos"
              onClick={() => onCategoria(c.id)}
            >
              <Imagen
                src={deCategoria[0]?.imagen}
                alt={c.nombre}
                className={`tone-${c.id} ratio-4-3`}
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end">
                <h3 className="h5 mb-0 text-white">{c.nombre}</h3>
                <small>
                  {deCategoria.length} productos{' '}
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </small>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
