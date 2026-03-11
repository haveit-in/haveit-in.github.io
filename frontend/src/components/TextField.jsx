export default function TextField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  onChange,
  right,
  error,
  inputMode,
}) {
  return (
    <div className="field">
      <div className="labelRow">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        {right}
      </div>
      <input
        id={id}
        className="input"
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error) || undefined}
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  )
}

