export const ENVIO_GRATIS = 50000;

export function formatCLP(valor) {
  return '$' + Number(valor).toLocaleString('es-CL');
}

export function contiene(texto, busqueda) {
  return texto.toLowerCase().includes(busqueda.trim().toLowerCase());
}

export function minutosLectura(parrafos) {
  const palabras = parrafos.join(' ').split(/\s+/).length;
  return Math.max(1, Math.round(palabras / 200));
}
