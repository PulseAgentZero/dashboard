"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type DocsTheme = "light" | "dark";

const STORAGE_KEY = "pulse-docs-theme";

type DocsThemeContextValue = {
  theme: DocsTheme;
  setTheme: (theme: DocsTheme) => void;
  toggleTheme: () => void;
};

const DocsThemeContext = createContext<DocsThemeContextValue | null>(null);

function readStoredTheme(): DocsTheme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDocument(theme: DocsTheme) {
  const root = document.documentElement;
  const isDark = theme === "dark";
  root.classList.remove("dark");
  root.classList.toggle("docs-dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

export function DocsThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<DocsTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const initial = readStoredTheme();
    setThemeState(initial);
    applyThemeToDocument(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyThemeToDocument(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark", "docs-dark");
      document.documentElement.style.colorScheme = "";
    };
  }, []);

  const setTheme = useCallback((next: DocsTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <DocsThemeContext.Provider value={value}>
      <div id="docs-root" className="min-h-screen" suppressHydrationWarning>
        {children}
      </div>
    </DocsThemeContext.Provider>
  );
}

export function useDocsTheme() {
  const ctx = useContext(DocsThemeContext);
  if (!ctx) {
    throw new Error("useDocsTheme must be used within DocsThemeProvider");
  }
  return ctx;
}
