import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import { renderConRouter } from './utils';
import Portada, { INTERVALO } from '../components/Portada';

function diapositivaActiva(container) {
  return container.querySelector('.carousel-item.active h2').textContent;
}

describe('Componente Portada (carrusel)', () => {
  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    cleanup();
    jasmine.clock().uninstall();
  });

  it('comienza mostrando la primera diapositiva', () => {
    const { container } = renderConRouter(<Portada onCategoria={() => {}} />);

    expect(container.querySelectorAll('.carousel-item.active').length).toBe(1);
    expect(diapositivaActiva(container)).toBe('Ilumina cada rincón de tu hogar');
  });

  it('avanza sola a la siguiente diapositiva cuando pasa el intervalo', () => {
    const { container } = renderConRouter(<Portada onCategoria={() => {}} />);

    act(() => jasmine.clock().tick(INTERVALO));

    expect(diapositivaActiva(container)).toBe('Controla tu luz desde el celular');
  });

  it('cambia de diapositiva con los indicadores y las flechas', () => {
    const { container } = renderConRouter(<Portada onCategoria={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ir a la diapositiva 3' }));
    expect(diapositivaActiva(container)).toBe('Lleva el diseño a tu terraza');

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(diapositivaActiva(container)).toBe('Ilumina cada rincón de tu hogar');

    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(diapositivaActiva(container)).toBe('Lleva el diseño a tu terraza');
  });

  it('envía la categoría de la diapositiva al pulsar su botón', () => {
    const onCategoria = jasmine.createSpy('onCategoria');
    renderConRouter(<Portada onCategoria={onCategoria} />);

    fireEvent.click(screen.getByText('Explorar Smart'));

    expect(onCategoria).toHaveBeenCalledWith('smart');
  });
});
