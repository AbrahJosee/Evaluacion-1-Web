import { screen, cleanup, fireEvent } from '@testing-library/react';
import { renderConRouter } from './utils';
import Producto from '../components/Producto';

const PRODUCTO = {
  codigo: 'LMP-001',
  nombre: 'Lámpara Colgante Nordic Oak',
  categoria: 'techo',
  precio: 45990,
  imagen: '/img/techo 1.jpg',
  stock: 14,
  stockCritico: 3,
};

describe('Componente Producto', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra el nombre del producto como título', () => {
    renderConRouter(<Producto {...PRODUCTO} onAgregar={() => {}} />);

    const titulo = screen.getByRole('heading', { name: PRODUCTO.nombre });

    expect(titulo.textContent).toBe(PRODUCTO.nombre);
  });

  it('muestra el precio en pesos chilenos y el nombre de la categoría', () => {
    renderConRouter(<Producto {...PRODUCTO} onAgregar={() => {}} />);

    expect(screen.getByText('$45.990')).toBeTruthy();
    expect(screen.getByText('Lámparas de Techo')).toBeTruthy();
  });

  it('llama a onAgregar con el código y una unidad al pulsar Añadir', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderConRouter(<Producto {...PRODUCTO} onAgregar={onAgregar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));

    expect(onAgregar).toHaveBeenCalledOnceWith('LMP-001', 1);
  });

  it('muestra el ícono de reemplazo cuando la imagen falla', () => {
    const { container } = renderConRouter(
      <Producto {...PRODUCTO} onAgregar={() => {}} />,
    );

    fireEvent.error(container.querySelector('img'));

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.ph-img .bi-lightbulb')).not.toBeNull();
  });

  it('muestra el aviso de últimas unidades solo con stock crítico', () => {
    const { rerender } = renderConRouter(<Producto {...PRODUCTO} onAgregar={() => {}} />);
    expect(screen.queryByText('¡Últimas unidades!')).toBeNull();

    rerender(<Producto {...PRODUCTO} stock={2} onAgregar={() => {}} />);

    expect(screen.getByText('¡Últimas unidades!')).toBeTruthy();
  });

  it('enlaza la tarjeta con la página de detalle del producto', () => {
    renderConRouter(<Producto {...PRODUCTO} onAgregar={() => {}} />);

    const enlaces = screen.getAllByRole('link', { name: PRODUCTO.nombre });

    expect(enlaces.length).toBe(2);
    enlaces.forEach((enlace) => {
      expect(enlace.getAttribute('href')).toBe('/producto/LMP-001');
    });
  });
});
