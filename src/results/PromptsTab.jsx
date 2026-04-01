import { useT } from "../context/ThemeContext";
import { Pill } from "../components/Pill";
import { STAGE_PILL } from "../constants";

export function PromptsTab({ promptData }) {
  const { t } = useT();
  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };
  const hd = { fontSize: 14, fontWeight: 700, color: t.text, margin: 0 };
  const sub = { fontSize: 13, color: t.textTer, margin: 0 };

  return (
    <div style={{ ...card, overflowX: "auto" }}>
      <h3 style={{ ...hd, marginBottom: 4 }}>Per-Prompt Visibility</h3>
      <p style={{ ...sub, marginBottom: 18 }}>How your brand performed for each query</p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 600 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${t.border}` }}>
            {["Prompt", "Visibility", "Mentioned In", "Most Visible"].map((label, i) => (
              <th key={i} style={{
                textAlign: i === 0 || i === 3 ? "left" : "center",
                padding: "10px 12px", fontSize: 10, fontWeight: 700, color: t.textMut,
                textTransform: "uppercase", letterSpacing: "0.06em",
                width: i === 1 ? 80 : i === 2 ? 100 : i === 3 ? 140 : undefined,
              }}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {promptData.map((p, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
              <td style={{ padding: "14px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 3 }}>{p.prompt}</div>
                <Pill bg={STAGE_PILL[p.stage].bg} color={STAGE_PILL[p.stage].c}>{p.stage}</Pill>
              </td>
              <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: 700, color: t.text }}>
                {p.vis.toFixed(0)}%
              </td>
              <td style={{ padding: "14px 12px" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                  {["OpenAI", "Gemini"].map(l => (
                    <div key={l} style={{
                      width: 22, height: 22, borderRadius: 11,
                      background: p.llms[l]?.mentioned ? (l === "OpenAI" ? "#10A37F" : "#4285F4") : t.track,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: p.llms[l]?.mentioned ? "#fff" : t.textMut,
                      fontWeight: 700, opacity: p.llms[l]?.mentioned ? 1 : 0.4,
                    }}>
                      {l === "OpenAI" ? "C" : "G"}
                    </div>
                  ))}
                </div>
              </td>
              <td style={{ padding: "14px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.textSec }}>{p.mostVisible}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
