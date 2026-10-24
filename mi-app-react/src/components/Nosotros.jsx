import { Link } from 'react-router-dom';
import productos from '../data/productos.json';
import categorias from '../data/categorias.json';
import Banner from './Banner';
import Imagen from './Imagen';

const VALORES = [
  'Piezas seleccionadas por diseñadores de interiores',
  'Eficiencia energética en toda la iluminación',
  'Instalación simple y acompañamiento postventa',
];

const CIFRAS = [
  ['+1.200', 'clientes felices'],
  [productos.length, 'productos curados'],
  [categorias.length, 'categorías'],
  ['12', 'meses de garantía'],
];

const HISTORIA = [
  [
    '2022',
    'Nace la idea',
    'Un pequeño estudio de diseño comienza a seleccionar lámparas de autor.',
  ],
  [
    '2023',
    'Primera tienda',
    'Abrimos nuestro local en Providencia con piezas curadas a mano.',
  ],
  ['2024', 'Iluminación Smart', 'Sumamos ampolletas, tiras LED y paneles inteligentes.'],
  [
    '2026',
    'Tienda online',
    'Llevamos Lumina Home a todo Chile con despacho a domicilio.',
  ],
];

const EQUIPO = [
  {
    titulo: 'Diseño',
    icono: 'bi-palette',
    texto:
      'Seleccionamos cada pieza cuidando estética, materiales y eficiencia energética.',
  },
  {
    titulo: 'Producto',
    icono: 'bi-box-seam',
    texto:
      'Evaluamos calidad y facilidad de instalación antes de sumar algo al catálogo.',
  },
  {
    titulo: 'Atención al cliente',
    icono: 'bi-headset',
    texto: 'Te acompañamos en la compra y en el despacho de tus productos.',
  },
];

export default function Nosotros() {
  return (
    <>
      <Banner
        titulo="Nosotros"
        imagen="/img/adorno 2.jpg"
        texto="Diseño e iluminación con propósito para cada rincón de tu hogar."
      />
      <div className="container">
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <Imagen
              src="/img/techo 1.jpg"
              alt="Lámpara colgante iluminando un comedor"
              className="tone-hero ratio-4-3 imagen-redondeada"
            />
          </div>
          <div className="col-lg-6">
            <p className="eyebrow mb-1">Quiénes somos</p>
            <h2 className="mb-3">La luz correcta transforma un espacio</h2>
            <p className="text-body-secondary">
              Lumina Home es una tienda boutique especializada en lámparas inteligentes,
              iluminación LED minimalista y objetos decorativos, pensada para arquitectos,
              diseñadores de interiores y quienes recién arman su primer hogar.
            </p>
            <ul className="list-unstyled d-grid gap-2 mt-4">
              {VALORES.map((valor) => (
                <li key={valor}>
                  <i
                    className="bi bi-check-circle-fill text-primary me-2"
                    aria-hidden="true"
                  />
                  {valor}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stats-band row row-cols-2 row-cols-md-4 g-0 text-center py-4 mx-0 mb-5">
          {CIFRAS.map(([cifra, texto]) => (
            <div className="col py-3" key={texto}>
              <div className="stat-number">{cifra}</div>
              <div className="small text-uppercase">{texto}</div>
            </div>
          ))}
        </div>

        <section className="mb-5 py-3">
          <p className="eyebrow text-center mb-1">Nuestra historia</p>
          <h2 className="text-center mb-5">Cómo llegamos hasta aquí</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 linea-tiempo">
            {HISTORIA.map(([anio, titulo, texto]) => (
              <div className="col" key={anio}>
                <div className="hito">
                  <div className="anio">{anio}</div>
                  <h3 className="h5">{titulo}</h3>
                  <p className="text-body-secondary small mb-0">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <p className="eyebrow text-center mb-1">Nuestro equipo</p>
          <h2 className="text-center mb-4">Cómo trabajamos</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {EQUIPO.map((area) => (
              <div className="col" key={area.titulo}>
                <div className="card h-100 text-center border-0 shadow-sm hover-lift">
                  <div className="card-body p-4">
                    <span className="icon-circle mb-3">
                      <i className={`bi ${area.icono}`} aria-hidden="true" />
                    </span>
                    <h3 className="h5">{area.titulo}</h3>
                    <p className="text-body-secondary mb-0">{area.texto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-banner p-4 p-lg-5">
          <i className="bi bi-shop cta-icono" aria-hidden="true" />
          <div className="row align-items-center g-4 position-relative">
            <div className="col-lg-8">
              <h2 className="mb-2">Visita nuestra tienda</h2>
              <p className="mb-0 text-white-50">
                Av. Providencia 1234, local 5, Providencia. Lunes a sábado de 10:00 a
                19:00.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contacto" className="btn btn-primary btn-lg">
                <i className="bi bi-geo-alt me-2" aria-hidden="true" />
                Cómo llegar
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
