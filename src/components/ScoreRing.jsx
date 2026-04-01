import { useT } from "../context/ThemeContext";

export function ScoreRing({ score, size = 80, stroke = 6, color }) {
  const { t } = useT();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const c = color || (score >= 50 ? "#10B981" : score >= 25 ? "#F59E0B" : "#EF4444");
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.track} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={c} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}
