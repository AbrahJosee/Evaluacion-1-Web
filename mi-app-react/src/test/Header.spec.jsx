import { screen, cleanup, fireEvent } from '@testing-library/react';
import { renderConRouter } from './utils';
import Header from '../components/Header';

describe('Componente Header', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra en el badge la cantidad de unidades del carrito', () => {
    renderConRouter(<Header unidades={5} />);

    const carrito = screen.getByRole('link', { name: 'Carrito, 5 productos' });

    expect(carrito.querySelector('.badge').textContent).toBe('5');
  });

  it('abre y cierra el menú móvil cambiando aria-expanded y la clase show', () => {
    const { container } = renderConRouter(<Header unidades={0} />);
    const boton = screen.getByRole('button', { name: 'Abrir o cerrar menú' });
    const menu = container.querySelector('#menu-principal');

    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('show')).toBeFalse();

    fireEvent.click(boton);
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    expect(menu.classList.contains('show')).toBeTrue();

    fireEvent.click(boton);
    expect(menu.classList.contains('show')).toBeFalse();
  });

  it('marca como activa la sección que corresponde a la ruta', () => {
    renderConRouter(<Header unidades={0} />, '/producto/LMP-001');

    const activo = screen.getByRole('link', { current: 'page' });

    expect(activo.textContent).toBe('Productos');
  });
});
