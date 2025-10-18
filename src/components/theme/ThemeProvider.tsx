"use client";

import * as React from "react";

import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with a stable default so server and initial client render match.
  // Read actual value from sessionStorage on mount and update state.
  const [theme, setThemeState] = useState<Theme>("light");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        setThemeState(stored as Theme);
      }
    }
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("theme", theme);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
