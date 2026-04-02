import { useT } from "../context/ThemeContext";

export function Toggle() {
  const { mode, tog } = useT();
  return (
    <button
      onClick={tog}
      className="w-9 h-9 rounded-lg border-none cursor-pointer flex items-center justify-center text-base bg-track"
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
