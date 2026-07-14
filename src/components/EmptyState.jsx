export default function EmptyState({ glyph = '{ }', title, hint }) {
  return (
    <div className="state-block">
      <div className="state-block__glyph">{glyph}</div>
      <div><strong>{title}</strong></div>
      {hint && <div style={{ marginTop: 6 }}>{hint}</div>}
    </div>
  );
}
