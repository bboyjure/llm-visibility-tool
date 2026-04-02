import { createContext, useContext, useState, useCallback, useEffect } from "react";

export const ThemeCtx = createContext();

export const useT = () => useContext(ThemeCtx);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");
  const tog = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return (
    <ThemeCtx.Provider value={{ mode, tog }}>
      {children}
    </ThemeCtx.Provider>
  );
}
