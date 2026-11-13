import { Link } from 'react-router-dom';
import categorias from '../data/categorias.json';
import { formatCLP } from '../formato';
import Imagen from './Imagen';
import './Producto.css';

export default function Producto({
  codigo,
  nombre,
  categoria,
  precio,
  imagen,
  stock,
  stockCritico,
  onAgregar,
}) {
  const nombreCategoria = categorias.find((c) => c.id === categoria)?.nombre ?? categoria;
  const enlace = `/producto/${codigo}`;

  return (
    <article className="card product-card h-100 hover-lift">
      <Link className="position-relative d-block" to={enlace}>
        <Imagen src={imagen} alt={nombre} className={`tone-${categoria} ratio-4-3`} />
        {stock <= stockCritico && (
          <span className="badge text-bg-danger position-absolute top-0 start-0 m-2">
            ¡Últimas unidades!
          </span>
        )}
      </Link>
      <div className="card-body d-flex flex-column">
        <span className="product-cat">{nombreCategoria}</span>
        <h3 className="card-title h6 mt-1">
          <Link to={enlace}>{nombre}</Link>
        </h3>
        <p className="price mt-auto mb-3">{formatCLP(precio)}</p>
        <button
          className="btn btn-primary btn-sm w-100"
          type="button"
          onClick={() => onAgregar(codigo, 1)}
        >
          <i className="bi bi-bag-plus me-1" aria-hidden="true" />
          Añadir
        </button>
      </div>
    </article>
  );
}
