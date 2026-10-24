import {
  OBLIGATORIO,
  errorCorreo,
  esCorreoPermitido,
  esPasswordValida,
} from '../validaciones';
import { contiene, formatCLP } from '../formato';

describe('Funciones de validación y formato', () => {
  it('acepta solo correos de duoc.cl, profesor.duoc.cl y gmail.com', () => {
    expect(esCorreoPermitido('alumno@duoc.cl')).toBeTrue();
    expect(esCorreoPermitido('profe@profesor.duoc.cl')).toBeTrue();
    expect(esCorreoPermitido(' Persona@GMAIL.com ')).toBeTrue();
    expect(esCorreoPermitido('persona@hotmail.com')).toBeFalse();
    expect(esCorreoPermitido('sin-arroba.cl')).toBeFalse();
  });

  it('exige contraseñas de 4 a 10 caracteres', () => {
    expect(esPasswordValida('abc')).toBeFalse();
    expect(esPasswordValida('abcd')).toBeTrue();
    expect(esPasswordValida('abcdefghij')).toBeTrue();
    expect(esPasswordValida('abcdefghijk')).toBeFalse();
  });

  it('devuelve el mensaje de error de correo que corresponde', () => {
    expect(errorCorreo('   ')).toBe(OBLIGATORIO);
    expect(errorCorreo('a@yahoo.com')).toContain('@duoc.cl');
    expect(errorCorreo('a@duoc.cl')).toBe('');
  });

  it('formatea precios en pesos chilenos y busca sin distinguir mayúsculas', () => {
    expect(formatCLP(45990)).toBe('$45.990');
    expect(contiene('Farol Exterior', '  FAROL ')).toBeTrue();
    expect(contiene('Farol Exterior', 'lampara')).toBeFalse();
  });
});
