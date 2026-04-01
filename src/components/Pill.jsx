export function Pill({ children, bg, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 100, fontSize: 11,
      fontWeight: 700, background: bg, color, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}
