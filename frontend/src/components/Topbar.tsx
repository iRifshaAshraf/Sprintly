"use client";

import { useTheme } from "@/lib/useTheme";

function getFormattedDate(): string {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Topbar() {
  const { toggleTheme } = useTheme();
  const formattedDate = getFormattedDate();

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-3 border-b border-border">
      <span className="text-sm text-muted" suppressHydrationWarning>
        {formattedDate}
      </span>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full border border-border bg-card text-foreground hover:opacity-80 transition"
        aria-label="Toggle theme"
      >
        <span className="dark:hidden">🌙</span>
        <span className="hidden dark:inline">☀️</span>
      </button>
    </div>
  );
}