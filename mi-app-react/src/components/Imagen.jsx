import { useState } from 'react';

export default function Imagen({ src, alt = '', className = '' }) {
  const [fallo, setFallo] = useState(false);

  return (
    <div className={`ph-img ${className}`}>
      {src && !fallo ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFallo(true)} />
      ) : (
        <i className="bi bi-lightbulb" aria-hidden="true" />
      )}
    </div>
  );
}
