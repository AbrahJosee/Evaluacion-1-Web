const ICON_BULB =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.44.9 1.15.9 1.9V16h5.2v-.2c0-.75.3-1.46.9-1.9A6 6 0 0 0 12 3Z"/></svg>';
const ICON_CARRITO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M2.5 3h2l2.4 12.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/></svg>';
const ICON_MENU =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

function phImg(tone, ratio) {
  if (!ratio) {
    ratio = "ratio-4-3";
  }
  return '<div class="ph-img tone-' + tone + ' ' + ratio + '">' + ICON_BULB + '</div>';
}

function productoImg(p, ratio) {
  if (!ratio) {
    ratio = "ratio-4-3";
  }
  if (p.imagen) {
    return '<div class="ph-img ' + ratio + '"><img src="' + p.imagen + '" alt="' + p.nombre + '"></div>';
  }
  return phImg(p.categoria, ratio);
}

function blogImg(b, ratio) {
  if (!ratio) {
    ratio = "ratio-4-3";
  }
  if (b.imagen) {
    return '<div class="ph-img ' + ratio + '"><img src="' + b.imagen + '" alt="' + b.titulo + '"></div>';
  }
  return phImg("blog", ratio);
}

function initNavToggle() {
  var btn = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
}

function initIconos() {
  const brandBulb = document.querySelector(".brand .bulb");
  if (brandBulb) {
    brandBulb.innerHTML = ICON_BULB;
  }
  const footerBulb = document.querySelector(".footer-brand .bulb");
  if (footerBulb) {
    footerBulb.innerHTML = ICON_BULB;
  }
  const carritoIcon = document.querySelector(".carrito-icon");
  if (carritoIcon) {
    carritoIcon.innerHTML = ICON_CARRITO;
  }
  const menuIcon = document.querySelector(".menu-icon");
  if (menuIcon) {
    menuIcon.innerHTML = ICON_MENU;
  }
}
document.addEventListener("DOMContentLoaded", initIconos);

let toastTimeout;

function showToast(mensaje) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(function () {
    toast.classList.remove("show");
  }, 2400);
}

document.addEventListener("DOMContentLoaded", initNavToggle);

const CARRITO_KEY = "lumina_carrito";

function obtenerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CARRITO_KEY));
    if (datos) {
      return datos;
    }
    return [];
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(codigo, cantidad) {
  if (!cantidad) {
    cantidad = 1;
  }
  const carrito = obtenerCarrito();
  let encontrado = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo === codigo) {
      carrito[i].cantidad = carrito[i].cantidad + cantidad;
      encontrado = true;
      break;
    }
  }
  if (!encontrado) {
    carrito.push({ codigo: codigo, cantidad: cantidad });
  }
  guardarCarrito(carrito);
}

function actualizarCantidadCarrito(codigo, cantidad) {
  let carrito = obtenerCarrito();
  if (cantidad <= 0) {
    const nuevoCarrito = [];
    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].codigo !== codigo) {
        nuevoCarrito.push(carrito[i]);
      }
    }
    carrito = nuevoCarrito;
  } else {
    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].codigo === codigo) {
        carrito[i].cantidad = cantidad;
      }
    }
  }
  guardarCarrito(carrito);
}

function quitarDelCarrito(codigo) {
  const carrito = obtenerCarrito();
  const nuevoCarrito = [];
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].codigo !== codigo) {
      nuevoCarrito.push(carrito[i]);
    }
  }
  guardarCarrito(nuevoCarrito);
}

function totalUnidadesCarrito() {
  const carrito = obtenerCarrito();
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].cantidad;
  }
  return total;
}

function detalleCarrito() {
  const carrito = obtenerCarrito();
  const detalle = [];
  for (let i = 0; i < carrito.length; i++) {
    const producto = obtenerProducto(carrito[i].codigo);
    if (producto) {
      detalle.push({
        codigo: carrito[i].codigo,
        cantidad: carrito[i].cantidad,
        producto: producto
      });
    }
  }
  return detalle;
}

function subtotalCarrito() {
  const lineas = detalleCarrito();
  let total = 0;
  for (let i = 0; i < lineas.length; i++) {
    total = total + lineas[i].producto.precio * lineas[i].cantidad;
  }
  return total;
}

function actualizarBadgeCarrito() {
  const badges = document.querySelectorAll(".carrito-badge");
  const total = totalUnidadesCarrito();
  badges.forEach(function (el) {
    el.textContent = total;
  });
}

document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);

function renderProductCard(p) {
  let html = '<div class="product-card">';
  html += '<a class="thumb-link" href="producto-detalle.html?codigo=' + p.codigo + '">' + productoImg(p) + '</a>';
  html += '<div class="info">';
  html += '<span class="cat">' + obtenerNombreCategoria(p.categoria) + '</span>';
  html += '<h3><a href="producto-detalle.html?codigo=' + p.codigo + '">' + p.nombre + '</a></h3>';
  html += '<span class="price">' + formatCLP(p.precio) + '</span>';
  html += '<button class="btn btn-primary btn-sm btn-block" type="button" data-add="' + p.codigo + '">Añadir</button>';
  html += '</div></div>';
  return html;
}

function renderGrid(containerId, productos) {
  const cont = document.getElementById(containerId);
  if (!cont) {
    return;
  }

  if (productos.length === 0) {
    cont.innerHTML = '<p class="empty-state">No hay productos en esta categoría.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < productos.length; i++) {
    html += renderProductCard(productos[i]);
  }
  cont.innerHTML = html;

  const botones = cont.querySelectorAll("[data-add]");
  botones.forEach(function (btn) {
    btn.addEventListener("click", function () {
      agregarAlCarrito(btn.dataset.add, 1);
      showToast("Producto añadido al carrito");
    });
  });
}

function initFiltrosCategoria(containerId, barId, productos) {
  const bar = document.getElementById(barId);
  if (!bar) {
    return;
  }
  bar.addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) {
      return;
    }
    const botones = bar.querySelectorAll("button");
    botones.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");

    const cat = btn.dataset.cat;
    if (cat === "todos") {
      renderGrid(containerId, productos);
    } else {
      const filtrados = [];
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].categoria === cat) {
          filtrados.push(productos[i]);
        }
      }
      renderGrid(containerId, filtrados);
    }
  });
}

function renderDetalleProducto() {
  const params = new URLSearchParams(location.search);
  const producto = obtenerProducto(params.get("codigo"));
  const cont = document.getElementById("detalle-producto");
  if (!cont) {
    return;
  }

  if (!producto) {
    cont.innerHTML = '<p class="empty-state">Producto no encontrado. <a href="productos.html">Volver a productos</a>.</p>';
    return;
  }

  document.title = producto.nombre + " · Lumina Home";
  const bajoStock = producto.stock <= producto.stockCritico;

  let html = '<div class="pd-gallery">';
  html += '<div class="pd-gallery-main">' + productoImg(producto, "ratio-1-1") + '</div>';
  html += '<div class="pd-thumbs">';
  html += productoImg(producto).replace('class="ph-img', 'class="ph-img active');
  html += productoImg(producto);
  html += productoImg(producto);
  html += '</div></div>';

  html += '<div class="pd-info">';
  html += '<span class="cat">' + obtenerNombreCategoria(producto.categoria) + '</span>';
  html += '<h1>' + producto.nombre + '</h1>';
  html += '<div class="pd-price">' + formatCLP(producto.precio) + '</div>';
  html += '<p class="pd-desc">' + producto.descripcion + '</p>';
  if (bajoStock) {
    html += '<p class="pd-stock low">Stock bajo: quedan ' + producto.stock + ' unidades</p>';
  } else {
    html += '<p class="pd-stock ok">Stock disponible: ' + producto.stock + ' unidades</p>';
  }
  html += '<div class="qty-row"><span>Cantidad</span>';
  html += '<div class="qty-control">';
  html += '<button type="button" id="qty-menos" aria-label="Restar">−</button>';
  html += '<input type="number" id="qty-input" value="1" min="1" max="' + producto.stock + '">';
  html += '<button type="button" id="qty-mas" aria-label="Sumar">+</button>';
  html += '</div></div>';
  html += '<button class="btn btn-primary btn-block" id="btn-add-carrito" type="button">Añadir al carrito</button>';
  html += '</div>';

  cont.innerHTML = html;

  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-menos").addEventListener("click", function () {
    const valor = Number(qtyInput.value) - 1;
    qtyInput.value = valor < 1 ? 1 : valor;
  });
  document.getElementById("qty-mas").addEventListener("click", function () {
    const valor = Number(qtyInput.value) + 1;
    qtyInput.value = valor > producto.stock ? producto.stock : valor;
  });
  document.getElementById("btn-add-carrito").addEventListener("click", function () {
    let cantidad = Number(qtyInput.value);
    if (!cantidad || cantidad < 1) {
      cantidad = 1;
    }
    agregarAlCarrito(producto.codigo, cantidad);
    showToast("Producto añadido al carrito");
  });

  const relacionados = [];
  for (let i = 0; i < PRODUCTOS.length; i++) {
    const p = PRODUCTOS[i];
    if (p.categoria === producto.categoria && p.codigo !== producto.codigo && relacionados.length < 4) {
      relacionados.push(p);
    }
  }
  renderGrid("productos-relacionados", relacionados);
}

function renderListaBlogs(containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) {
    return;
  }
  let html = "";
  for (let i = 0; i < BLOGS.length; i++) {
    const b = BLOGS[i];
    html += '<article class="blog-row">';
    html += blogImg(b, "ratio-4-3");
    html += '<div><h3>' + b.titulo + '</h3>';
    html += '<p>' + b.resumen + '</p>';
    html += '<a class="btn btn-outline btn-sm" href="blog-detalle.html?id=' + b.id + '">Ver caso</a>';
    html += '</div></article>';
  }
  cont.innerHTML = html;
}

function renderDetalleBlog() {
  const params = new URLSearchParams(location.search);
  const blog = obtenerBlog(params.get("id"));
  const cont = document.getElementById("detalle-blog");
  if (!cont) {
    return;
  }

  if (!blog) {
    cont.innerHTML = '<p class="empty-state">Artículo no encontrado. <a href="blogs.html">Volver a blogs</a>.</p>';
    return;
  }

  document.title = blog.titulo + " · Lumina Home";

  let parrafos = "";
  for (let i = 0; i < blog.cuerpo.length; i++) {
    parrafos += "<p>" + blog.cuerpo[i] + "</p>";
  }

  let html = '<div class="blog-detail-hero">' + blogImg(blog, "ratio-16-9") + '</div>';
  html += '<div class="blog-detail-body">';
  html += '<p class="blog-meta"><a href="blogs.html">Blogs</a> · Lumina Home</p>';
  html += '<h1>' + blog.titulo + '</h1>';
  html += parrafos;
  html += '</div>';

  cont.innerHTML = html;
}

function initSelectorRegionComuna(regionSelectId, comunaSelectId, valores) {
  const regionSel = document.getElementById(regionSelectId);
  const comunaSel = document.getElementById(comunaSelectId);
  if (!regionSel || !comunaSel) {
    return;
  }

  for (let i = 0; i < REGIONES_CHILE.length; i++) {
    const opt = document.createElement("option");
    opt.value = REGIONES_CHILE[i].region;
    opt.textContent = REGIONES_CHILE[i].region;
    regionSel.appendChild(opt);
  }

  function poblarComunas(comunaSeleccionada) {
    comunaSel.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    let regionEncontrada = null;
    for (let i = 0; i < REGIONES_CHILE.length; i++) {
      if (REGIONES_CHILE[i].region === regionSel.value) {
        regionEncontrada = REGIONES_CHILE[i];
        break;
      }
    }

    if (!regionEncontrada) {
      comunaSel.disabled = true;
      return;
    }

    comunaSel.disabled = false;
    for (let i = 0; i < regionEncontrada.comunas.length; i++) {
      const comuna = regionEncontrada.comunas[i];
      const opt = document.createElement("option");
      opt.value = comuna;
      opt.textContent = comuna;
      if (comuna === comunaSeleccionada) {
        opt.selected = true;
      }
      comunaSel.appendChild(opt);
    }
  }

  regionSel.addEventListener("change", function () {
    poblarComunas();
  });

  if (valores && valores.region) {
    regionSel.value = valores.region;
    poblarComunas(valores.comuna);
  } else {
    poblarComunas();
  }
}

function esCorreoPermitido(correo) {
  const regex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(correo.trim());
}

function esPasswordValida(password) {
  return password.length >= 4 && password.length <= 10;
}

function calcularDV(rutSinDV) {
  const multiplos = [2, 3, 4, 5, 6, 7];
  let suma = 0;
  let j = 0;
  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    suma = suma + parseInt(rutSinDV[i], 10) * multiplos[j];
    j = j + 1;
    if (j > 5) {
      j = 0;
    }
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) {
    return "0";
  }
  if (resto === 10) {
    return "K";
  }
  return "" + resto;
}

function esRunValido(valor) {
  const limpio = valor.trim().toUpperCase();
  if (limpio.length < 7 || limpio.length > 9) {
    return false;
  }
  for (let i = 0; i < limpio.length - 1; i++) {
    if (limpio[i] < "0" || limpio[i] > "9") {
      return false;
    }
  }
  const cuerpo = limpio.substring(0, limpio.length - 1);
  const dv = limpio.substring(limpio.length - 1);
  return calcularDV(cuerpo) === dv;
}

function mostrarError(input, mensaje) {
  const campo = input.closest(".field");
  if (!campo) {
    return;
  }
  campo.classList.add("error");
  const msgEl = campo.querySelector(".error-msg");
  if (msgEl) {
    msgEl.textContent = mensaje;
  }
}

function limpiarError(input) {
  const campo = input.closest(".field");
  if (campo) {
    campo.classList.remove("error");
  }
}

function mostrarFeedback(form, ok, mensajeOk, mensajeError) {
  const feedback = form.querySelector(".form-feedback");
  if (!feedback) {
    return;
  }
  if (ok) {
    feedback.textContent = mensajeOk || "Formulario enviado correctamente.";
    feedback.className = "form-feedback show ok";
  } else {
    feedback.textContent = mensajeError || "Revisa los campos marcados en rojo.";
    feedback.className = "form-feedback show fail";
  }
}
