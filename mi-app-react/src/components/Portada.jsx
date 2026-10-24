import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DIAPOSITIVAS = [
  {
    imagen: '/img/techo 3.jpg',
    etiqueta: 'Nueva colección',
    titulo: 'Ilumina cada rincón de tu hogar',
    texto:
      'Lámparas inteligentes, iluminación LED minimalista y objetos decorativos, pensados por diseñadores.',
    categoria: '',
    boton: 'Ver productos',
  },
  {
    imagen: '/img/smart 4.jpg',
    etiqueta: 'Iluminación Smart',
    titulo: 'Controla tu luz desde el celular',
    texto: 'Ampolletas, tiras LED y paneles compatibles con asistentes de voz.',
    categoria: 'smart',
    boton: 'Explorar Smart',
  },
  {
    imagen: '/img/exterior 3.jpg',
    etiqueta: 'Exterior',
    titulo: 'Lleva el diseño a tu terraza',
    texto: 'Faroles, guirnaldas y focos solares resistentes a la intemperie.',
    categoria: 'exterior',
    boton: 'Ver exterior',
  },
];

export const INTERVALO = 5000;

export default function Portada({ onCategoria }) {
  const [activa, setActiva] = useState(0);
  const total = DIAPOSITIVAS.length;

  useEffect(() => {
    const temporizador = setInterval(() => setActiva((a) => (a + 1) % total), INTERVALO);
    return () => clearInterval(temporizador);
  }, [activa, total]);

  function mover(paso) {
    setActiva((a) => (a + paso + total) % total);
  }

  return (
    <section
      className="carousel hero-carousel"
      aria-roledescription="carrusel"
      aria-label="Destacados de la tienda"
    >
      <div className="carousel-indicators">
        {DIAPOSITIVAS.map((d, indice) => (
          <button
            key={d.titulo}
            type="button"
            className={indice === activa ? 'active' : undefined}
            aria-current={indice === activa ? 'true' : undefined}
            aria-label={`Ir a la diapositiva ${indice + 1}`}
            onClick={() => setActiva(indice)}
          />
        ))}
      </div>

      <div className="carousel-inner">
        {DIAPOSITIVAS.map((d, indice) => (
          <div
            key={d.titulo}
            className={`carousel-item${indice === activa ? ' active' : ''}`}
            aria-hidden={indice !== activa}
          >
            <img src={d.imagen} className="d-block w-100 hero-img" alt="" />
            <div className="carousel-caption text-start">
              <div className="container">
                <div className="hero-copy">
                  <span className="badge bg-primary mb-3 px-3 py-2">{d.etiqueta}</span>
                  <h2 className="mb-3">{d.titulo}</h2>
                  <p className="lead d-none d-md-block mb-4">{d.texto}</p>
                  <Link
                    to="/productos"
                    className="btn btn-primary btn-lg"
                    tabIndex={indice === activa ? undefined : -1}
                    onClick={() => onCategoria(d.categoria)}
                  >
                    {d.boton}
                    <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev d-none d-md-flex"
        type="button"
        onClick={() => mover(-1)}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Anterior</span>
      </button>
      <button
        className="carousel-control-next d-none d-md-flex"
        type="button"
        onClick={() => mover(1)}
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Siguiente</span>
      </button>
    </section>
  );
}
