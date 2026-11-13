import { screen, cleanup, fireEvent } from '@testing-library/react';
import { renderConRouter } from './utils';
import DetalleProducto from '../components/DetalleProducto';
import Blogs from '../components/Blogs';
import DetalleBlog from '../components/DetalleBlog';
import Footer from '../components/Footer';
import Nosotros from '../components/Nosotros';

describe('Página DetalleProducto', () => {
  afterEach(() => {
    cleanup();
  });

  it('no deja elegir más unidades que el stock y envía la cantidad elegida', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderConRouter(<DetalleProducto codigo="LMP-003" onAgregar={onAgregar} />);
    const sumar = screen.getByRole('button', { name: 'Sumar' });

    fireEvent.click(sumar);
    fireEvent.click(sumar);
    fireEvent.click(sumar);
    fireEvent.click(screen.getByRole('button', { name: 'Restar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }));

    expect(screen.getByRole('spinbutton', { name: 'Cantidad' }).value).toBe('2');
    expect(onAgregar).toHaveBeenCalledWith('LMP-003', 2);
  });

  it('cambia el contenido al seleccionar otra pestaña', () => {
    renderConRouter(<DetalleProducto codigo="LMP-001" onAgregar={() => {}} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Garantía' }));

    expect(
      screen.getByRole('tab', { name: 'Garantía' }).getAttribute('aria-selected'),
    ).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toContain('12 meses');
  });

  it('muestra el stock bajo y los productos relacionados de la misma categoría', () => {
    renderConRouter(<DetalleProducto codigo="LMP-003" onAgregar={() => {}} />);

    expect(screen.getByText('Stock bajo: quedan 3 unidades')).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(3);
  });

  it('muestra un mensaje si el código no existe', () => {
    renderConRouter(<DetalleProducto codigo="NO-EXISTE" onAgregar={() => {}} />);

    expect(screen.getByText('Producto no encontrado.')).toBeTruthy();
  });
});

describe('Páginas de Blogs', () => {
  afterEach(() => {
    cleanup();
  });

  it('lista los artículos con enlace a su detalle', () => {
    renderConRouter(<Blogs />);

    const enlaces = screen.getAllByRole('link', { name: /Leer artículo/ });

    expect(enlaces.length).toBe(2);
    expect(enlaces[0].getAttribute('href')).toBe('/blog/temperatura-luz-descanso');
  });

  it('muestra el artículo completo o un aviso si no existe', () => {
    const { rerender } = renderConRouter(
      <DetalleBlog id="tendencias-iluminacion-minimalista" />,
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'iluminación minimalista',
    );

    rerender(<DetalleBlog id="otro" />);

    expect(screen.getByText('Artículo no encontrado.')).toBeTruthy();
  });
});

describe('Footer y Nosotros', () => {
  afterEach(() => {
    cleanup();
  });

  it('confirma la suscripción al boletín y filtra por categoría', () => {
    const avisar = jasmine.createSpy('avisar');
    const onCategoria = jasmine.createSpy('onCategoria');
    renderConRouter(<Footer onCategoria={onCategoria} avisar={avisar} />);

    fireEvent.submit(
      screen.getByRole('textbox', { name: 'Correo para el boletín' }).closest('form'),
    );
    fireEvent.click(screen.getByRole('link', { name: 'Iluminación Smart' }));

    expect(avisar).toHaveBeenCalledWith('¡Gracias por suscribirte!');
    expect(onCategoria).toHaveBeenCalledWith('smart');
  });

  it('calcula las cifras de Nosotros a partir de los datos', () => {
    renderConRouter(<Nosotros />);

    expect(screen.getByText('productos curados').previousSibling.textContent).toBe('14');
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(7);
    expect(screen.getByText('2026')).toBeTruthy();
  });

  it('muestra el tiempo de lectura de cada artículo', () => {
    renderConRouter(<Blogs />);

    expect(screen.getAllByText(/min de lectura/).length).toBe(2);
  });
});
