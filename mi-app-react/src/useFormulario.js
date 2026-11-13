import { useState } from 'react';

function revisar(validar, form) {
  const datos = Object.fromEntries(new FormData(form));
  const errores = Object.fromEntries(
    Object.entries(validar(datos)).filter(([, mensaje]) => mensaje),
  );
  return { datos, errores };
}

export default function useFormulario(validar) {
  const [errores, setErrores] = useState({});
  const [feedback, setFeedback] = useState(null);

  function onBlur(event) {
    const { name } = event.target;
    if (!name) return;
    const encontrados = revisar(validar, event.currentTarget).errores;
    setErrores((previos) => ({ ...previos, [name]: encontrados[name] }));
  }

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

  return { errores, setErrores, feedback, setFeedback, onBlur, onSubmit };
}
