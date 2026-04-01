import { useT } from "../context/ThemeContext";
import { Toggle } from "../components/Toggle";
import { Pill } from "../components/Pill";
import { STAGE_PILL } from "../constants";

export function PromptsScreen({ prompts, brandName, onAnalyze, onBack }) {
  const { t } = useT();
  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };
  const sub = { fontSize: 13, color: t.textTer, margin: 0 };
  const page = { fontFamily: "'Inter',-apple-system,system-ui,sans-serif", minHeight: "100vh", background: t.bg, transition: "background 0.3s" };

  return (
    <div style={{ ...page, padding: "40px 16px" }}>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}><Toggle /></div>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Pill bg={t.accentBg} color={t.accentText}>Step 2 of 3</Pill>
        <h2 style={{ fontSize: "clamp(22px,4vw,28px)", fontWeight: 800, color: t.text, margin: "14px 0 6px" }}>
          Prompts for <span style={{ color: t.accent }}>{brandName}</span>
        </h2>
        <p style={{ ...sub, marginBottom: 22 }}>Customer queries across buying stages.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {prompts.map((p, i) => (
            <div key={i} style={{ ...card, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Pill bg={STAGE_PILL[p.stage].bg} color={STAGE_PILL[p.stage].c}>{p.stage}</Pill>
              <span style={{ fontSize: 14, color: t.textSec, lineHeight: 1.5 }}>"{p.prompt}"</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button
            onClick={onBack}
            style={{ background: t.bgCard, color: t.textSec, border: `1px solid ${t.border}`, borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            ← Back
          </button>
          <button
            onClick={onAnalyze}
            style={{ background: t.grad, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", flex: 1 }}
          >
            Run Analysis →
          </button>
        </div>
      </div>
    </div>
  );
}
