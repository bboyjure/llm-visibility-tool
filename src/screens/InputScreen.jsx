import { useT } from "../context/ThemeContext";
import { Toggle } from "../components/Toggle";
import { Pill } from "../components/Pill";

export function InputScreen({ url, setUrl, error, setError, onGenerate }) {
  const { t } = useT();
  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };
  const page = { fontFamily: "'Inter',-apple-system,system-ui,sans-serif", minHeight: "100vh", background: t.bg, transition: "background 0.3s" };

  return (
    <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 10 }}><Toggle /></div>
      <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        <Pill bg={t.accentBg} color={t.accentText}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
          AI Visibility Tool
        </Pill>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 800, color: t.text, lineHeight: 1.15, margin: "20px 0 12px", letterSpacing: "-0.03em" }}>
          How visible is your<br />brand in <span style={{ color: t.accent }}>AI search</span>?
        </h1>
        <p style={{ fontSize: 15, color: t.textSec, maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Analyze your brand's presence in ChatGPT and Gemini.
        </p>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMut }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2" />
            </svg>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && onGenerate()}
              placeholder="yourwebsite.com"
              style={{
                width: "100%", padding: "14px 16px 14px 42px", borderRadius: 10,
                border: `1px solid ${t.inputBorder}`, fontSize: 15, outline: "none",
                background: t.inputBg, color: t.text, boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={onGenerate}
            style={{ background: t.grad, color: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}
          >
            Analyze Visibility →
          </button>
          {error && <p style={{ color: "#EF4444", fontSize: 13, marginTop: 12, textAlign: "left" }}>{error}</p>}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
          {["ChatGPT & Gemini", "5 buying stages", "Citation analysis"].map((x, i) => (
            <span key={i} style={{ fontSize: 12, color: t.textMut, display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="14" height="14" fill="none" stroke="#10B981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
