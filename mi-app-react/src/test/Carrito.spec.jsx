import { screen, cleanup, fireEvent } from '@testing-library/react';
import { renderConRouter } from './utils';
import Carrito from '../components/Carrito';

const CARRITO = [
  { codigo: 'LMP-001', cantidad: 2 },
  { codigo: 'SMT-003', cantidad: 1 },
];

describe('Componente Carrito', () => {
  afterEach(() => {
    cleanup();
  });

  it('muestra un mensaje cuando el carrito está vacío', () => {
    renderConRouter(<Carrito carrito={[]} onCambiar={() => {}} avisar={() => {}} />);

    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
  });

  it('calcula el subtotal y el total multiplicando precio por cantidad', () => {
    const { container } = renderConRouter(
      <Carrito carrito={CARRITO} onCambiar={() => {}} avisar={() => {}} />,
    );

    expect(container.querySelector('.resumen-subtotal').textContent).toBe('$101.970');
    expect(container.querySelector('.resumen-total').textContent).toBe('$101.970');
  });

  it('elimina una línea llamando a onCambiar con cantidad 0', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    renderConRouter(
      <Carrito carrito={CARRITO} onCambiar={onCambiar} avisar={() => {}} />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);

    expect(onCambiar).toHaveBeenCalledWith('LMP-001', 0);
  });

  it('no permite sumar más unidades que el stock disponible', () => {
    const onCambiar = jasmine.createSpy('onCambiar');
    renderConRouter(
      <Carrito
        carrito={[{ codigo: 'LMP-003', cantidad: 3 }]}
        onCambiar={onCambiar}
        avisar={() => {}}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Sumar Araña Moderna Cristal Line' }),
    );

    expect(onCambiar).toHaveBeenCalledWith('LMP-003', 3);
  });

  it('indica cuánto falta para el despacho gratis y cuándo se alcanza', () => {
    const { rerender } = renderConRouter(
      <Carrito
        carrito={[{ codigo: 'SMT-003', cantidad: 1 }]}
        onCambiar={() => {}}
        avisar={() => {}}
      />,
    );
    expect(screen.getByText('$40.010')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('20');

    rerender(<Carrito carrito={CARRITO} onCambiar={() => {}} avisar={() => {}} />);

    expect(screen.getByText('despacho gratis')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
  });

  it('usa avisar para informar el resultado del pago simulado', () => {
    const avisar = jasmine.createSpy('avisar');
    renderConRouter(<Carrito carrito={CARRITO} onCambiar={() => {}} avisar={avisar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(avisar).toHaveBeenCalledWith('Pago simulado: ¡gracias por tu compra!');
  });

  it('sugiere productos que no están en el carrito y permite añadirlos', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderConRouter(
      <Carrito
        carrito={[{ codigo: 'LMP-001', cantidad: 1 }]}
        onCambiar={() => {}}
        onAgregar={onAgregar}
        avisar={() => {}}
      />,
    );

    const sugeridos = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    fireEvent.click(screen.getAllByRole('button', { name: 'Añadir' })[0]);

    expect(sugeridos.length).toBe(4);
    expect(sugeridos).not.toContain('Lámpara Colgante Nordic Oak');
    expect(onAgregar).toHaveBeenCalledWith('LMP-002', 1);
  });
});
