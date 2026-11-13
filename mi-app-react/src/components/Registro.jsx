import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import regiones from '../data/regiones.json';
import useFormulario from '../useFormulario';
import { OBLIGATORIO, errorCorreo, esPasswordValida } from '../validaciones';
import Campo, { Feedback } from './Campo';
import PanelAuth from './PanelAuth';

function validar(datos) {
  return {
    nombreCompleto: !datos.nombreCompleto.trim() && OBLIGATORIO,
    correo: errorCorreo(datos.correo),
    password:
      !esPasswordValida(datos.password) &&
      'La contraseña debe tener entre 4 y 10 caracteres.',
    confirmarPassword: !datos.confirmarPassword
      ? 'Confirma tu contraseña.'
      : datos.confirmarPassword !== datos.password && 'Las contraseñas no coinciden.',
    region: !datos.region && 'Selecciona tu región.',
    comuna: !datos.comuna && 'Selecciona tu comuna.',
    direccion: !datos.direccion.trim() && 'La dirección es obligatoria para el despacho.',
    terminos: !datos.terminos && 'Debes aceptar los términos y condiciones.',
  };
}

export default function Registro() {
  const [region, setRegion] = useState('');
  const navigate = useNavigate();
  const { errores, feedback, setFeedback, onBlur, onSubmit } = useFormulario(validar);
  const comunas = regiones.find((r) => r.region === region)?.comunas ?? [];

  function registrar() {
    setFeedback({
      ok: true,
      texto: '¡Cuenta creada! Te llevamos al inicio de sesión...',
    });
    setTimeout(() => {
      navigate('/login');
    }, 1200);
  }

  return (
    <PanelAuth
      imagen="/img/adorno 1.jpg"
      titulo="Únete a Lumina Home"
      texto="Crea tu cuenta y transforma tu hogar con la luz correcta."
      puntos={[
        'Compra en pocos clics',
        'Guarda tus direcciones',
        'Recibe novedades y ofertas',
      ]}
    >
      <form noValidate onBlur={onBlur} onSubmit={onSubmit(registrar)}>
        <div>
          <div className="text-center mb-4">
            <span className="auth-icon">
              <i className="bi bi-person-plus" aria-hidden="true" />
            </span>
            <h1 className="h3 mt-3 mb-1">Registro de usuario</h1>
            <p className="text-body-secondary small mb-0">
              Crea tu cuenta para comprar en Lumina Home.
            </p>
          </div>
          <Feedback feedback={feedback} />

          <div className="row g-3">
            <Campo
              id="nombreCompleto"
              name="nombreCompleto"
              label="Nombre completo"
              className="col-12"
              maxLength={150}
              placeholder="Ej: María Pérez Soto"
              error={errores.nombreCompleto}
            />
            <Campo
              id="registro-correo"
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
              id="telefono"
              name="telefono"
              type="tel"
              label="Teléfono (opcional)"
              className="col-md-6"
              placeholder="+56 9 1234 5678"
            />
            <Campo
              id="registro-password"
              name="password"
              type="password"
              label="Contraseña"
              className="col-md-6"
              placeholder="4 a 10 caracteres"
              autoComplete="new-password"
              error={errores.password}
            />
            <Campo
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              label="Confirmar contraseña"
              className="col-md-6"
              autoComplete="new-password"
              error={errores.confirmarPassword}
            />
            <Campo
              id="region"
              name="region"
              as="select"
              label="Región"
              className="col-md-6"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              error={errores.region}
            >
              <option value="">-- Seleccione la región --</option>
              {regiones.map((r) => (
                <option key={r.region} value={r.region}>
                  {r.region}
                </option>
              ))}
            </Campo>
            <Campo
              key={region}
              id="comuna"
              name="comuna"
              as="select"
              label="Comuna"
              className="col-md-6"
              defaultValue=""
              disabled={!region}
              error={errores.comuna}
            >
              <option value="">-- Seleccione la comuna --</option>
              {comunas.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </Campo>
            <Campo
              id="direccion"
              name="direccion"
              label="Dirección"
              className="col-12"
              maxLength={300}
              placeholder="Calle, número, depto/casa"
              hint="Requerida para el despacho de productos frágiles a todo Chile."
              error={errores.direccion}
            />
            <div className="col-12">
              <div className="form-check">
                <input
                  className={`form-check-input${errores.terminos ? ' is-invalid' : ''}`}
                  type="checkbox"
                  id="terminos"
                  name="terminos"
                />
                <label className="form-check-label" htmlFor="terminos">
                  Acepto los términos y condiciones
                </label>
                <div className="invalid-feedback">{errores.terminos}</div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
            Crear cuenta
          </button>
          <p className="text-center small mt-3 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </form>
    </PanelAuth>
  );
}
