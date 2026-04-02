import { Pill } from "../components/Pill";
import { STAGE_PILL } from "../constants";

export function PromptsTab({ promptData }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5 overflow-x-auto transition-colors duration-300">
      <h3 className="text-[14px] font-bold text-text mb-1">Per-Prompt Visibility</h3>
      <p className="text-[13px] text-text-ter mb-4">How your brand performed for each query</p>
      <table className="w-full border-collapse text-[13px] min-w-150">
        <thead>
          <tr className="border-b-2 border-border">
            {["Prompt", "Visibility", "Mentioned In", "Most Visible"].map((label, i) => (
              <th
                key={i}
                className="px-3 py-2.5 text-[10px] font-bold text-text-mut uppercase tracking-widest"
                style={{
                  textAlign: i === 0 || i === 3 ? "left" : "center",
                  width: i === 1 ? 80 : i === 2 ? 100 : i === 3 ? 140 : undefined,
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {promptData.map((p, i) => (
            <tr key={i} className="border-b border-border-light">
              <td className="px-3 py-3.5">
                <div className="text-[13px] font-medium text-text mb-0.75">{p.prompt}</div>
                <Pill bg={STAGE_PILL[p.stage].bg} color={STAGE_PILL[p.stage].c}>{p.stage}</Pill>
              </td>
              <td className="px-3 py-3.5 text-center font-bold text-text">
                {p.vis.toFixed(0)}%
              </td>
              <td className="px-3 py-3.5">
                <div className="flex justify-center gap-1.5">
                  {["OpenAI", "Gemini"].map(l => (
                    <div
                      key={l}
                      className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: p.llms[l]?.mentioned ? (l === "OpenAI" ? "#10A37F" : "#4285F4") : "var(--color-track)",
                        color: p.llms[l]?.mentioned ? "#fff" : "var(--color-text-mut)",
                        opacity: p.llms[l]?.mentioned ? 1 : 0.4,
                      }}
                    >
                      {l === "OpenAI" ? "C" : "G"}
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-3 py-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
                  <span className="text-[12px] font-semibold text-text-sec">{p.mostVisible}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
