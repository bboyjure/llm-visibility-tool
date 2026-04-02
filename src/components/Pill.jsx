export function Pill({ children, bg, color }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.75 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  );
}
