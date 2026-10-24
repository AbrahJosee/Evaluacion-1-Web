import { useState } from 'react';
import productos from '../data/productos.json';
import categorias from '../data/categorias.json';
import { contiene, formatCLP } from '../formato';
import Imagen from '../components/Imagen';

export default function TablaProductos() {
  const [busqueda, setBusqueda] = useState('');
  const visibles = productos.filter((p) => contiene(`${p.nombre} ${p.codigo}`, busqueda));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center py-3">
        <h2 className="h6 mb-0">{visibles.length} productos</h2>
        <div className="input-group admin-search">
          <span className="input-group-text bg-white">
            <i className="bi bi-search" aria-hidden="true" />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre o código..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 admin-table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.codigo}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <Imagen
                      src={p.imagen}
                      alt={p.nombre}
                      className={`row-thumb tone-${p.categoria}`}
                    />
                    <div>
                      <strong className="d-block">{p.nombre}</strong>
                      <small className="text-body-secondary">{p.codigo}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge text-bg-light border">
                    {categorias.find((c) => c.id === p.categoria)?.nombre}
                  </span>
                </td>
                <td>{formatCLP(p.precio)}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${p.stock <= p.stockCritico ? 'text-bg-danger' : 'text-bg-success'}`}
                  >
                    {p.stock} u.
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
