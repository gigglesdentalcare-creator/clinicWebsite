"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

// Reflects <html class="dark">, which ThemeScript sets before paint. `isDark` starts `null` so
// this renders nothing until mount — the server can't know the visitor's stored preference, and
// guessing would risk a mismatch flash.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // One-time read of DOM state ThemeScript already set before hydration, so this can only
    // ever run once per mount (empty deps) — not the "cascading renders" pattern the lint rule
    // otherwise guards against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private browsing / blocked storage: theme just won't persist across visits.
    }
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-primary/10"
    >
      {isDark !== null && (isDark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />)}
    </button>
  );
}
