"use client";

import { Moon, Sun } from "lucide-react";
import { useDocsTheme } from "./docs-theme-provider";

export function DocsThemeToggle() {
  const { theme, toggleTheme } = useDocsTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
