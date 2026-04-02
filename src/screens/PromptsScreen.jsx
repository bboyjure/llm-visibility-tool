import { Toggle } from "../components/Toggle";
import { Pill } from "../components/Pill";
import { STAGE_PILL } from "../constants";

export function PromptsScreen({ prompts, brandName, onAnalyze, onBack }) {
  return (
    <div className="min-h-screen bg-bg py-10 px-4 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-10"><Toggle /></div>
      <div className="max-w-150 mx-auto">
        <Pill bg="var(--color-accent-bg)" color="var(--color-accent-text)">Step 2 of 3</Pill>
        <h2 className="text-[clamp(22px,4vw,28px)] font-extrabold text-text mt-3.5 mb-1.5">
          Prompts for <span className="text-accent">{brandName}</span>
        </h2>
        <p className="text-[13px] text-text-ter mb-5">Customer queries across buying stages.</p>
        <div className="flex flex-col gap-2">
          {prompts.map((p, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-2xl px-4 py-3.5 flex items-start gap-3 transition-colors duration-300">
              <Pill bg={STAGE_PILL[p.stage].bg} color={STAGE_PILL[p.stage].c}>{p.stage}</Pill>
              <span className="text-[14px] text-text-sec leading-relaxed">"{p.prompt}"</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onBack}
            className="bg-bg-card text-text-sec border border-border rounded-xl py-3 px-5 text-[14px] font-semibold cursor-pointer"
          >
            ← Back
          </button>
          <button
            onClick={onAnalyze}
            className="bg-grad text-white border-none rounded-xl py-3 px-7 text-[14px] font-semibold cursor-pointer flex-1"
          >
            Run Analysis →
          </button>
        </div>
      </div>
    </div>
  );
}
