export default function PanelAuth({ imagen, titulo, texto, puntos, children }) {
  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          <div className="card border-0 shadow overflow-hidden">
            <div className="row g-0">
              <div
                className="col-lg-5 d-none d-lg-flex auth-lateral"
                style={{ backgroundImage: `url("${imagen}")` }}
              >
                <div className="auth-lateral-contenido p-5 mt-auto">
                  <span className="badge bg-primary mb-3">Lumina Home</span>
                  <h2 className="h3 text-white">{titulo}</h2>
                  <p>{texto}</p>
                  <ul className="list-unstyled d-grid gap-2 mb-0">
                    {puntos.map((punto) => (
                      <li key={punto}>
                        <i
                          className="bi bi-check-circle-fill text-primary me-2"
                          aria-hidden="true"
                        />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="card-body p-4 p-md-5">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
