import { ScoreRing } from "../components/ScoreRing";
import { DonutChart } from "../components/DonutChart";
import { Bar } from "../components/Bar";
import { STAGE_DOT } from "../constants";

export function OverviewTab({ results }) {
  return (
    <>
      {/* Visibility Score Hero */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 mb-4 flex items-center gap-6 flex-wrap transition-colors duration-300">
        <div>
          <div className="text-[11px] font-bold text-text-ter uppercase tracking-widest mb-1.5">Presence Rate</div>
          <div className="text-[48px] font-extrabold text-text leading-none">{results.presenceRate.toFixed(0)}%</div>
          <div
            className="text-[12px] font-semibold mt-1"
            style={{ color: results.presenceRate >= 60 ? "#10B981" : results.presenceRate >= 30 ? "#F59E0B" : "#EF4444" }}
          >
            {results.presenceRate >= 60 ? "Strong presence" : results.presenceRate >= 30 ? "Moderate — room to grow" : "Low — action needed"}
          </div>
          <div className="text-[11px] text-text-ter mt-1">
            Mentioned in {results.presenceCount} of {results.totalChecks} prompts
          </div>
          <div className="text-[11px] text-text-ter mt-2">
            Share of voice: <span className="font-semibold text-text-sec">{results.overall.toFixed(0)}%</span>
            <span className="ml-1 opacity-60">(vs all brands)</span>
          </div>
        </div>
        <div className="flex gap-4 ml-auto">
          {[{ l: "ChatGPT", s: results.openaiPresence, c: "#10A37F" }, { l: "Gemini", s: results.geminiPresence, c: "#4285F4" }].map((x, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-block">
                <ScoreRing score={x.s} size={64} stroke={5} color={x.c} />
                <div className="absolute inset-0 flex items-center justify-center text-[14px] font-extrabold text-text">
                  {x.s.toFixed(0)}%
                </div>
              </div>
              <div className="text-[11px] font-semibold text-text-ter mt-1">{x.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: Donut + Top Sources */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="bg-bg-card border border-border rounded-2xl p-5 transition-colors duration-300">
          <h3 className="text-[14px] font-bold text-text mb-4">Brands Mentioned</h3>
          <DonutChart data={results.brands.slice(0, 6).map(b => ({ label: b.name, value: b.count }))} size={150} />
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-5 transition-colors duration-300">
          <h3 className="text-[14px] font-bold text-text mb-4">Top 10 Sources</h3>
          <div className="flex flex-col gap-2.5">
            {results.citations.slice(0, 10).map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <a
                    href={`https://${c.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-accent font-medium overflow-hidden text-ellipsis whitespace-nowrap no-underline"
                  >
                    {c.domain}
                  </a>
                  <div className="flex gap-0.75">
                    {c.llms.map(l => (
                      <div key={l} className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: l === "OpenAI" ? "#10A37F" : "#4285F4" }} />
                    ))}
                  </div>
                </div>
                <span className="text-[12px] font-bold text-text-sec whitespace-nowrap">{c.pct.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 transition-colors duration-300">
        <h3 className="text-[14px] font-bold text-text mb-4">Visibility by Stage</h3>
        {results.stages.map((st, i) => (
          <div key={i} className={i < results.stages.length - 1 ? "mb-3.5" : ""}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: STAGE_DOT[st.stage] }} />
                <span className="text-[13px] font-semibold text-text-sec">{st.stage}</span>
              </div>
              <span className="text-[13px] font-bold text-text">{Math.round(st.score)}%</span>
            </div>
            <Bar value={st.score} color={STAGE_DOT[st.stage]} />
          </div>
        ))}
      </div>
    </>
  );
}
