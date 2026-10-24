# Lumina Home

Tienda online de lámparas, iluminación smart, iluminación exterior y adornos.

La primera versión la hice con HTML, CSS y JavaScript normal, con una página .html por sección y el carrito manejado a mano con el DOM. Para esta entrega la pasé a React con Vite, le agregué Bootstrap para que sea responsiva y le hice pruebas unitarias con Jasmine y Karma. Traté de mantener el diseño que ya tenía (los colores dorados, las fuentes Jost e Inter, etc).

## Usuarios para probar

Los usuarios están en `src/data/usuarios.json`:

- admin: ab.herreraa@duoc.cl / admin123
- vendedor: matias.reyes@luminahome.cl / vendedor123
- cliente: camila.ibanez@gmail.com / cliente123

Si entras con el admin o el vendedor te manda al panel de administración (`/admin.html`). Si entras con el cliente vuelves al inicio. No es un login de verdad porque no hay backend, solo compara con el JSON y guarda la sesión en sessionStorage.

## Cómo está organizado

- `index.html` y `admin.html` son las dos entradas. Las dos solo tienen un `<div id="root">` y React dibuja todo lo demás.
- `src/App.jsx` es el componente principal. Ahí está el estado del carrito, la categoría elegida, el aviso (toast) y qué página se muestra.
- `src/components/` tiene todos los componentes de la tienda (Header, Footer, Portada, Catalogo, Producto, Carrito, Login, etc).
- `src/admin/` tiene el panel de administración (dashboard, tabla de productos y tabla de usuarios).
- `src/data/` tiene los productos, categorías, blogs, regiones y usuarios en archivos JSON. Antes estaban en un `datos.js` como variables globales.
- `src/test/` tiene las pruebas.
- `validaciones.js`, `formato.js` y `useFormulario.js` son funciones que uso en varios lados (validar correos, formatear precios en pesos, manejar los errores de los formularios).

Para navegar entre páginas usé React Router con `BrowserRouter`, que es lo que habíamos usado antes. En `main.jsx` la app está envuelta en `<BrowserRouter>` y en `App.jsx` cada página tiene su `<Route>` (`/productos`, `/nosotros`, `/carrito`, etc). Para el detalle de un producto la ruta es `/producto/:codigo`, y el código se saca de la URL con `useParams()`. Los enlaces son `<Link>` para que no se recargue la página, y después del login y del registro uso `useNavigate()` para mandar al usuario a otra página. Si alguien escribe una ruta que no existe, lo devuelve al inicio.

## Props y estado

Lo que más me costó fue decidir dónde poner cada estado. Al final el carrito quedó en `App` porque lo necesitan varios componentes: el Header para el número del badge, las tarjetas de producto para el botón Añadir y la página del carrito. App le pasa a los hijos funciones como `onAgregar` o `onCambiar` por props, y ellos las llaman cuando hacen clic. El carrito además se guarda en localStorage para que no se pierda al recargar.

Otros ejemplos de estado:

- `Catalogo` guarda la página actual, lo que se escribe en el buscador, el orden y el precio máximo del filtro.
- `Portada` guarda qué diapositiva del carrusel se ve y cambia sola cada 5 segundos con un `setInterval` dentro de un `useEffect`.
- `Header` guarda si el menú del celular está abierto o cerrado.
- `DetalleProducto` guarda la cantidad elegida y la pestaña que está abierta.
- `Imagen` guarda si la imagen falló al cargar, para mostrar un ícono en su lugar.

También hice algunos componentes para no repetir código, como `Banner` (el encabezado de cada página), `ListaProductos` (la grilla de tarjetas), `Campo` (input con su label y su mensaje de error) y `PanelAuth` (el diseño del login y el registro).

## Formularios

Los formularios (contacto, login y registro) validan con un hook que hice, `useFormulario`. Cada formulario tiene su función `validar`, y los errores se muestran cuando sales del campo y cuando intentas enviar. Para mostrarlos uso las clases de Bootstrap `is-invalid` e `invalid-feedback`.

Las reglas son:

- el correo solo puede ser @duoc.cl, @profesor.duoc.cl o @gmail.com
- la contraseña debe tener entre 4 y 10 caracteres
- en el registro las contraseñas tienen que coincidir, la comuna depende de la región y hay que aceptar los términos

## Pruebas

Las pruebas están hechas con Jasmine, corren con Karma y para renderizar los componentes uso React Testing Library. Como Karma no entiende JSX, en `karma.conf.cjs` configuré webpack con babel para transformar los archivos, y babel-plugin-istanbul para la cobertura.

Tuve algunos problemas con la configuración:
1. Webpack fallaba con los `.css` que importan los componentes. Lo arreglé con una regla `asset/source`.
2. Como el package.json tiene `"type": "module"`, webpack pedía poner la extensión en los imports. Lo arreglé con `fullySpecified: false`.
3. Cuando cambié a React Router, las pruebas empezaron a fallar porque los `<Link>` necesitan estar dentro de un router. Hice una función `renderConRouter` en `src/test/utils.jsx` que envuelve el componente en un `MemoryRouter` (el router que se usa para pruebas).

Son 67 pruebas en 10 archivos. Se prueban sobre todo cosas como:
- que la tarjeta de producto muestre el nombre y el precio bien formateado, y que el botón Añadir llame a `onAgregar` con el código correcto
- que el catálogo filtre por categoría, busque por texto, ordene por precio y pagine
- que el carrito calcule bien el subtotal y no deje sumar más que el stock
- que los formularios muestren los errores y acepten los datos correctos
- que el carrusel avance solo
- que el admin no deje entrar a un cliente

Para los mocks usé:
- `jasmine.createSpy()` para las funciones que llegan por props, y así ver si el componente las llamó y con qué datos
- `spyOn(Storage.prototype, ...)` para simular localStorage y sessionStorage (por ejemplo, para que la app parta con productos ya guardados en el carrito)
- `jasmine.clock()` para adelantar el tiempo en el carrusel, el toast y la redirección del registro, y no tener que esperar de verdad

Resultado de la última vez que lo corrí:

```
TOTAL: 67 SUCCESS

Statements   : 93.78%
Branches     : 90.65%
Functions    : 91.7%
Lines        : 93.75%
```

Lo que tiene menos cobertura es `Catalogo.jsx` (80%), porque me faltó probar el botón de limpiar filtros y la flecha de página anterior. En `App.jsx` (93%) lo único que no probé es cuando el admin inicia sesión y lo manda a `/admin.html`, porque eso cambia `window.location.href` y en la prueba sacaría a Karma de la página.

## Cosas que no funcionan de verdad

El formulario de contacto, el registro, el cupón de descuento y el pago son de mentira: validan los datos pero no los mandan a ningún lado. El mapa de contacto es de OpenStreetMap, así que necesita internet.
