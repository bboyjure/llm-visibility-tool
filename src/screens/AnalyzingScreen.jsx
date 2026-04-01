import { useT } from "../context/ThemeContext";
import { Toggle } from "../components/Toggle";

export function AnalyzingScreen({ progress }) {
  const { t } = useT();
  const pct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const page = { fontFamily: "'Inter',-apple-system,system-ui,sans-serif", minHeight: "100vh", background: t.bg, transition: "background 0.3s" };
  const pTrack = { width: "100%", height: 5, background: t.track, borderRadius: 100, overflow: "hidden" };

  return (
    <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}><Toggle /></div>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4 }}>Running analysis</h2>
        <p style={{ fontSize: 13, color: t.accent, fontWeight: 600, marginBottom: 24 }}>{progress.label}</p>
        <div style={pTrack}>
          <div style={{ width: `${pct}%`, height: "100%", background: t.grad, borderRadius: 100, transition: "width 0.5s" }} />
        </div>
        <p style={{ fontSize: 12, color: t.textMut, marginTop: 12 }}>{progress.current}/{progress.total} queries</p>
      </div>
    </div>
  );
}
