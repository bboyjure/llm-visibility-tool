import { Toggle } from "../components/Toggle";
import { Pill } from "../components/Pill";

export function InputScreen({ url, setUrl, error, setError, onGenerate }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-10"><Toggle /></div>
      <div className="w-full max-w-[520px] text-center">
        <Pill bg="var(--color-accent-bg)" color="var(--color-accent-text)">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          AI Visibility Tool
        </Pill>
        <h1 className="text-[clamp(26px,5vw,40px)] font-extrabold text-text leading-tight mt-5 mb-3 tracking-tight">
          How visible is your<br />brand in <span className="text-accent">AI search</span>?
        </h1>
        <p className="text-[15px] text-text-sec max-w-[380px] mx-auto mb-8 leading-relaxed">
          Analyze your brand's presence in ChatGPT and Gemini.
        </p>
        <div className="bg-bg-card border border-border rounded-2xl p-7 transition-colors duration-300">
          <div className="relative mb-3.5">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-mut" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2" />
            </svg>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && onGenerate()}
              placeholder="yourwebsite.com"
              className="w-full py-3.5 pr-4 pl-[42px] rounded-xl border border-input-border text-[15px] outline-none bg-input-bg text-text"
            />
          </div>
          <button
            onClick={onGenerate}
            className="bg-grad text-white border-none rounded-xl py-3.5 px-7 text-[15px] font-semibold cursor-pointer w-full"
          >
            Analyze Visibility →
          </button>
          {error && <p className="text-[#EF4444] text-[13px] mt-3 text-left">{error}</p>}
        </div>
        <div className="flex justify-center gap-5 mt-7 flex-wrap">
          {["ChatGPT & Gemini", "5 buying stages", "Citation analysis"].map((x, i) => (
            <span key={i} className="text-[12px] text-text-mut flex items-center gap-1">
              <svg width="14" height="14" fill="none" stroke="#10B981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
