import { useT } from "../context/ThemeContext";

export function CitationsTab({ citations }) {
  const { t } = useT();
  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };
  const hd = { fontSize: 14, fontWeight: 700, color: t.text, margin: 0 };
  const sub = { fontSize: 13, color: t.textTer, margin: 0 };

  return (
    <div style={card}>
      <h3 style={{ ...hd, marginBottom: 4 }}>Top Cited Sources</h3>
      <p style={{ ...sub, marginBottom: 18 }}>Where LLMs sourced their answers</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {citations.map((c, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", borderBottom: i < citations.length - 1 ? `1px solid ${t.borderLight}` : "none", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7, background: t.track,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: t.textTer, flexShrink: 0,
              }}>
                {c.domain.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <a href={`https://${c.domain}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: t.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: "none", display: "block" }}>{c.domain}</a>
                {c.urls.length > 0 && (
                  <a href={c.urls[0]} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: t.textMut, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300, textDecoration: "none", display: "block" }}>{c.urls[0]}</a>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {c.llms.map(l => (
                  <div key={l} style={{
                    width: 16, height: 16, borderRadius: 8,
                    background: l === "OpenAI" ? "#10A37F" : "#4285F4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, color: "#fff", fontWeight: 700,
                  }}>
                    {l === "OpenAI" ? "C" : "G"}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text, minWidth: 60, textAlign: "right" }}>{c.count} resp.</span>
            </div>
          </div>
        ))}
      </div>
      {citations.length === 0 && (
        <p style={{ textAlign: "center", color: t.textMut, padding: 40 }}>No citations detected.</p>
      )}
    </div>
  );
}
