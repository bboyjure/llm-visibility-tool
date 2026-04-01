import { useT } from "../context/ThemeContext";

export function Toggle() {
  const { mode, tog } = useT();
  return (
    <button
      onClick={tog}
      style={{
        width: 36, height: 36, borderRadius: 8, border: "none",
        background: mode === "dark" ? "#23263A" : "#F0F0F3",
        cursor: "pointer", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 16,
      }}
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
