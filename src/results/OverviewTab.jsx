import { useT } from "../context/ThemeContext";
import { ScoreRing } from "../components/ScoreRing";
import { DonutChart } from "../components/DonutChart";
import { Bar } from "../components/Bar";
import { STAGE_DOT } from "../constants";

export function OverviewTab({ results }) {
  const { t } = useT();
  const card = { background: t.bgCard, borderRadius: 14, border: `1px solid ${t.border}`, padding: 22, transition: "background 0.3s, border-color 0.3s" };
  const hd = { fontSize: 14, fontWeight: 700, color: t.text, margin: 0 };

  return (
    <>
      {/* Visibility Score Hero */}
      <div style={{ ...card, marginBottom: 16, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textTer, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Visibility Score</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: t.text, lineHeight: 1 }}>{results.overall.toFixed(0)}%</div>
          <div style={{ fontSize: 12, color: results.overall >= 50 ? "#10B981" : results.overall >= 25 ? "#F59E0B" : "#EF4444", fontWeight: 600, marginTop: 4 }}>
            {results.overall >= 50 ? "Strong presence" : results.overall >= 25 ? "Moderate — room to grow" : "Low — action needed"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginLeft: "auto" }}>
          {[{ l: "ChatGPT", s: results.openai, c: "#10A37F" }, { l: "Gemini", s: results.gemini, c: "#4285F4" }].map((x, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <ScoreRing score={x.s} size={64} stroke={5} color={x.c} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: t.text }}>
                  {x.s.toFixed(0)}%
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.textTer, marginTop: 4 }}>{x.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Donut + Top Sources */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <h3 style={{ ...hd, marginBottom: 16 }}>Brands Mentioned</h3>
          <DonutChart data={results.brands.slice(0, 6).map(b => ({ label: b.name, value: b.count }))} size={150} />
        </div>
        <div style={card}>
          <h3 style={{ ...hd, marginBottom: 16 }}>Top 10 Sources</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.citations.slice(0, 10).map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: 13, color: t.text, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.domain}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {c.llms.map(l => (
                      <div key={l} style={{ width: 14, height: 14, borderRadius: 7, background: l === "OpenAI" ? "#10A37F" : "#4285F4", flexShrink: 0 }} />
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textSec, whiteSpace: "nowrap" }}>{c.pct.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div style={card}>
        <h3 style={{ ...hd, marginBottom: 18 }}>Visibility by Stage</h3>
        {results.stages.map((st, i) => (
          <div key={i} style={{ marginBottom: i < results.stages.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: STAGE_DOT[st.stage] }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: t.textSec }}>{st.stage}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{Math.round(st.score)}%</span>
            </div>
            <Bar value={st.score} color={STAGE_DOT[st.stage]} />
          </div>
        ))}
      </div>
    </>
  );
}
