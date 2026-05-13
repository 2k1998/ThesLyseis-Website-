"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Sync state with current class on mount
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    // Render a placeholder or nothing during SSR to avoid mismatch
    return <div className="w-6 h-6" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-400"
    >
      {isDark ? (
        // Moon icon placeholder (text for now as per minimal requirement, or SVG if preferred. PRD says "Button with icon")
        <span className="text-xl">🌙</span>
      ) : (
        <span className="text-xl">☀️</span>
      )}
    </button>
  );
}
