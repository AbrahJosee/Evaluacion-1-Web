# Guía de estudio — Lumina Home (React)

Esta guía explica cómo funciona el proyecto, en el mismo orden en que se ejecuta el código. Cada parte usa ejemplos reales del trabajo.

**Cómo usarla:** lee una sección, abre el archivo que se menciona en VS Code y busca el código (con `Ctrl+Shift+F` encuentras cualquier palabra en todo el proyecto). Al final hay preguntas de práctica con respuestas.

---

## Índice

1. Cómo arranca la app
2. Conceptos básicos de React
3. App.jsx: el cerebro de la tienda
4. Props: cómo se comunican los componentes
5. Producto y ListaProductos: mostrar los productos
6. Catalogo: filtros, búsqueda y paginación
7. Carrito
8. React Router: las páginas
9. Formularios y validación
10. Bootstrap y estilos
11. Otros componentes (Portada, Header, Imagen, Admin)
12. Pruebas unitarias
13. Glosario rápido
14. Preguntas de práctica con respuestas

---

## 1. Cómo arranca la app

El recorrido es: **index.html → main.jsx → App.jsx → los demás componentes**.

### index.html

```html
<head>
  <title>Lumina Home · Iluminación y decoración de interiores</title>
  ...
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

- El `<body>` tiene solo una **caja vacía** (`<div id="root">`) y el script que la va a llenar.
- El `<head>` (título, fuentes, viewport) sigue siendo HTML normal, porque React **solo controla lo que hay dentro de `#root`**.
- El título está en el HTML para que aparezca de inmediato en la pestaña y para que Google y otros programas lo puedan leer sin ejecutar JavaScript.

### main.jsx

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

1. Carga **primero Bootstrap** y **después mis estilos** (`index.css`), para que mis estilos puedan cambiar los de Bootstrap.
2. Busca el `<div id="root">` y dibuja `<App />` adentro.
3. `<BrowserRouter>` activa el router (ver sección 8).

Desde aquí, **todo lo que se ve en la página lo dibuja React**.

### admin.html

Funciona igual, pero su script es `src/admin/main.jsx`, que dibuja `<Admin />`. Es una segunda aplicación aparte. Vite genera las dos al hacer `npm run build` (está configurado en `vite.config.js`).

---

## 2. Conceptos básicos de React

### Un componente es una función que devuelve HTML (JSX)

```jsx
export default function Logo() {
  return (
    <span className="brand">
      <i className="bi bi-lightbulb-fill brand-icon" aria-hidden="true" />
      Lumina Home
    </span>
  );
}
```

- El nombre empieza con **mayúscula** (`Logo`).
- Se usa como una etiqueta: `<Logo />`.
- Lo que parece HTML se llama **JSX**. Diferencias con HTML:
  - `class` se escribe `className`
  - `for` se escribe `htmlFor`
  - las etiquetas sin cierre se cierran con `/>`: `<img />`, `<input />`

### Las llaves `{ }` insertan JavaScript dentro del JSX

```jsx
<h3>{nombre}</h3>                     → muestra el valor de la variable nombre
<p>{formatCLP(precio)}</p>            → llama a una función y muestra el resultado
```

### Estado: lo que un componente recuerda (`useState`)

```jsx
const [abierto, setAbierto] = useState(false);
```

- `abierto` → el valor actual.
- `setAbierto` → la función para cambiarlo.
- `false` → el valor inicial.

**Regla clave:** cada vez que llamas a `setAlgo(...)`, React **vuelve a ejecutar el componente** y actualiza lo que se ve en pantalla.

### Efectos: código que corre después de dibujar (`useEffect`)

```jsx
useEffect(() => {
  // lo que se ejecuta
}, [dependencias]);
```

- Con `[]` vacío → se ejecuta **una sola vez**, al aparecer el componente.
- Con `[carrito]` → se ejecuta **cada vez que cambia `carrito`**.
- Si devuelve una función (`return () => ...`), esa función es la **limpieza**: se ejecuta cuando el componente desaparece o antes de repetir el efecto.

**`useEffect` se usa para cosas que están fuera de React:** localStorage, temporizadores, mover el scroll. **Nunca** se usa para pasar datos entre componentes (para eso están las props).

### Renderizado condicional: mostrar algo solo a veces

```jsx
{stock <= stockCritico && <span>¡Últimas unidades!</span>}
```
Con `&&`: si la condición es verdadera, se muestra; si es falsa, no se muestra nada.

```jsx
{lineas.length === 0 ? <p>Tu carrito está vacío.</p> : <ul>...</ul>}
```
Con el ternario `condición ? A : B`: si es verdadera muestra A, si no muestra B. Es un "if/else" dentro del JSX.

### Listas: repetir un elemento con `map`

```jsx
{productos.map((producto) => (
  <div className="col" key={producto.codigo}>
    <Producto {...producto} />
  </div>
))}
```

- `map` recorre la lista y, por cada elemento, crea un JSX.
- `key` es un identificador **único** que React necesita para no confundir los elementos. Se usa el código del producto.

---

## 3. App.jsx: el cerebro de la tienda

Archivo: `src/App.jsx`

Piensa en App como **el encargado de la tienda**:
1. **Recuerda** las cosas importantes (el carrito, la categoría elegida, el aviso).
2. **Decide** qué página mostrar (con el router).
3. **Les da instrucciones** a los demás componentes (con props).

### 3.1 Lo que recuerda

```jsx
const [carrito, setCarrito] = useState(leerCarrito);
const [categoria, setCategoria] = useState('');
const [toast, setToast] = useState({ texto: '', visible: false });
```

| Estado | Ejemplo de valor | Para qué |
|---|---|---|
| `carrito` | `[{ codigo: 'LMP-001', cantidad: 2 }]` | Los productos agregados |
| `categoria` | `'smart'` | El filtro elegido (se usa en Inicio, Footer y Catálogo) |
| `toast` | `{ texto: 'Producto añadido al carrito', visible: true }` | El aviso negro de abajo a la derecha |

**¿Por qué estos estados están en App y no en otro componente?** Porque los usan **varios componentes distintos**. Por ejemplo, el carrito lo necesitan el Header (para el número), las tarjetas (para el botón Añadir) y la página del Carrito. Si un dato lo usan varios componentes, se guarda en el **padre común**. A esto se le llama **"levantar el estado"**.

### 3.2 Leer el carrito guardado

```jsx
function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) ?? [];
  } catch {
    return [];
  }
}
```

- `localStorage.getItem` lee lo guardado en el navegador (es un texto).
- `JSON.parse` convierte ese texto en un arreglo.
- `?? []` → si no había nada guardado (`null`), usa un arreglo vacío.
- `try/catch` → si lo guardado está dañado y `JSON.parse` falla, no se cae la app: parte con el carrito vacío.

### 3.3 Guardar el carrito cada vez que cambia

```jsx
useEffect(() => {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}, [carrito]);
```

"Cada vez que cambie `carrito`, guárdalo como texto en el navegador." Por eso los productos siguen ahí al recargar la página.

### 3.4 El aviso (toast) se esconde solo

```jsx
useEffect(() => {
  if (!toast.visible) return;
  const temporizador = setTimeout(
    () => setToast((actual) => ({ ...actual, visible: false })),
    2400,
  );
  return () => clearTimeout(temporizador);
}, [toast]);
```

- Cuando el toast se muestra, programa que se esconda en 2,4 segundos.
- Si llega otro aviso antes, la limpieza (`clearTimeout`) cancela el temporizador anterior, y empieza uno nuevo.

### 3.5 Agregar al carrito

```jsx
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
```

Paso a paso:
1. `actual.some(...)` pregunta: **¿el producto ya está en el carrito?**
2. **Si ya está** → `map` recorre el carrito y, solo a ese producto, le suma la cantidad.
3. **Si no está** → crea un arreglo nuevo con todo lo anterior (`...actual`) más el producto nuevo.
4. Muestra el aviso.

Ejemplo:
```
Carrito antes:   [{ codigo: 'LMP-001', cantidad: 1 }]

agregar('LMP-001')  → ya está → [{ codigo: 'LMP-001', cantidad: 2 }]
agregar('SMT-001')  → no está → [{ codigo: 'LMP-001', cantidad: 2 }, { codigo: 'SMT-001', cantidad: 1 }]
```

**Importante:** nunca se modifica el arreglo original, siempre se crea uno nuevo. React detecta cambios comparando si el arreglo es "otro". Si modificas el mismo arreglo, React no se entera y no redibuja.

`setCarrito((actual) => ...)` recibe una función que entrega **el valor más reciente** del carrito. Es la forma segura cuando el nuevo valor depende del anterior.

### 3.6 Cambiar la cantidad o eliminar

```jsx
function cambiarCantidad(codigo, cantidad) {
  setCarrito((actual) =>
    cantidad > 0
      ? actual.map((item) => (item.codigo === codigo ? { ...item, cantidad } : item))
      : actual.filter((item) => item.codigo !== codigo),
  );
}
```

- Si la nueva cantidad es **mayor que 0** → cambia la cantidad de ese producto.
- Si es **0** → `filter` deja todos los productos **menos** ese. Es decir, lo elimina.

### 3.7 Iniciar sesión

```jsx
function entrar(usuario) {
  if (usuario.tipoUsuario === 'cliente') {
    avisar(`¡Hola, ${usuario.nombre}!`);
    navigate('/');
  } else {
    window.location.href = '/admin.html';
  }
}
```

- Cliente → lo saluda y lo lleva al inicio con `navigate` (sección 8).
- Administrador o vendedor → lo manda al panel. Se usa `window.location.href` porque `admin.html` es **otra aplicación**: el router de la tienda no la conoce.

### 3.8 Lo que dibuja

```jsx
<Header unidades={carrito.reduce((total, item) => total + item.cantidad, 0)} />
<main id="contenido">
  <Routes>
    ...todas las páginas...
  </Routes>
</main>
<Footer onCategoria={setCategoria} avisar={avisar} />
<div className="toast-container ...">...</div>
```

- El **Header** y el **Footer** están fuera de `<Routes>`, por eso se ven en todas las páginas.
- `reduce` suma las cantidades del carrito para el número del Header. Con 2 lámparas y 1 ampolleta: 0 + 2 + 1 = **3**.

---

## 4. Props: cómo se comunican los componentes

### Los props son como los atributos de HTML

```html
<img src="foto.jpg" alt="Lámpara">
```
`src` y `alt` son datos que le pasas a la etiqueta. **Los props son lo mismo, pero para tus componentes.**

### Tipo 1: pasar un dato (de padre a hijo)

En App (el padre envía):
```jsx
<Header unidades={3} />
```

En Header (el hijo recibe):
```jsx
export default function Header({ unidades }) {
  ...
  <span className="badge ...">{unidades}</span>
```

Las llaves en `({ unidades })` sacan el valor del objeto de props. Esto se llama **desestructuración**.

```
App: "unidades = 3"  ──►  Header: muestra un 3
```

El Header **no calcula nada**: solo muestra lo que le dicen.

### Tipo 2: pasar una función (para que el hijo avise al padre)

El botón "Añadir" está en `Producto`, pero el carrito es de App. Producto **no puede tocar el carrito**. Entonces App le presta una función, como si le pasara un **control remoto**.

1. App tiene la función:
```jsx
function agregar(codigo, cantidad = 1) { ... }
```

2. App se la pasa al hijo con el nombre `onAgregar`:
```jsx
<Catalogo onAgregar={agregar} />
```

3. La función va bajando hasta llegar a Producto:
```
App → Catalogo → ListaProductos → Producto
```

4. Producto la usa en el botón:
```jsx
<button onClick={() => onAgregar(codigo, 1)}>Añadir</button>
```

5. Al hacer clic, `onAgregar` **es** la función `agregar` de App, así que se ejecuta el código de App y el carrito cambia.

```
App: "toma esta función"
   │  onAgregar = agregar
   ▼
Producto: [Añadir] ──clic──► onAgregar('LMP-001', 1)
   │
   ▼
App: agrega LMP-001 al carrito → React redibuja → el Header muestra el nuevo número
```

### La regla de oro

| Dirección | Qué se pasa | Ejemplo |
|---|---|---|
| Padre → hijo | Datos para mostrar | `unidades={3}` |
| Hijo → padre | El hijo llama a una función que le prestó el padre | `onAgregar('LMP-001', 1)` |

### Diferencia entre props y estado

| | Props | Estado |
|---|---|---|
| ¿De dónde viene? | Del padre | Del mismo componente |
| ¿El componente lo puede cambiar? | No | Sí, con `setAlgo` |
| Ejemplo | `unidades` en Header | `abierto` en Header |

### Ejemplo completo: mostrar el nombre del usuario en el Header

Pasos:
1. App recuerda el usuario: `const [usuario, setUsuario] = useState(null);`
2. En `entrar` (que ya recibe el usuario desde el Login), lo guarda: `setUsuario(usuario);`
3. App se lo pasa al Header: `<Header nombre={usuario?.nombre} ... />`
4. Header lo muestra: `{nombre && <span>Hola, {nombre}</span>}`

No hace falta `useEffect`: el dato llega por props.

---

## 5. Producto y ListaProductos: mostrar los productos

### Producto: la tarjeta de un producto

Archivo: `src/components/Producto.jsx`

No tiene estado: recibe los datos y dibuja la tarjeta.

```jsx
export default function Producto({
  codigo, nombre, categoria, precio, imagen, stock, stockCritico, onAgregar,
}) {
  const nombreCategoria = categorias.find((c) => c.id === categoria)?.nombre ?? categoria;
  const enlace = `/producto/${codigo}`;
```

- `categorias.find(...)` busca el nombre lindo de la categoría: `'techo'` → `'Lámparas de Techo'`.
- `?.nombre` → si no la encuentra, no da error.
- `?? categoria` → si no la encuentra, usa el id tal cual.
- `enlace` arma la dirección del detalle: `/producto/LMP-001`.

Lo que dibuja:
```jsx
<Link to={enlace}>
  <Imagen src={imagen} alt={nombre} className={`tone-${categoria} ratio-4-3`} />
  {stock <= stockCritico && (
    <span className="badge text-bg-danger position-absolute top-0 start-0 m-2">
      ¡Últimas unidades!
    </span>
  )}
</Link>
...
<h3><Link to={enlace}>{nombre}</Link></h3>
<p className="price">{formatCLP(precio)}</p>
<button onClick={() => onAgregar(codigo, 1)}>Añadir</button>
```

- El aviso **¡Últimas unidades!** sale solo si `stock <= stockCritico` (renderizado condicional).
- `formatCLP(45990)` → `'$45.990'` (está en `formato.js`).
- La imagen y el título llevan al detalle del producto.

### ListaProductos: muchas tarjetas en una grilla

Archivo: `src/components/ListaProductos.jsx`

```jsx
export default function ListaProductos({ productos, onAgregar, columnas = 'row-cols-lg-4' }) {
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
```

- `map` crea una tarjeta por cada producto.
- `{...producto}` es un **atajo (spread)**: pasa todos los datos del producto como props. Es lo mismo que escribir `codigo={producto.codigo} nombre={producto.nombre} precio={producto.precio} ...`.
- `columnas = 'row-cols-lg-4'` → si no le pasan el prop, usa 4 columnas. El catálogo le pasa `row-cols-lg-3`.
- La grilla es de Bootstrap: 1 columna en celular, 2 en tablet y 3 o 4 en computador.

**Ventaja:** este componente se usa en el Inicio, el Catálogo, el detalle (relacionados) y el Carrito (sugerencias). Se escribió una sola vez.

---

## 6. Catalogo: filtros, búsqueda y paginación

Archivo: `src/components/Catalogo.jsx`

### 6.1 Lo que recuerda

```jsx
const [paginaActual, setPaginaActual] = useState(1);
const [busqueda, setBusqueda] = useState('');
const [orden, setOrden] = useState('relevancia');
const [precioMax, setPrecioMax] = useState(PRECIO_TOPE);
```

Solo guarda **lo que elige el usuario**. La categoría **no** está aquí: llega por props desde App (`categoria` y `onCategoria`), porque también se elige desde el Inicio y el Footer.

### 6.2 El buscador (input controlado)

```jsx
<input
  type="search"
  value={busqueda}
  onChange={(event) => {
    setBusqueda(event.target.value);
    setPaginaActual(1);
  }}
/>
```

- `value={busqueda}` → el input muestra lo que hay en el estado.
- `onChange` → con cada letra guarda el texto nuevo (`event.target.value`).
- Vuelve a la página 1, porque la página 2 podría ya no existir con menos resultados.

Como cada letra cambia el estado, **la lista se filtra mientras escribes**.

### 6.3 El filtro: la parte más importante

```jsx
const lista = productos.filter(
  (p) =>
    (!categoria || p.categoria === categoria) &&
    p.precio <= precioMax &&
    contiene(p.nombre, busqueda),
);
```

`filter` se queda solo con los productos que cumplen **las 3 condiciones** (`&&` significa "y"):

1. `!categoria || p.categoria === categoria` → si no hay categoría, sirve cualquiera; si la hay, debe coincidir.
2. `p.precio <= precioMax` → no puede pasar del precio máximo del slider.
3. `contiene(p.nombre, busqueda)` → el nombre debe contener lo que escribiste (sin importar mayúsculas).

Ejemplo con categoría `smart`, precio máximo $15.000 y búsqueda vacía:
| Producto | Categoría | Precio | ¿Se queda? |
|---|---|---|---|
| Ampolleta Smart RGB WiFi | smart ✅ | $12.990 ✅ | **Sí** |
| Tira LED Smart 5m | smart ✅ | $18.990 ❌ | No |
| Farol Exterior Minimalista | exterior ❌ | — | No |

**`lista` no es un estado.** Se **calcula** de nuevo cada vez que cambia un filtro. Regla: si algo se puede calcular a partir de otros datos, no se guarda en un estado (si se guardara, habría que acordarse de actualizarlo y podría quedar desincronizado).

### 6.4 Ordenar

```jsx
const ORDENES = {
  relevancia: null,
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
};

if (ORDENES[orden]) lista.sort(ORDENES[orden]);
```

`sort` usa una función que compara dos productos. `a.precio - b.precio` deja primero los más baratos.

### 6.5 Paginación (9 productos por página)

```jsx
const PRODUCTOS_POR_PAGINA = 9;

const totalPaginas = Math.ceil(lista.length / PRODUCTOS_POR_PAGINA);
const paginaVisible = Math.min(paginaActual, Math.max(1, totalPaginas));
const inicio = (paginaVisible - 1) * PRODUCTOS_POR_PAGINA;
const visibles = lista.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
```

Con 14 productos:
- `totalPaginas` = 14 ÷ 9 = 1,55 → `Math.ceil` redondea hacia arriba → **2 páginas**.
- Página 1: `inicio` = 0 → `slice(0, 9)` → productos 0 al 8 (**9 productos**).
- Página 2: `inicio` = 9 → `slice(9, 18)` → productos 9 al 13 (**5 productos**).
- `paginaVisible` evita quedarse en una página que ya no existe (por ejemplo, si estabas en la 2 y filtras a 4 productos).

Para mostrar 6 por página: **solo se cambia `PRODUCTOS_POR_PAGINA = 6`**. Todo lo demás se recalcula. (Ojo: el test del catálogo fallaría, porque espera 9 y 5. Ahí se actualiza el test.)

### 6.6 Los chips de filtros activos

```jsx
const chips = [
  nombreCategoria && [nombreCategoria, () => filtrar('')],
  busqueda.trim() && [`“${busqueda.trim()}”`, () => setBusqueda('')],
  precioMax < PRECIO_TOPE && [`Hasta ${formatCLP(precioMax)}`, () => setPrecioMax(PRECIO_TOPE)],
].filter(Boolean);
```

- Cada chip es un par: [texto, función para quitarlo].
- Si un filtro no está activo, la expresión con `&&` da `false`.
- `.filter(Boolean)` saca los `false`. Quedan solo los filtros activos.

### 6.7 Al final dibuja

```jsx
<ListaProductos productos={visibles} onAgregar={onAgregar} columnas="row-cols-lg-3" />
```

Le pasa solo los productos de la página actual, ya filtrados y ordenados.

### Recorrido completo

```
Escribes "farol"
  → setBusqueda("farol")
  → React vuelve a ejecutar Catalogo
  → filter deja solo "Farol Exterior Minimalista"
  → slice toma la página
  → ListaProductos dibuja 1 tarjeta
```

**Todo React funciona así:** cambias un estado → se ejecuta de nuevo el componente → se calcula lo que hay que mostrar → se dibuja.

---

## 7. Carrito

Archivo: `src/components/Carrito.jsx`

El Carrito **no tiene estado propio**: todo le llega por props desde App y todo lo demás se calcula.

```jsx
export default function Carrito({ carrito, onCambiar, onAgregar, avisar }) {
```

### 7.1 Completar los datos de cada producto

```jsx
const lineas = carrito
  .map((item) => ({ ...item, producto: productos.find((p) => p.codigo === item.codigo) }))
  .filter((linea) => linea.producto);
```

El carrito solo guarda código y cantidad. Aquí se busca el producto completo:
```
Antes:   { codigo: 'LMP-001', cantidad: 2 }
Después: { codigo: 'LMP-001', cantidad: 2, producto: { nombre: 'Lámpara...', precio: 45990, ... } }
```
`filter` descarta los productos que ya no existan en el JSON.

### 7.2 Subtotal con `reduce`

```jsx
const subtotal = lineas.reduce(
  (total, linea) => total + linea.producto.precio * linea.cantidad,
  0,
);
```

`reduce` recorre la lista **acumulando** un valor, que parte en 0:
```
total = 0
Lámpara  $45.990 × 2 → 0 + 91.980      = 91.980
Enchufe   $9.990 × 1 → 91.980 + 9.990  = 101.970
subtotal = 101.970
```

### 7.3 Barra de despacho gratis

```jsx
const faltante = Math.max(0, ENVIO_GRATIS - subtotal);
const avance = Math.min(100, Math.round((subtotal / ENVIO_GRATIS) * 100));
```

Con `ENVIO_GRATIS = 50000` y subtotal $9.990:
- faltante = 50.000 − 9.990 = **$40.010** (`Math.max` evita negativos).
- avance = 9.990 ÷ 50.000 × 100 = **20%** (`Math.min` evita pasar de 100).

### 7.4 Botones + / − / Eliminar

```jsx
<button onClick={() => onCambiar(codigo, cantidad - 1)}>−</button>
<button onClick={() => onCambiar(codigo, Math.min(producto.stock, cantidad + 1))}>+</button>
<button onClick={() => onCambiar(codigo, 0)}>Eliminar</button>
```

Los tres le piden a App que cambie la cantidad (`cambiarCantidad`, sección 3.6):
- **−** resta 1. Si llega a 0, App lo elimina.
- **+** suma 1, pero `Math.min` no deja pasar del stock.
- **Eliminar** pide cantidad 0.

### 7.5 Sugerencias

```jsx
const sugeridos = productos
  .filter((p) => !carrito.some((item) => item.codigo === p.codigo))
  .slice(0, 4);
```

- `carrito.some(...)` → ¿este producto ya está en el carrito?
- `!` lo invierte → se queda con los que **no** están.
- `slice(0, 4)` → toma 4.

### Recorrido

```
App tiene el carrito ──props──► Carrito
                                  │ calcula líneas, subtotal y barra
                                  │ dibuja
     clic en + / − / Eliminar ────┘
                                  │
App ◄── onCambiar(codigo, nuevaCantidad)
  │ setCarrito(...)
  └──► React redibuja el Carrito y el Header
```

---

## 8. React Router: las páginas

Sin router, cada clic en un enlace pide una página nueva al servidor y se recarga todo. Con React Router, **la URL cambia pero la página no se recarga**: React cambia solo el contenido.

```
/productos           → <Catalogo />
/nosotros            → <Nosotros />
/producto/LMP-003    → <DetalleProducto /> de esa lámpara
```

### Pieza 1: `BrowserRouter` — activa el router

En `main.jsx`:
```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

Es como **enchufar** el router. Todo lo que esté adentro puede usar `Routes`, `Link`, `useParams`, etc. Si un componente usa `<Link>` sin estar dentro de un router, React da error. Por eso el Login usa un `<a>` normal para "Regístrate": el Login también se usa en `admin.html`, que no tiene router.

### Pieza 2: `Routes` y `Route` — la lista de páginas

En `App.jsx`:
```jsx
<Routes>
  <Route path="/" element={<Inicio onCategoria={setCategoria} onAgregar={agregar} />} />
  <Route path="/productos" element={<Catalogo categoria={categoria} onCategoria={setCategoria} onAgregar={agregar} />} />
  <Route path="/producto/:codigo" element={<PaginaProducto onAgregar={agregar} />} />
  <Route path="/nosotros" element={<Nosotros />} />
  <Route path="/blogs" element={<Blogs />} />
  <Route path="/blog/:id" element={<PaginaBlog />} />
  <Route path="/contacto" element={<Contacto />} />
  <Route path="/carrito" element={<Carrito ... />} />
  <Route path="/login" element={<Login onLogin={entrar} />} />
  <Route path="/registro" element={<Registro />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

- `path` → la dirección.
- `element` → el componente que se muestra.
- `<Routes>` mira la URL y muestra **solo** la ruta que coincide.
- `path="*"` significa "cualquier otra cosa". `<Navigate to="/" />` redirige al inicio. Así, `/hola` lleva al inicio.

### Pieza 3: `Link` — enlaces sin recargar

```jsx
<a href="/productos">Productos</a>     ← recarga toda la página
<Link to="/productos">Productos</Link> ← solo cambia la URL
```

En pantalla se ven iguales (`Link` dibuja un `<a>`), pero `Link` le avisa al router en vez de pedirle la página al servidor. Los enlaces a redes sociales siguen siendo `<a>` porque van a otros sitios.

### Pieza 4: `useParams` — leer datos de la URL

Hay 14 productos, pero **una sola ruta con un hueco**:
```jsx
<Route path="/producto/:codigo" element={<PaginaProducto onAgregar={agregar} />} />
```

Los dos puntos (`:codigo`) significan "aquí va cualquier valor y se llamará `codigo`":
- `/producto/LMP-003` → `codigo = "LMP-003"`
- `/producto/EXT-002` → `codigo = "EXT-002"`

Para leerlo:
```jsx
function PaginaProducto({ onAgregar }) {
  const { codigo } = useParams();
  return <DetalleProducto key={codigo} codigo={codigo} onAgregar={onAgregar} />;
}
```

1. `useParams()` devuelve `{ codigo: "LMP-003" }`.
2. Se lo pasa a `DetalleProducto` como prop normal.
3. `DetalleProducto` busca ese código en el JSON y lo muestra.

¿Por qué existe `PaginaProducto`? Para que `DetalleProducto` siga recibiendo el código como prop normal. Así se puede probar fácil: `<DetalleProducto codigo="LMP-003" />`.

`key={codigo}` hace que, al pasar de un producto a otro (en "relacionados"), React cree el detalle de nuevo y la cantidad vuelva a 1.

`PaginaBlog` hace lo mismo con `/blog/:id`.

### Pieza 5: `useNavigate` — cambiar de página desde el código

`Link` es para cuando el usuario hace clic. `useNavigate` es para cambiar de página **desde el código**, sin clic.

En App, después del login de un cliente:
```jsx
const navigate = useNavigate();
...
navigate('/');
```

En Registro, después de crear la cuenta:
```jsx
setTimeout(() => {
  navigate('/login');
}, 1200);
```
Espera 1,2 segundos para que se alcance a leer el mensaje y lleva al login.

### Pieza 6: `useLocation` — saber en qué página estás

En el Header, para marcar el enlace activo:
```jsx
const { pathname } = useLocation();   // por ejemplo "/producto/LMP-003"

function esActivo(enlace) {
  return pathname === enlace.ruta || (enlace.detalle && pathname.startsWith(enlace.detalle));
}
```

```jsx
const ENLACES = [
  { ruta: '/', texto: 'Home' },
  { ruta: '/productos', texto: 'Productos', detalle: '/producto/' },
  ...
];
```
- En `/productos` se marca "Productos".
- En `/producto/LMP-003` (empieza con `/producto/`) **también** se marca "Productos". Para eso está `detalle`.

En App, para subir al inicio al cambiar de página:
```jsx
useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
```

### Resumen del router

| Pieza | Para qué | Dónde |
|---|---|---|
| `BrowserRouter` | Activa el router | main.jsx |
| `Routes` + `Route` | Lista "URL → componente" | App.jsx |
| `Navigate` | Redirige (rutas que no existen) | App.jsx |
| `Link` | Enlace sin recargar | Header, Producto, Footer, Banner... |
| `useParams` | Leer `:codigo` o `:id` de la URL | PaginaProducto, PaginaBlog |
| `useNavigate` | Cambiar de página desde el código | App (login), Registro |
| `useLocation` | Saber la ruta actual | Header (activo), App (scroll) |

### Cómo agregar una página nueva (por ejemplo `/ofertas`)

1. Crear `src/components/Ofertas.jsx`.
2. Agregar la ruta en App: `<Route path="/ofertas" element={<Ofertas />} />` (y pasarle props si las necesita, como `onAgregar`).
3. Agregar un enlace para llegar: una línea en `ENLACES` del Header (`{ ruta: '/ofertas', texto: 'Ofertas' }`).
4. Extra: una prueba que haga clic en "Ofertas" y verifique el título.

---

## 9. Formularios y validación

Hay 3 piezas, cada una con un trabajo:

| Pieza | Su trabajo | Archivo |
|---|---|---|
| `validar` | Decide **qué está mal** | dentro de cada formulario |
| `useFormulario` | **Recuerda** los errores y decide **cuándo** revisar | `src/useFormulario.js` |
| `Campo` | **Dibuja** el input con su error | `src/components/Campo.jsx` |

Ejemplo: el formulario de Contacto (`src/components/Contacto.jsx`).

### 9.1 `validar`: las reglas

```jsx
function validar({ nombre, correo, asunto, comentario }) {
  return {
    nombre: !nombre.trim() && OBLIGATORIO,
    correo: errorCorreo(correo),
    asunto: !asunto && 'Selecciona un motivo de consulta.',
    comentario: !comentario.trim() && OBLIGATORIO,
  };
}
```

Recibe lo escrito y devuelve un mensaje por campo:
- `.trim()` quita espacios (para que "   " cuente como vacío).
- `!nombre.trim() && OBLIGATORIO` → si está vacío, el resultado es el mensaje; si no, `false`.

```
Escribió:  { nombre: "", correo: "ana@hotmail.com", asunto: "", comentario: "Hola" }
validar →  { nombre: "Este campo es obligatorio.",
             correo: "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.",
             asunto: "Selecciona un motivo de consulta.",
             comentario: false }
```

`validar` **no muestra nada**, solo decide.

Las reglas que se repiten están en `src/validaciones.js`:
```js
export function esCorreoPermitido(correo) {
  return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo.trim());
}

export function esPasswordValida(password) {
  return password.length >= 4 && password.length <= 10;
}

export function errorCorreo(correo) {
  if (!correo.trim()) return OBLIGATORIO;
  if (!esCorreoPermitido(correo)) {
    return 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
  }
  return '';
}
```
La expresión regular (`/^...$/i`) revisa: algo sin espacios, una `@`, y uno de los tres dominios. La `i` ignora mayúsculas.

### 9.2 `useFormulario`: el que maneja todo

Es un **hook propio**: una función que hice yo, que usa `useState` por dentro, y que los tres formularios comparten.

En Contacto:
```jsx
const { errores, feedback, setFeedback, onBlur, onSubmit } = useFormulario(validar);
```
Le entregas tus reglas y te devuelve todo listo.

**a) Recuerda dos cosas**
```js
const [errores, setErrores] = useState({});    // mensajes por campo
const [feedback, setFeedback] = useState(null); // mensaje grande verde o rojo
```

**b) Lee lo que escribió el usuario**
```js
const datos = Object.fromEntries(new FormData(form));
```
`FormData` (del navegador) lee **todos los inputs** del formulario usando su atributo `name`:
```
<input name="nombre" value="Ana">
<input name="correo" value="ana@gmail.com">
        ▼
{ nombre: "Ana", correo: "ana@gmail.com" }
```
Así no hace falta un `useState` por cada input.

**c) Revisa al salir de un campo (`onBlur`)**
```js
function onBlur(event) {
  const { name } = event.target;
  if (!name) return;
  const encontrados = revisar(validar, event.currentTarget).errores;
  setErrores((previos) => ({ ...previos, [name]: encontrados[name] }));
}
```
- "Blur" = salir de un campo (clic afuera o Tab).
- `event.target.name` dice de qué campo saliste.
- Revisa, pero **actualiza solo ese campo**, para no marcar en rojo campos que aún no tocas.
- Funciona con un solo `onBlur` en el `<form>` porque el evento "sube" (burbujea) desde el input hasta el formulario.

**d) Revisa al enviar (`onSubmit`)**
```js
function onSubmit(alEnviar) {
  return (event) => {
    event.preventDefault();
    const { datos, errores: encontrados } = revisar(validar, event.currentTarget);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setFeedback({ ok: false, texto: 'Revisa los campos marcados en rojo.' });
      return;
    }
    alEnviar(datos, event.currentTarget);
  };
}
```
1. `preventDefault()` → evita que la página se recargue (lo que hace un formulario HTML por defecto).
2. Revisa y marca **todos** los campos.
3. Si hay errores → mensaje rojo y se detiene.
4. Si no → llama a `alEnviar`, lo que el formulario quiere hacer cuando todo está bien.

En Contacto, `alEnviar` es:
```jsx
function enviar(datos, form) {
  form.reset();
  setFeedback({ ok: true, texto: `¡Gracias, ${datos.nombre}! Te responderemos pronto.` });
}
```

Y el formulario:
```jsx
<form noValidate onBlur={onBlur} onSubmit={onSubmit(enviar)}>
```
- `noValidate` → apaga la validación automática del navegador (los globitos), porque la hacemos con React.
- `onSubmit(enviar)` → "cuando se envíe y todo esté bien, ejecuta `enviar`".

### 9.3 `Campo`: lo que se ve

Sin `Campo`, cada input sería:
```jsx
<div className="mb-3">
  <label htmlFor="contacto-nombre" className="form-label">Nombre completo</label>
  <input id="contacto-nombre" name="nombre" className="form-control is-invalid" />
  <div className="invalid-feedback">Este campo es obligatorio.</div>
</div>
```

Con `Campo`:
```jsx
<Campo id="contacto-nombre" name="nombre" label="Nombre completo" error={errores.nombre} />
```

Por dentro:
```jsx
<Control
  id={id}
  className={`${clase}${error ? ' is-invalid' : ''}`}
  {...props}
/>
{hint && <div className="form-text">{hint}</div>}
<div className="invalid-feedback">{error}</div>
```
- Si hay error → agrega la clase `is-invalid`. **Bootstrap** pinta el borde rojo y muestra el `invalid-feedback`.
- Si no hay error → no agrega nada, y el mensaje queda escondido.
- `as="select"` o `as="textarea"` → el mismo Campo dibuja un selector o un área de texto.

`Feedback` (en el mismo archivo) es el `alert` de Bootstrap de arriba: verde (`alert-success`) o rojo (`alert-danger`).

### 9.4 Recorrido completo

```
Escribes "ana@hotmail.com" en Correo y sales del campo
  ▼ onBlur
useFormulario lee el formulario (FormData) y llama a validar
  ▼
validar: correo → "Usa un correo @duoc.cl..."
  ▼ setErrores
React redibuja Contacto
  ▼
<Campo error="..."> agrega is-invalid
  ▼
Bootstrap muestra el borde rojo y el mensaje
```

### 9.5 Login y Registro

Usan el mismo `useFormulario` y el mismo `Campo`, con su propio `validar`. Lo que cambia es qué hacen al enviar:

**Login** (`src/components/Login.jsx`):
```jsx
function entrar({ correo, password }) {
  const usuario = usuarios.find(
    (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.password === password,
  );
  if (!usuario) {
    setErrores({ password: INCORRECTO });
    setFeedback({ ok: false, texto: INCORRECTO });
    return;
  }
  if (onLogin(usuario) === false) {
    setFeedback({ ok: false, texto: 'Tu perfil no tiene acceso a esta sección.' });
    return;
  }
  sessionStorage.setItem('lumina_usuario', JSON.stringify(usuario));
  setFeedback({ ok: true, texto: 'Inicio de sesión correcto.' });
}
```
- Busca el usuario en `usuarios.json`.
- Le avisa al padre con `onLogin(usuario)`. El padre puede devolver `false` para rechazarlo (lo hace el Admin con los clientes).
- Así el mismo Login sirve en la tienda y en el admin.

**Registro** (`src/components/Registro.jsx`), la región y la comuna:
```jsx
const [region, setRegion] = useState('');
const comunas = regiones.find((r) => r.region === region)?.comunas ?? [];
...
<Campo id="region" as="select" value={region} onChange={(e) => setRegion(e.target.value)} ...>
<Campo key={region} id="comuna" as="select" disabled={!region} ...>
```
- La región se guarda en el estado para saber qué comunas mostrar.
- `disabled={!region}` → la comuna está bloqueada hasta elegir región.
- `key={region}` → cuando cambia la región, React **crea de nuevo** el selector de comuna. Así se borra la comuna que estaba elegida antes.

### 9.6 Ejemplo: exigir al menos 3 letras en el nombre

**Opción 1, directo en `validar`:**
```jsx
nombre: !nombre.trim()
  ? OBLIGATORIO
  : nombre.trim().length < 3 && 'El nombre debe tener al menos 3 caracteres.',
```
`.length` cuenta los caracteres. Es un ternario porque dentro de un objeto no cabe un `if`.

**Opción 2, en `validaciones.js` e importarla (mejor si la usan varios formularios):**
```js
export function errorNombre(nombre) {
  if (!nombre.trim()) return OBLIGATORIO;
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  return '';
}
```
```jsx
nombre: errorNombre(nombre),
```
Ventaja: la regla está en un solo lugar (Contacto y Registro la comparten) y se puede probar sola.

---

## 10. Bootstrap y estilos

### Cómo se carga

En `main.jsx`, primero Bootstrap y después mis estilos:
```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';
```
Como el mío se carga después, puede cambiar lo de Bootstrap.

### Mis colores sobre Bootstrap

Bootstrap 5.3 guarda sus colores en **variables CSS**. En `src/index.css` las cambio:
```css
:root {
  --bs-primary: #c7973f;
  --bs-primary-rgb: 199, 151, 63;
  --bs-body-bg: var(--bg);
  ...
}

.btn-primary {
  --bs-btn-bg: var(--accent);
  --bs-btn-hover-bg: var(--accent-dark);
  ...
}
```
Por eso los botones, badges y la paginación salen **dorados** en vez de azules, sin reescribir los componentes de Bootstrap.

### Responsive con la grilla

```jsx
<div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
```
| Tamaño | Clase | Columnas |
|---|---|---|
| Celular | `row-cols-1` | 1 |
| Tablet (`sm`, desde 576px) | `row-cols-sm-2` | 2 |
| Computador (`lg`, desde 992px) | `row-cols-lg-4` | 4 |

`g-4` es el espacio entre tarjetas.

Otros ejemplos:
- Menú: `navbar-expand-lg` → menú completo en computador, botón hamburguesa en pantallas chicas.
- Catálogo: `col-lg-3` (filtros) y `col-lg-9` (productos) → lado a lado en computador, uno arriba del otro en celular.
- `d-none d-lg-flex` → oculto en celular, visible en computador (panel de imagen del login, barra lateral del admin).

### Componentes de Bootstrap usados

navbar, carousel, card, list-group, nav-pills, nav-tabs, accordion, pagination, breadcrumb, badge, progress, toast, alert, input-group, form-range, tablas responsivas y clases de validación (`is-invalid`, `invalid-feedback`). Íconos: Bootstrap Icons (`<i className="bi bi-bag" />`).

### React controla, Bootstrap pinta

No uso el JavaScript de Bootstrap. Bootstrap pone el **aspecto** (las clases) y React decide **cuándo** se abre o cierra algo, con estado. Ejemplo, el menú del celular en `Header.jsx`:
```jsx
const [abierto, setAbierto] = useState(false);

<button aria-expanded={abierto} onClick={() => setAbierto(!abierto)}>
<div className={`collapse navbar-collapse${abierto ? ' show' : ''}`}>
```
Bootstrap esconde el menú si no tiene la clase `show`. React la agrega o la quita. `!abierto` invierte el valor con cada clic.

Lo mismo pasa con el carrusel (`active`), las pestañas (`active`), el acordeón (`show` / `collapsed`) y el toast (`show`).

---

## 11. Otros componentes

### Portada (el carrusel) — `src/components/Portada.jsx`

```jsx
const [activa, setActiva] = useState(0);
const total = DIAPOSITIVAS.length;

useEffect(() => {
  const temporizador = setInterval(() => setActiva((a) => (a + 1) % total), INTERVALO);
  return () => clearInterval(temporizador);
}, [activa, total]);
```
- Cada 5 segundos (`INTERVALO = 5000`) suma 1.
- `% total` (módulo) hace que después de la última vuelva a la primera: 0 → 1 → 2 → 0.
- Como `activa` está en las dependencias, si haces clic en una flecha el temporizador se reinicia y no salta justo después.
- La limpieza (`clearInterval`) detiene el intervalo al salir del Inicio.
- A la diapositiva activa se le pone la clase `active`, y Bootstrap muestra solo esa.

Flechas:
```jsx
function mover(paso) {
  setActiva((a) => (a + paso + total) % total);
}
```
`mover(-1)` desde la 0: (0 − 1 + 3) % 3 = 2 → va a la última. El `+ total` evita números negativos.

### Imagen — `src/components/Imagen.jsx`

```jsx
const [fallo, setFallo] = useState(false);

{src && !fallo ? (
  <img src={src} alt={alt} onError={() => setFallo(true)} />
) : (
  <i className="bi bi-lightbulb" />
)}
```
Si la foto no carga, el navegador dispara `onError`, el estado pasa a `true` y se muestra un ícono de ampolleta.

### Banner — `src/components/Banner.jsx`

El encabezado con foto de cada página. Recibe `titulo`, `texto`, `imagen` y `migas` (la ruta de navegación). Ejemplo en Catálogo:
```jsx
<Banner titulo="Productos" imagen="/img/techo 4.jpg" texto="Explora nuestro catálogo..." />
```

### DetalleProducto — `src/components/DetalleProducto.jsx`

```jsx
const [cantidad, setCantidad] = useState(1);
const [pestana, setPestana] = useState('descripcion');

function ajustar(valor) {
  setCantidad(Math.min(stock, Math.max(1, Number(valor) || 1)));
}
```
`ajustar` deja la cantidad entre 1 y el stock: `Math.max(1, ...)` no deja bajar de 1, `Math.min(stock, ...)` no deja pasar del stock.

Las pestañas (Descripción, Despacho, Garantía) muestran un texto según `pestana`:
```jsx
<p>{contenidos[pestana]}</p>
```

### Admin — `src/admin/Admin.jsx`

```jsx
const [usuario, setUsuario] = useState(usuarioGuardado);
const [seccion, setSeccion] = useState('dashboard');

if (!usuario) {
  return <Login onLogin={entrar} />;
}
```
- Sin usuario → muestra el login. Con usuario → muestra el panel.
- `usuarioGuardado` lee el `sessionStorage`: si entraste desde la tienda, no te vuelve a pedir datos.
- `entrar` devuelve `false` si el usuario es cliente → el Login muestra "no tiene acceso".
- `seccion` decide qué se muestra: `Dashboard`, `TablaProductos` o `TablaUsuarios`.

---

## 12. Pruebas unitarias

### Las herramientas

| Herramienta | Para qué |
|---|---|
| **Jasmine** | Escribir las pruebas (`describe`, `it`, `expect`) |
| **Karma** | Correrlas en un navegador real (Chrome Headless, sin ventana) |
| **React Testing Library** | Dibujar componentes y simular clics |
| **webpack + Babel** | Traducir JSX para que Karma lo entienda |
| **Istanbul** | Medir la cobertura (qué porcentaje del código se ejecutó) |

Se corren con `npm test`. La configuración está en `karma.conf.cjs`.

### Problemas que tuve que resolver

1. Webpack fallaba con los `.css` que importan los componentes → regla `{ test: /\.css$/, type: 'asset/source' }`.
2. Por `"type": "module"` en package.json, webpack pedía la extensión en los imports → `resolve: { fullySpecified: false }`.
3. Con React Router, los `<Link>` necesitan un router → helper `renderConRouter` en `src/test/utils.jsx`:
```jsx
export function renderConRouter(ui, ruta = '/') {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[ruta]}>{children}</MemoryRouter>
    ),
  });
}
```
`MemoryRouter` funciona igual que `BrowserRouter`, pero guarda la URL en memoria, así cada prueba parte en la ruta que quiera.

### Cómo se escribe una prueba

Patrón: **preparar → actuar → verificar**.

```jsx
describe('Componente Producto', () => {
  afterEach(() => {
    cleanup();
  });

  it('llama a onAgregar con el código y una unidad al pulsar Añadir', () => {
    const onAgregar = jasmine.createSpy('onAgregar');                    // preparar
    renderConRouter(<Producto {...PRODUCTO} onAgregar={onAgregar} />);   // preparar

    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }));     // actuar

    expect(onAgregar).toHaveBeenCalledOnceWith('LMP-001', 1);            // verificar
  });
});
```

- `describe` → agrupa pruebas del mismo componente.
- `it` → un caso de prueba (el texto dice qué se espera).
- `expect(...).toBe(...)` → la verificación. Si no se cumple, la prueba falla.
- `afterEach(cleanup)` → borra lo dibujado entre una prueba y otra.
- `screen.getByRole('button', { name: 'Añadir' })` → busca el botón como lo haría una persona (por su texto), no por una clase CSS.
- `fireEvent.click(...)` → simula un clic. También existen `fireEvent.change` (escribir) y `fireEvent.submit` (enviar).

### Mocks: simular cosas externas

Un mock es algo **falso** que reemplaza una pieza real, para probar el componente aislado.

**1. `jasmine.createSpy()` — función falsa**
```jsx
const onAgregar = jasmine.createSpy('onAgregar');
...
expect(onAgregar).toHaveBeenCalledWith('LMP-001', 1);
```
Reemplaza la función que vendría de App. Registra cómo la llamaron. Así pruebo Producto **sin necesitar App**.

También puede devolver un valor:
```jsx
const onLogin = jasmine.createSpy('onLogin').and.returnValue(false);
```
(Así se prueba que el Login muestra "no tiene acceso" cuando el padre rechaza.)

**2. `spyOn(Storage.prototype, ...)` — localStorage falso**
```jsx
spyOn(Storage.prototype, 'getItem').and.returnValue(
  JSON.stringify([{ codigo: 'LMP-001', cantidad: 3 }]),
);
renderConRouter(<App />);
expect(badge()).toBe('3');
```
Hace que localStorage "devuelva" un carrito con 3 lámparas, sin tocar el localStorage real. También sirve para revisar que se guardó algo:
```jsx
const guardar = spyOn(Storage.prototype, 'setItem');
...
expect(guardar).toHaveBeenCalledWith('lumina_carrito', JSON.stringify([...]));
```

**3. `jasmine.clock()` — reloj falso**
```jsx
beforeEach(() => { jasmine.clock().install(); });
afterEach(() => { jasmine.clock().uninstall(); });

it('avanza sola a la siguiente diapositiva cuando pasa el intervalo', () => {
  const { container } = renderConRouter(<Portada onCategoria={() => {}} />);
  act(() => jasmine.clock().tick(INTERVALO));
  expect(diapositivaActiva(container)).toBe('Controla tu luz desde el celular');
});
```
Congela el tiempo. `tick(5000)` lo adelanta 5 segundos **al instante**. Se usa en el carrusel, el toast y la redirección del registro. `act(...)` le dice a React que procese los cambios de estado que provocó el tiempo.

### Resultados

67 pruebas en 10 archivos, todas pasan.

```
Statements   : 93.78%
Branches     : 90.65%
Functions    : 91.7%
Lines        : 93.75%
```

- **Statements / Lines:** porcentaje de líneas de código que se ejecutaron durante las pruebas.
- **Branches:** porcentaje de caminos de los `if`/ternarios que se probaron (el lado verdadero y el falso).
- **Functions:** porcentaje de funciones que se llamaron al menos una vez.

El reporte detallado está en `coverage/html/index.html` (las líneas en rojo son las no probadas).

Lo menos cubierto:
- `Catalogo.jsx` (80%): falta probar "Limpiar filtros" y la flecha de página anterior.
- `App.jsx` (93%): falta la redirección del admin a `/admin.html`. No se prueba porque cambiar `window.location.href` sacaría a Karma de su página.

### Demostrar que una prueba sirve

Cambia algo a propósito y corre `npm test`. Por ejemplo, en `Producto.jsx` cambia `onAgregar(codigo, 1)` por `onAgregar(codigo, 2)`: la prueba falla y avisa del error. Después vuelve el cambio atrás.

---

## 13. Glosario rápido

| Término | Qué es | Ejemplo en el proyecto |
|---|---|---|
| Componente | Función que devuelve JSX | `Producto`, `Header` |
| JSX | HTML dentro de JavaScript | `<h3>{nombre}</h3>` |
| Props | Datos o funciones que el padre le pasa al hijo | `unidades={3}`, `onAgregar={agregar}` |
| Estado (`useState`) | Lo que un componente recuerda | `carrito` en App |
| `useEffect` | Código que corre después de dibujar | Guardar en localStorage |
| Hook | Función de React que empieza con `use` | `useState`, `useParams` |
| Hook propio | Un hook que hice yo | `useFormulario` |
| Levantar el estado | Guardar el dato en el padre común | El carrito en App |
| Renderizado condicional | Mostrar algo solo a veces | `{critico && <span>...}` |
| Input controlado | Input cuyo valor viene del estado | Buscador del catálogo |
| `map` | Recorrer una lista y crear algo por cada elemento | Una tarjeta por producto |
| `filter` | Quedarse con los que cumplen una condición | Filtrar productos |
| `find` | Encontrar el primero que cumple | Buscar un producto por código |
| `some` | ¿Al menos uno cumple? | ¿El producto ya está en el carrito? |
| `reduce` | Acumular un valor recorriendo la lista | Subtotal |
| `slice` | Tomar un pedazo de la lista | Paginación |
| Spread `...` | Copiar todas las propiedades | `{...producto}`, `{ ...item, cantidad }` |
| `?.` | Acceder sin error si no existe | `usuario?.nombre` |
| `??` | Valor de respaldo si es null/undefined | `?? []` |
| SPA | Una sola página que cambia el contenido sin recargar | Toda la tienda |
| Mock | Pieza falsa para pruebas | `createSpy`, `spyOn`, `jasmine.clock` |
| Cobertura | Porcentaje del código que ejecutaron las pruebas | 93,75% |

---

## 14. Preguntas de práctica (con respuestas)

Intenta responder antes de leer la respuesta.

**1. ¿Por qué el carrito está en App y no en el componente Carrito?**
> Porque lo usan varios componentes: el Header (el número), las tarjetas (botón Añadir), el detalle y la página del carrito. Si un dato lo comparten varios componentes, se guarda en el padre común y se pasa por props.

**2. ¿Cuál es la diferencia entre props y estado?**
> Las props vienen del padre y el componente no las cambia. El estado es propio del componente y se cambia con su función `set`. Cuando cambia el estado, React vuelve a dibujar el componente.

**3. ¿Cómo hace Producto para agregar algo al carrito si el carrito no es suyo?**
> App le pasa la función `agregar` como prop (`onAgregar`). Cuando se hace clic en "Añadir", Producto llama a `onAgregar(codigo, 1)`, que en realidad ejecuta `agregar` de App.

**4. ¿Para qué sirve `useEffect`? Da un ejemplo del proyecto.**
> Para ejecutar código después de dibujar, sobre cosas que están fuera de React. Ejemplo: guardar el carrito en localStorage cada vez que cambia (`useEffect(..., [carrito])`), o el temporizador del carrusel.

**5. ¿Por qué la lista filtrada del catálogo no es un `useState`?**
> Porque se puede calcular a partir de los filtros. Si se guardara, habría que actualizarla a mano cada vez que cambia un filtro y podría quedar desincronizada.

**6. ¿Qué cambiarías para mostrar 6 productos por página?**
> La constante `PRODUCTOS_POR_PAGINA = 6` en Catalogo.jsx. El test del catálogo fallaría y habría que actualizarlo.

**7. ¿Qué hace `useParams` y dónde se usa?**
> Lee los valores variables de la URL. En `/producto/:codigo`, con la URL `/producto/LMP-003`, devuelve `{ codigo: 'LMP-003' }`. Se usa en `PaginaProducto` y `PaginaBlog` dentro de App.

**8. ¿Diferencia entre `Link` y `useNavigate`?**
> `Link` es un enlace en el que el usuario hace clic. `useNavigate` cambia de página desde el código, sin clic (por ejemplo, después de iniciar sesión o registrarse).

**9. ¿Qué pasa si escribo una URL que no existe, como `/hola`?**
> La ruta `path="*"` la atrapa y `<Navigate to="/" />` redirige al inicio.

**10. ¿Por qué el admin usa `window.location.href` y no `navigate`?**
> Porque `admin.html` es otra aplicación con su propio HTML. El router de la tienda solo conoce sus propias páginas.

**11. ¿Cómo agregarías una página `/ofertas`?**
> Crear `Ofertas.jsx`, agregar `<Route path="/ofertas" element={<Ofertas />} />` en App y agregar el enlace en `ENLACES` del Header.

**12. ¿Para qué sirve `useFormulario`?**
> Es un hook propio que comparten los tres formularios. Guarda los errores y el mensaje general, lee los datos con FormData, revisa al salir de un campo (`onBlur`) y al enviar (`onSubmit`), y solo ejecuta la acción final si no hay errores.

**13. ¿Quién pinta el borde rojo de un campo con error, React o Bootstrap?**
> Bootstrap. React solo decide si agregar la clase `is-invalid`; Bootstrap la pinta de rojo y muestra el `invalid-feedback`.

**14. ¿Por qué el selector de comuna tiene `key={region}`?**
> Porque al cambiar la `key`, React crea el selector de nuevo y se borra la comuna elegida antes. Así no queda seleccionada una comuna de otra región.

**15. ¿Cómo cambiaste los colores de Bootstrap?**
> Sobrescribiendo sus variables CSS (`--bs-primary`, `--bs-btn-bg`, etc.) en `index.css`, que se carga después de Bootstrap.

**16. ¿Cómo hiciste el diseño responsivo?**
> Con la grilla de Bootstrap: `row-cols-1 row-cols-sm-2 row-cols-lg-4` hace 1, 2 o 4 columnas según el tamaño. También `navbar-expand-lg` para el menú y `d-none d-lg-flex` para mostrar u ocultar cosas.

**17. ¿Qué es un mock y qué mocks usaste?**
> Una pieza falsa que reemplaza una real para probar un componente aislado. Usé `jasmine.createSpy` (funciones que llegan por props), `spyOn(Storage.prototype, ...)` (localStorage y sessionStorage) y `jasmine.clock()` (el tiempo).

**18. ¿Qué significa tener 93% de cobertura? ¿Qué falta?**
> Que las pruebas ejecutaron el 93% de las líneas del código. Falta sobre todo "Limpiar filtros" y la flecha anterior del catálogo, y la redirección del admin en App (no se prueba porque sacaría a Karma de la página).

**19. ¿Por qué tuviste que crear `renderConRouter`?**
> Porque los componentes con `<Link>` necesitan estar dentro de un router. El helper los envuelve en un `MemoryRouter` para las pruebas.

**20. ¿Qué hace `jasmine.clock().tick(5000)`?**
> Adelanta el reloj falso 5 segundos al instante, para probar el carrusel, el toast o la redirección del registro sin esperar de verdad.
