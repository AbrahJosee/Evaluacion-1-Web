import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import { renderConRouter } from './utils';
import App from '../App';

function badge() {
  return document.querySelector('.carrito-badge').textContent;
}

describe('Componente App', () => {
  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    cleanup();
    jasmine.clock().uninstall();
  });

  it('recupera el carrito guardado en localStorage al iniciar', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(
      JSON.stringify([{ codigo: 'LMP-001', cantidad: 3 }]),
    );

    renderConRouter(<App />);

    expect(badge()).toBe('3');
  });

  it('agrega productos al carrito y guarda el cambio en localStorage', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    const guardar = spyOn(Storage.prototype, 'setItem');
    renderConRouter(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0]);

    expect(badge()).toBe('1');
    expect(guardar).toHaveBeenCalledWith(
      'lumina_carrito',
      JSON.stringify([{ codigo: 'LMP-001', cantidad: 1 }]),
    );
  });

  it('muestra el toast al añadir y lo oculta después de 2,4 segundos', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    const { container } = renderConRouter(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0]);
    const toast = container.querySelector('.toast');
    expect(toast.classList.contains('show')).toBeTrue();
    expect(toast.textContent).toContain('Producto añadido al carrito');

    act(() => jasmine.clock().tick(2400));

    expect(toast.classList.contains('show')).toBeFalse();
  });

  it('cambia de página al hacer clic en el menú', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    renderConRouter(<App />);
    expect(document.querySelector('.hero-carousel')).not.toBeNull();

    fireEvent.click(screen.getByRole('link', { name: 'Productos' }));

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Productos');
    expect(document.querySelector('.hero-carousel')).toBeNull();
  });

  it('abre el detalle del producto que indica la URL', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);

    renderConRouter(<App />, '/producto/EXT-002');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Farol Exterior Minimalista',
    );
  });

  it('vuelve al inicio si la ruta no existe', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);

    renderConRouter(<App />, '/no-existe');

    expect(document.querySelector('.hero-carousel')).not.toBeNull();
  });

  it('abre el artículo del blog que indica la URL', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);

    renderConRouter(<App />, '/blog/temperatura-luz-descanso');

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'temperatura de luz',
    );
  });

  it('parte con el carrito vacío si lo guardado está corrupto', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue('esto no es JSON');

    renderConRouter(<App />);

    expect(badge()).toBe('0');
  });

  it('cambia cantidades y elimina productos desde la página del carrito', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(
      JSON.stringify([{ codigo: 'LMP-001', cantidad: 1 }]),
    );
    renderConRouter(<App />, '/carrito');

    fireEvent.click(
      screen.getByRole('button', { name: 'Sumar Lámpara Colgante Nordic Oak' }),
    );
    expect(badge()).toBe('2');

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(badge()).toBe('0');
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
  });

  it('cierra el toast con su botón', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    const { container } = renderConRouter(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }));

    expect(container.querySelector('.toast').classList.contains('show')).toBeFalse();
  });

  it('saluda al cliente y lo lleva al inicio después de iniciar sesión', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    spyOn(Storage.prototype, 'setItem');
    const { container } = renderConRouter(<App />, '/login');

    fireEvent.change(document.getElementById('login-correo'), {
      target: { value: 'camila.ibanez@gmail.com' },
    });
    fireEvent.change(document.getElementById('login-password'), {
      target: { value: 'cliente123' },
    });
    fireEvent.submit(document.querySelector('form'));

    expect(document.querySelector('.hero-carousel')).not.toBeNull();
    expect(container.querySelector('.toast').textContent).toContain('¡Hola, Camila!');
  });
});
