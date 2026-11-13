import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Admin from '../admin/Admin';

function iniciarSesion(correo, password) {
  fireEvent.change(document.getElementById('login-correo'), {
    target: { value: correo },
  });
  fireEvent.change(document.getElementById('login-password'), {
    target: { value: password },
  });
  fireEvent.submit(document.querySelector('form'));
}

describe('Panel de administración', () => {
  beforeEach(() => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    cleanup();
  });

  it('pide iniciar sesión y muestra el dashboard a un administrador', () => {
    render(<Admin />);
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeTruthy();

    iniciarSesion('ab.herreraa@duoc.cl', 'admin123');

    expect(screen.getByText('¡Bienvenido, Abraham!')).toBeTruthy();
    expect(screen.getByText('Productos publicados')).toBeTruthy();
  });

  it('no deja entrar a un usuario con perfil cliente', () => {
    render(<Admin />);

    iniciarSesion('camila.ibanez@gmail.com', 'cliente123');

    expect(screen.getByRole('alert').textContent).toContain('no tiene acceso');
    expect(screen.queryByText('Productos publicados')).toBeNull();
  });

  it('filtra la tabla de productos con el buscador', () => {
    render(<Admin />);
    iniciarSesion('ab.herreraa@duoc.cl', 'admin123');

    fireEvent.click(screen.getByRole('button', { name: 'Ver productos' }));
    expect(document.querySelectorAll('tbody tr').length).toBe(14);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar productos' }), {
      target: { value: 'SMT' },
    });

    expect(document.querySelectorAll('tbody tr').length).toBe(4);
  });

  it('busca usuarios por RUN y muestra su perfil', () => {
    render(<Admin />);
    iniciarSesion('ab.herreraa@duoc.cl', 'admin123');

    fireEvent.click(screen.getByRole('button', { name: 'Ver usuarios' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar usuarios' }), {
      target: { value: '179654326' },
    });

    const filas = document.querySelectorAll('tbody tr');
    expect(filas.length).toBe(1);
    expect(filas[0].textContent).toContain('vendedor');
  });

  it('entra directo si hay una sesión guardada y la borra al salir', () => {
    Storage.prototype.getItem.and.returnValue(
      JSON.stringify({ nombre: 'Matías', tipoUsuario: 'vendedor' }),
    );
    const borrar = spyOn(Storage.prototype, 'removeItem');
    render(<Admin />);
    expect(screen.getByText('¡Bienvenido, Matías!')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Salir' }));

    expect(borrar).toHaveBeenCalledWith('lumina_usuario');
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeTruthy();
  });
});
