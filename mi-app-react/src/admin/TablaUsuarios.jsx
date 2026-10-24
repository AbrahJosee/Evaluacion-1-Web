import { useState } from 'react';
import usuarios from '../data/usuarios.json';
import { contiene } from '../formato';

const PERFILES = {
  administrador: 'text-bg-primary',
  vendedor: 'text-bg-info',
  cliente: 'text-bg-secondary',
};

export default function TablaUsuarios() {
  const [busqueda, setBusqueda] = useState('');
  const visibles = usuarios.filter((u) =>
    contiene(`${u.nombre} ${u.apellidos} ${u.correo} ${u.run}`, busqueda),
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center py-3">
        <h2 className="h6 mb-0">{visibles.length} usuarios</h2>
        <div className="input-group admin-search">
          <span className="input-group-text bg-white">
            <i className="bi bi-search" aria-hidden="true" />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre, correo o RUN..."
            aria-label="Buscar usuarios"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 admin-table">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">RUN</th>
              <th scope="col">Ubicación</th>
              <th scope="col">Perfil</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((u) => (
              <tr key={u.run}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <span className="avatar" aria-hidden="true">
                      {u.nombre[0]}
                      {u.apellidos[0]}
                    </span>
                    <div>
                      <strong className="d-block">
                        {u.nombre} {u.apellidos}
                      </strong>
                      <small className="text-body-secondary">{u.correo}</small>
                    </div>
                  </div>
                </td>
                <td>{u.run}</td>
                <td>
                  {u.comuna}, {u.region}
                </td>
                <td>
                  <span className={`badge rounded-pill ${PERFILES[u.tipoUsuario]}`}>
                    {u.tipoUsuario}
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
