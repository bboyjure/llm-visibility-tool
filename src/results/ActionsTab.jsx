import { useT } from "../context/ThemeContext";
import { Pill } from "../components/Pill";

export function ActionsTab({ recs }) {
  const { t } = useT();
  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: t.grad, borderRadius: 14, padding: "22px 24px", color: "#fff" }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 4px" }}>Recommended Actions</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>Based on where LLMs source their answers.</p>
      </div>
      {recs.map((rec, i) => (
        <div key={i} style={{ ...card, display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: t.track, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            {rec.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{rec.action}</span>
              <Pill bg={rec.pri === "High" ? "#EF444420" : "#F59E0B20"} color={rec.pri === "High" ? "#F87171" : "#FBBF24"}>
                {rec.pri}
              </Pill>
              {rec.type && <Pill bg={t.accentBg} color={t.accentText}>{rec.type}</Pill>}
            </div>
            <p style={{ fontSize: 12, color: t.textSec, lineHeight: 1.6, margin: 0 }}>{rec.detail}</p>
            {rec.source && <div style={{ fontSize: 11, color: t.textMut, marginTop: 6 }}>Source: {rec.source}</div>}
            {rec.links && rec.links.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8 }}>
                {rec.links.map((link, j) => (
                  <div key={j} style={{ fontSize: 11, color: t.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}>
                    🔗 {link}
                  </div>
                ))}
              </div>
            )}
            {rec.domains && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                {rec.domains.map((d, j) => (
                  <span key={j} style={{ fontSize: 10, background: t.track, color: t.textTer, padding: "3px 8px", borderRadius: 5, fontWeight: 500 }}>{d}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {recs.length === 0 && (
        <div style={{ ...card, textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <p style={{ color: t.textTer, fontWeight: 600 }}>Visibility is strong!</p>
        </div>
      )}
    </div>
  );
}
