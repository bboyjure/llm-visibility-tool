import { DONUT_COLORS } from "../constants";

export function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2, r = size / 2 - 12, sw = 24;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-3.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-track)" strokeWidth={sw} />
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
      <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 justify-center">
        {data.slice(0, 6).map((d, i) => (
          <div key={i} className="flex items-center gap-1 text-[11px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-text-sec font-medium">{d.label}</span>
            <span className="text-text-ter font-semibold">({(d.value / total * 100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
