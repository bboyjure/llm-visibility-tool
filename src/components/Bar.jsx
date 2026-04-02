export function Bar({ value, color, h = 5 }) {
  return (
    <div className="w-full rounded-full overflow-hidden bg-track" style={{ height: h }}>
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${Math.min(100, value)}%`, background: color || "var(--color-accent)" }}
      />
    </div>
  );
}
