import { Toggle } from "../components/Toggle";
import { getDom } from "../api/llm";

export function GeneratingScreen({ url }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-10"><Toggle /></div>
      <div className="text-center">
        <div className="w-11 h-11 border-[3px] border-border border-t-accent rounded-full mx-auto mb-5 animate-spin" />
        <h2 className="text-xl font-bold text-text mb-1.5">Analyzing your website</h2>
        <p className="text-[14px] text-text-sec">
          Generating prompts for <strong className="text-accent">{getDom(url)}</strong>
        </p>
        <p className="text-[12px] text-text-mut mt-4">Usually 30–60 seconds</p>
      </div>
    </div>
  );
}
