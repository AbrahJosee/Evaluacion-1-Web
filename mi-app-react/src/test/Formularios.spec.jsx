import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderConRouter } from './utils';
import Contacto from '../components/Contacto';
import Login from '../components/Login';
import Registro from '../components/Registro';

function llenar(id, valor) {
  fireEvent.change(document.getElementById(id), { target: { value: valor } });
}

function enviar() {
  fireEvent.submit(document.querySelector('form'));
}

describe('Formulario de Contacto', () => {
  afterEach(() => {
    cleanup();
  });

  it('marca los cuatro campos obligatorios al enviar vacío', () => {
    const { container } = renderConRouter(<Contacto />);

    enviar();

    expect(container.querySelectorAll('.is-invalid').length).toBe(4);
    expect(screen.getByRole('alert').classList.contains('alert-danger')).toBeTrue();
  });

  it('rechaza correos que no son de duoc.cl o gmail.com al salir del campo', () => {
    renderConRouter(<Contacto />);
    const correo = document.getElementById('contacto-correo');

    llenar('contacto-correo', 'ana@hotmail.com');
    fireEvent.blur(correo);

    expect(correo.classList.contains('is-invalid')).toBeTrue();
    expect(
      screen.getByText('Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'),
    ).toBeTruthy();
  });

  it('muestra la confirmación y limpia el formulario cuando los datos son válidos', () => {
    renderConRouter(<Contacto />);

    llenar('contacto-nombre', 'Ana');
    llenar('contacto-correo', 'ana@gmail.com');
    llenar('contacto-asunto', 'Asesoría de iluminación');
    llenar('contacto-comentario', 'Quiero iluminar mi living');
    enviar();

    expect(screen.getByRole('alert').textContent).toContain('¡Gracias, Ana!');
    expect(document.getElementById('contacto-nombre').value).toBe('');
  });

  it('abre una sola pregunta frecuente a la vez en el acordeón', () => {
    renderConRouter(<Contacto />);
    const primera = screen.getByRole('button', { name: '¿Cuánto demora el despacho?' });
    const cuarta = screen.getByRole('button', { name: '¿Puedo cambiar un producto?' });
    expect(primera.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(cuarta);

    expect(primera.getAttribute('aria-expanded')).toBe('false');
    expect(cuarta.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('respuesta-3').classList.contains('show')).toBeTrue();
  });
});

describe('Formulario de Login', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra un error con credenciales incorrectas y no llama a onLogin', () => {
    const onLogin = jasmine.createSpy('onLogin');
    renderConRouter(<Login onLogin={onLogin} />);

    llenar('login-correo', 'ab.herreraa@duoc.cl');
    llenar('login-password', 'otra123');
    enviar();

    expect(onLogin).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(
      'Correo o contraseña incorrectos.',
    );
  });

  it('llama a onLogin con el usuario y guarda la sesión en sessionStorage', () => {
    const onLogin = jasmine.createSpy('onLogin');
    const guardar = spyOn(Storage.prototype, 'setItem');
    renderConRouter(<Login onLogin={onLogin} />);

    llenar('login-correo', 'ab.herreraa@duoc.cl');
    llenar('login-password', 'admin123');
    enviar();

    expect(onLogin).toHaveBeenCalledWith(
      jasmine.objectContaining({ correo: 'ab.herreraa@duoc.cl' }),
    );
    expect(guardar).toHaveBeenCalledWith('lumina_usuario', jasmine.any(String));
    expect(screen.getByRole('alert').classList.contains('alert-success')).toBeTrue();
  });

  it('informa cuando el componente padre rechaza el perfil', () => {
    const onLogin = jasmine.createSpy('onLogin').and.returnValue(false);
    renderConRouter(<Login onLogin={onLogin} />);

    llenar('login-correo', 'ab.herreraa@duoc.cl');
    llenar('login-password', 'admin123');
    enviar();

    expect(screen.getByRole('alert').textContent).toContain('no tiene acceso');
  });
});

describe('Formulario de Registro', () => {
  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    cleanup();
    jasmine.clock().uninstall();
  });

  it('carga las comunas de la región elegida y habilita su selector', () => {
    renderConRouter(<Registro />);
    const comuna = () => document.getElementById('comuna');
    expect(comuna().disabled).toBeTrue();

    llenar('region', 'Biobío');

    expect(comuna().disabled).toBeFalse();
    expect(comuna().options.length).toBe(11);
    expect(screen.getByRole('option', { name: 'Concepción' })).toBeTruthy();
  });

  it('avisa cuando las contraseñas no coinciden', () => {
    renderConRouter(<Registro />);

    llenar('registro-password', 'clave1');
    llenar('confirmarPassword', 'clave2');
    enviar();

    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy();
    expect(screen.getByText('Debes aceptar los términos y condiciones.')).toBeTruthy();
  });

  it('con datos válidos confirma y redirige al login tras 1,2 segundos', () => {
    render(
      <MemoryRouter initialEntries={['/registro']}>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </MemoryRouter>,
    );

    llenar('nombreCompleto', 'María Pérez');
    llenar('registro-correo', 'maria@gmail.com');
    llenar('registro-password', 'clave1');
    llenar('confirmarPassword', 'clave1');
    llenar('region', 'Biobío');
    llenar('comuna', 'Concepción');
    llenar('direccion', 'Los Carrera 123');
    fireEvent.click(document.getElementById('terminos'));
    enviar();

    expect(screen.getByRole('alert').classList.contains('alert-success')).toBeTrue();
    expect(screen.queryByText('Pantalla de login')).toBeNull();

    act(() => jasmine.clock().tick(1200));

    expect(screen.getByText('Pantalla de login')).toBeTruthy();
  });
});
