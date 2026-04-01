import { useT } from "../context/ThemeContext";

export function Bar({ value, color, h = 5 }) {
  const { t } = useT();
  return (
    <div style={{ width: "100%", height: h, background: t.track, borderRadius: 100, overflow: "hidden" }}>
      <div style={{
        width: `${Math.min(100, value)}%`, height: "100%",
        background: color || t.accent, borderRadius: 100,
        transition: "width 0.6s ease",
      }} />
    </div>
  );
}
