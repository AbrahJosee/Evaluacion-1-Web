export const OBLIGATORIO = 'Este campo es obligatorio.';

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
