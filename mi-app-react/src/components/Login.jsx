import usuarios from '../data/usuarios.json';
import useFormulario from '../useFormulario';
import { errorCorreo, esPasswordValida } from '../validaciones';
import Campo, { Feedback } from './Campo';
import PanelAuth from './PanelAuth';

const INCORRECTO = 'Correo o contraseña incorrectos.';

function validar({ correo, password }) {
  return {
    correo: errorCorreo(correo),
    password:
      !esPasswordValida(password) && 'La contraseña debe tener entre 4 y 10 caracteres.',
  };
}

export default function Login({ onLogin }) {
  const { errores, setErrores, feedback, setFeedback, onBlur, onSubmit } =
    useFormulario(validar);

  function entrar({ correo, password }) {
    const usuario = usuarios.find(
      (u) =>
        u.correo.toLowerCase() === correo.trim().toLowerCase() && u.password === password,
    );
    if (!usuario) {
      setErrores({ password: INCORRECTO });
      setFeedback({ ok: false, texto: INCORRECTO });
      return;
    }
    if (onLogin(usuario) === false) {
      setFeedback({ ok: false, texto: 'Tu perfil no tiene acceso a esta sección.' });
      return;
    }
    sessionStorage.setItem('lumina_usuario', JSON.stringify(usuario));
    setFeedback({ ok: true, texto: 'Inicio de sesión correcto.' });
  }

  return (
    <PanelAuth
      imagen="/img/techo 2.jpg"
      titulo="Bienvenido de vuelta"
      texto="Ingresa para revisar tus pedidos y comprar más rápido."
      puntos={[
        'Seguimiento de tus compras',
        'Ofertas exclusivas',
        'Despacho a todo Chile',
      ]}
    >
      <div className="text-center mb-4">
        <span className="auth-icon">
          <i className="bi bi-lightbulb-fill" aria-hidden="true" />
        </span>
        <h1 className="h3 mt-3 mb-1">Inicio de sesión</h1>
        <p className="text-body-secondary small mb-0">
          Ingresa con tu cuenta de Lumina Home
        </p>
      </div>
      <form noValidate onBlur={onBlur} onSubmit={onSubmit(entrar)}>
        <Feedback feedback={feedback} />
        <Campo
          id="login-correo"
          name="correo"
          type="email"
          label="Correo"
          maxLength={100}
          placeholder="tunombre@gmail.com"
          autoComplete="username"
          hint="Solo @duoc.cl, @profesor.duoc.cl o @gmail.com."
          error={errores.correo}
        />
        <Campo
          id="login-password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="4 a 10 caracteres"
          autoComplete="current-password"
          error={errores.password}
        />
        <button type="submit" className="btn btn-primary btn-lg w-100">
          Iniciar sesión
        </button>
        <p className="text-center small mt-3 mb-0">
          ¿Aún no tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </PanelAuth>
  );
}
