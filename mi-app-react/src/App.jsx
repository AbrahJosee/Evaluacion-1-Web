import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Header from './components/Header';
import Inicio from './components/Inicio';
import Catalogo from './components/Catalogo';
import Nosotros from './components/Nosotros';
import Blogs from './components/Blogs';
import Contacto from './components/Contacto';
import Footer from './components/Footer';
import DetalleProducto from './components/DetalleProducto';
import DetalleBlog from './components/DetalleBlog';
import Carrito from './components/Carrito';
import Login from './components/Login';
import Registro from './components/Registro';
import './App.css';

const CLAVE_CARRITO = 'lumina_carrito';

function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) ?? [];
  } catch {
    return [];
  }
}

function PaginaProducto({ onAgregar }) {
  const { codigo } = useParams();
  return <DetalleProducto key={codigo} codigo={codigo} onAgregar={onAgregar} />;
}

function PaginaBlog() {
  const { id } = useParams();
  return <DetalleBlog id={id} />;
}

export default function App() {
  const [carrito, setCarrito] = useState(leerCarrito);
  const [categoria, setCategoria] = useState('');
  const [toast, setToast] = useState({ texto: '', visible: false });
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (!toast.visible) return;
    const temporizador = setTimeout(
      () => setToast((actual) => ({ ...actual, visible: false })),
      2400,
    );
    return () => clearTimeout(temporizador);
  }, [toast]);

  function avisar(texto) {
    setToast({ texto, visible: true });
  }

  function agregar(codigo, cantidad = 1) {
    setCarrito((actual) =>
      actual.some((item) => item.codigo === codigo)
        ? actual.map((item) =>
            item.codigo === codigo
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item,
          )
        : [...actual, { codigo, cantidad }],
    );
    avisar('Producto añadido al carrito');
  }

  function cambiarCantidad(codigo, cantidad) {
    setCarrito((actual) =>
      cantidad > 0
        ? actual.map((item) => (item.codigo === codigo ? { ...item, cantidad } : item))
        : actual.filter((item) => item.codigo !== codigo),
    );
  }

  function entrar(usuario) {
    if (usuario.tipoUsuario === 'cliente') {
      avisar(`¡Hola, ${usuario.nombre}!`);
      navigate('/');
    } else {
      window.location.href = '/admin.html';
    }
  }

  return (
    <>
      <Header unidades={carrito.reduce((total, item) => total + item.cantidad, 0)} />
      <main id="contenido">
        <Routes>
          <Route
            path="/"
            element={<Inicio onCategoria={setCategoria} onAgregar={agregar} />}
          />
          <Route
            path="/productos"
            element={
              <Catalogo
                categoria={categoria}
                onCategoria={setCategoria}
                onAgregar={agregar}
              />
            }
          />
          <Route
            path="/producto/:codigo"
            element={<PaginaProducto onAgregar={agregar} />}
          />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<PaginaBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                onCambiar={cambiarCantidad}
                onAgregar={agregar}
                avisar={avisar}
              />
            }
          />
          <Route path="/login" element={<Login onLogin={entrar} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer onCategoria={setCategoria} avisar={avisar} />
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          className={`toast align-items-center text-bg-dark border-0${toast.visible ? ' show' : ''}`}
          role="status"
          aria-live="polite"
        >
          <div className="d-flex">
            <div className="toast-body">
              <i className="bi bi-check2-circle text-primary me-2" aria-hidden="true" />
              {toast.texto}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar aviso"
              onClick={() => setToast((actual) => ({ ...actual, visible: false }))}
            />
          </div>
        </div>
      </div>
    </>
  );
}
