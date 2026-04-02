export default function GlassPanel({ title, children, className = "" }) {
  return (
    <section className={`glass-panel ${className}`}>
      {title ? <h3 className="panel-title">{title}</h3> : null}
      {children}
    </section>
  );
}