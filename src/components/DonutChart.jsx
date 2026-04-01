import { useT } from "../context/ThemeContext";
import { DONUT_COLORS } from "../constants";

export function DonutChart({ data, size = 160 }) {
  const { t } = useT();
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2, r = size / 2 - 12, sw = 24;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.track} strokeWidth={sw} />
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circ;
          const seg = (
            <circle
              key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={sw}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset}
              style={{ transition: "all 0.8s ease" }}
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center" }}>
        {data.slice(0, 6).map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
            <span style={{ color: t.textSec, fontWeight: 500 }}>{d.label}</span>
            <span style={{ color: t.textTer, fontWeight: 600 }}>({(d.value / total * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
