import Producto from './Producto';

export default function ListaProductos({
  productos,
  onAgregar,
  columnas = 'row-cols-lg-4',
}) {
  return (
    <div className={`row row-cols-1 row-cols-sm-2 ${columnas} g-4`}>
      {productos.map((producto) => (
        <div className="col" key={producto.codigo}>
          <Producto {...producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
