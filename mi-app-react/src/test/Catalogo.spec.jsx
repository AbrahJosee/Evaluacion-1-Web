import { screen, cleanup, fireEvent } from '@testing-library/react';
import { renderConRouter } from './utils';
import Catalogo from '../components/Catalogo';

function nombresVisibles() {
  return screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
}

describe('Componente Catalogo', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra 9 productos por página y pagina el resto', () => {
    renderConRouter(
      <Catalogo categoria="" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    expect(nombresVisibles().length).toBe(9);
    expect(screen.getByText('Mostrando 1–9 de 14 productos')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }));

    expect(nombresVisibles().length).toBe(5);
    expect(screen.getByRole('button', { name: 'Página siguiente' }).disabled).toBeTrue();
  });

  it('filtra por precio máximo y permite quitar el filtro desde su chip', () => {
    renderConRouter(
      <Catalogo categoria="" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    fireEvent.change(screen.getByRole('slider', { name: 'Precio máximo' }), {
      target: { value: '10000' },
    });

    expect(nombresVisibles()).toEqual([
      'Enchufe Inteligente con Dimmer',
      'Foco Solar Jardín Pathway',
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Quitar filtro Hasta $10.000' }));

    expect(screen.getByText('Mostrando 1–9 de 14 productos')).toBeTruthy();
  });

  it('muestra cuántos productos tiene cada categoría', () => {
    renderConRouter(
      <Catalogo categoria="" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    const smart = screen.getByRole('button', { name: 'Iluminación Smart' });

    expect(smart.querySelector('.badge').textContent).toBe('4');
  });

  it('muestra solo los productos de la categoría recibida por props', () => {
    renderConRouter(
      <Catalogo categoria="smart" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    expect(nombresVisibles().length).toBe(4);
    expect(screen.queryByRole('navigation', { name: 'Páginas del catálogo' })).toBeNull();
  });

  it('avisa al componente padre cuando se elige un filtro', () => {
    const onCategoria = jasmine.createSpy('onCategoria');
    renderConRouter(
      <Catalogo categoria="" onCategoria={onCategoria} onAgregar={() => {}} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Iluminación Exterior' }));

    expect(onCategoria).toHaveBeenCalledWith('exterior');
  });

  it('filtra por texto con el buscador', () => {
    renderConRouter(
      <Catalogo categoria="" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar productos' }), {
      target: { value: 'farol' },
    });

    expect(nombresVisibles()).toEqual(['Farol Exterior Minimalista']);
  });

  it('ordena por precio de menor a mayor', () => {
    renderConRouter(
      <Catalogo categoria="" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Ordenar productos' }), {
      target: { value: 'precio-asc' },
    });

    expect(nombresVisibles()[0]).toBe('Foco Solar Jardín Pathway');
  });

  it('muestra un mensaje cuando ningún producto coincide', () => {
    renderConRouter(
      <Catalogo categoria="" onCategoria={() => {}} onAgregar={() => {}} />,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar productos' }), {
      target: { value: 'xyz' },
    });

    expect(screen.getByText('No encontramos productos con esos filtros.')).toBeTruthy();
    expect(screen.queryAllByRole('heading', { level: 3 }).length).toBe(0);
  });
});
