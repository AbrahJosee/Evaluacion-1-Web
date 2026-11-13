import { Link } from 'react-router-dom';
import { formatCLP } from '../formato';
import Imagen from './Imagen';

export default function Recomendados({ titulo, productos }) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h6 text-uppercase fw-bold small mb-3">{titulo}</h2>
        <div className="list-group list-group-flush">
          {productos.map((p) => (
            <Link
              key={p.codigo}
              to={`/producto/${p.codigo}`}
              className="list-group-item list-group-item-action d-flex align-items-center gap-3 px-0"
            >
              <Imagen
                src={p.imagen}
                alt={p.nombre}
                className={`mini-thumb tone-${p.categoria} ratio-1-1`}
              />
              <span className="flex-grow-1 small fw-semibold">{p.nombre}</span>
              <span className="price small">{formatCLP(p.precio)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
