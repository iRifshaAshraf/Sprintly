"use client";

import { useState, useEffect } from "react";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"; // server-side fallback
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
  return saved || "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return { theme, toggleTheme };
}