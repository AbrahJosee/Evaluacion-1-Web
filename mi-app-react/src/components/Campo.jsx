export default function Campo({
  id,
  label,
  error,
  hint,
  as: Control = 'input',
  className = 'mb-3',
  children,
  ...props
}) {
  const clase = Control === 'select' ? 'form-select' : 'form-control';

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <Control
        id={id}
        className={`${clase}${error ? ' is-invalid' : ''}`}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </Control>
      {hint && <div className="form-text">{hint}</div>}
      <div className="invalid-feedback">{error}</div>
    </div>
  );
}

export function Feedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div
      className={`alert alert-${feedback.ok ? 'success' : 'danger'} d-flex align-items-center gap-2`}
      role="alert"
    >
      <i
        className={`bi ${feedback.ok ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}
        aria-hidden="true"
      />
      {feedback.texto}
    </div>
  );
}
