import { createContext, useContext, useState, useCallback } from "react";
import { themes } from "../constants";

export const ThemeCtx = createContext();

export const useT = () => useContext(ThemeCtx);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const tog = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);
  const t = themes[mode];
  return (
    <ThemeCtx.Provider value={{ t, mode, tog }}>
      {children}
    </ThemeCtx.Provider>
  );
}
