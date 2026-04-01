import { useT } from "../context/ThemeContext";
import { Toggle } from "../components/Toggle";
import { getDom } from "../api/llm";

export function GeneratingScreen({ url }) {
  const { t } = useT();
  const page = { fontFamily: "'Inter',-apple-system,system-ui,sans-serif", minHeight: "100vh", background: t.bg, transition: "background 0.3s" };

  return (
    <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}><Toggle /></div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, border: `3px solid ${t.border}`, borderTopColor: t.accent,
          borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite",
        }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 6 }}>Analyzing your website</h2>
        <p style={{ fontSize: 14, color: t.textSec }}>Generating prompts for <strong style={{ color: t.accent }}>{getDom(url)}</strong></p>
        <p style={{ fontSize: 12, color: t.textMut, marginTop: 16 }}>Usually 30–60 seconds</p>
      </div>
    </div>
  );
}
