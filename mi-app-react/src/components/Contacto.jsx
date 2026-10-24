import { useState } from 'react';
import useFormulario from '../useFormulario';
import { ENVIO_GRATIS, formatCLP } from '../formato';
import { OBLIGATORIO, errorCorreo } from '../validaciones';
import Banner from './Banner';
import Campo, { Feedback } from './Campo';

const DATOS = [
  ['bi-geo-alt', 'Visítanos', 'Av. Providencia 1234, local 5, Santiago'],
  ['bi-envelope', 'Escríbenos', 'contacto@luminahome.cl'],
  ['bi-telephone', 'Llámanos', '+56 2 2345 6789'],
  ['bi-clock', 'Horario', 'Lunes a sábado, 10:00 a 19:00'],
];

const PREGUNTAS = [
  [
    '¿Cuánto demora el despacho?',
    'Despachamos a todo Chile en 2 a 5 días hábiles. En la Región Metropolitana solemos entregar en 48 horas.',
  ],
  [
    '¿El despacho tiene costo?',
    `Es gratis en compras sobre ${formatCLP(ENVIO_GRATIS)}. Bajo ese monto, el costo se calcula al pagar según tu comuna.`,
  ],
  [
    '¿Los productos smart necesitan una app?',
    'Sí, funcionan con una app gratuita para Android e iOS y son compatibles con los principales asistentes de voz.',
  ],
  [
    '¿Puedo cambiar un producto?',
    'Tienes 10 días desde la recepción para cambios, siempre que el producto esté sin uso y en su embalaje original.',
  ],
];

const MAPA =
  'https://www.openstreetmap.org/export/embed.html?bbox=-70.6200%2C-33.4310%2C-70.6020%2C-33.4210&layer=mapnik&marker=-33.4263%2C-70.6111';

function validar({ nombre, correo, asunto, comentario }) {
  return {
    nombre: !nombre.trim() && OBLIGATORIO,
    correo: errorCorreo(correo),
    asunto: !asunto && 'Selecciona un motivo de consulta.',
    comentario: !comentario.trim() && OBLIGATORIO,
  };
}

export default function Contacto() {
  const { errores, feedback, setFeedback, onBlur, onSubmit } = useFormulario(validar);
  const [abierta, setAbierta] = useState(0);

  function enviar(datos, form) {
    form.reset();
    setFeedback({
      ok: true,
      texto: `¡Gracias, ${datos.nombre}! Te responderemos pronto.`,
    });
  }

  return (
    <>
      <Banner
        titulo="Contacto"
        imagen="/img/smart 2.jpg"
        texto="¿Tienes dudas sobre un producto o tu despacho? Escríbenos y te ayudamos."
      />
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-5">
          {DATOS.map(([icono, titulo, texto]) => (
            <div className="col" key={titulo}>
              <div className="card border-0 shadow-sm h-100 text-center hover-lift">
                <div className="card-body p-4">
                  <span className="icon-circle mb-3">
                    <i className={`bi ${icono}`} aria-hidden="true" />
                  </span>
                  <h2 className="h6 mb-1">{titulo}</h2>
                  <p className="text-body-secondary small mb-0">{texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-5 mb-5">
          <div className="col-lg-7">
            <form
              className="card border-0 shadow-sm h-100"
              noValidate
              onBlur={onBlur}
              onSubmit={onSubmit(enviar)}
            >
              <div className="card-body p-4 p-md-5">
                <p className="eyebrow mb-1">Conversemos</p>
                <h2 className="h3 mb-4">Formulario de contacto</h2>
                <Feedback feedback={feedback} />
                <div className="row g-3">
                  <Campo
                    id="contacto-nombre"
                    name="nombre"
                    label="Nombre completo"
                    className="col-md-6"
                    maxLength={100}
                    error={errores.nombre}
                  />
                  <Campo
                    id="contacto-correo"
                    name="correo"
                    type="email"
                    label="Correo"
                    className="col-md-6"
                    maxLength={100}
                    placeholder="tunombre@gmail.com"
                    hint="Solo @duoc.cl, @profesor.duoc.cl o @gmail.com."
                    error={errores.correo}
                  />
                  <Campo
                    id="contacto-asunto"
                    name="asunto"
                    as="select"
                    label="Motivo"
                    className="col-12"
                    defaultValue=""
                    error={errores.asunto}
                  >
                    <option value="" disabled>
                      Selecciona un motivo
                    </option>
                    <option>Consulta sobre un producto</option>
                    <option>Estado de mi despacho</option>
                    <option>Asesoría de iluminación</option>
                    <option>Otra consulta</option>
                  </Campo>
                  <Campo
                    id="contacto-comentario"
                    name="comentario"
                    as="textarea"
                    label="Comentario"
                    className="col-12"
                    rows={5}
                    maxLength={500}
                    placeholder="Cuéntanos en qué te ayudamos"
                    error={errores.comentario}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
                  <i className="bi bi-send me-2" aria-hidden="true" />
                  Enviar mensaje
                </button>
              </div>
            </form>
          </div>

          <div className="col-lg-5 d-flex flex-column gap-4">
            <div className="mapa ratio ratio-4x3">
              <iframe title="Mapa de la tienda Lumina Home en Providencia" src={MAPA} />
            </div>
            <div className="card border-0 promo-lateral flex-grow-1">
              <div className="card-body p-4">
                <i className="bi bi-whatsapp fs-2 text-primary" aria-hidden="true" />
                <p className="fw-semibold text-white mt-2 mb-1">
                  ¿Prefieres hablar ahora?
                </p>
                <p className="small mb-0">
                  Escríbenos al +56 9 8765 4321 y te responderemos durante el horario de
                  atención.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="row justify-content-center">
          <div className="col-lg-9">
            <p className="eyebrow text-center mb-1">Ayuda</p>
            <h2 className="text-center mb-4">Preguntas frecuentes</h2>
            <div className="accordion shadow-sm" id="preguntas">
              {PREGUNTAS.map(([pregunta, respuesta], indice) => (
                <div className="accordion-item" key={pregunta}>
                  <h3 className="accordion-header">
                    <button
                      type="button"
                      className={`accordion-button${abierta === indice ? '' : ' collapsed'}`}
                      aria-expanded={abierta === indice}
                      aria-controls={`respuesta-${indice}`}
                      onClick={() => setAbierta(abierta === indice ? null : indice)}
                    >
                      {pregunta}
                    </button>
                  </h3>
                  <div
                    id={`respuesta-${indice}`}
                    className={`accordion-collapse collapse${abierta === indice ? ' show' : ''}`}
                  >
                    <div className="accordion-body text-body-secondary">{respuesta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
