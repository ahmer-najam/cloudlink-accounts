export default function OdooField({ label, required, children }) {
  return (
    <div className="o-field">
      <label className="o-label">
        {label}
        {required ? <span className="o-required">*</span> : null}
      </label>
      <div className="o-input-wrap">{children}</div>
    </div>
  );
}
