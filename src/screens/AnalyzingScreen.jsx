import { Toggle } from "../components/Toggle";

export function AnalyzingScreen({ progress }) {
  const pct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-10"><Toggle /></div>
      <div className="max-w-105 w-full text-center">
        <div className="text-[36px] mb-4">⚡</div>
        <h2 className="text-xl font-bold text-text mb-1">Running analysis</h2>
        <p className="text-[13px] text-accent font-semibold mb-6">{progress.label}</p>
        <div className="w-full h-1.5 bg-track rounded-full overflow-hidden">
          <div
            className="h-full bg-grad rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[12px] text-text-mut mt-3">{progress.current}/{progress.total} queries</p>
      </div>
    </div>
  );
}
