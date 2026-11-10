"use client";

import { useEffect, useSyncExternalStore } from "react";
import { themeColors, themeStorageKey, type Theme } from "@/theme";

const root = () => document.documentElement;
const currentTheme = (): Theme => (root().dataset.theme === "dark" ? "dark" : "light");

const savedTheme = (): Theme | null => {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null; // Storage can be blocked; then we just follow the system.
  }
};

function applyTheme(theme: Theme) {
  root().dataset.theme = theme;
  // The layout renders one theme-color per system theme. Point both at the active one
  // so the browser bar matches a theme the visitor picked themselves.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = themeColors[theme];
  });
}

// Every toggle (desktop nav and mobile menu) reads the theme from <html>, so they stay in sync.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function Sun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" />
    </svg>
  );
}

// Sun / moon button. Follows the system theme until clicked, then remembers the choice.
export default function ThemeToggle({ label, className = "" }: { label: string; className?: string }) {
  const isDark = useSyncExternalStore(subscribe, () => currentTheme() === "dark", () => false);

  useEffect(() => {
    const saved = savedTheme();
    if (saved) applyTheme(saved);

    // Without a saved choice, keep following the system when it changes.
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => !savedTheme() && applyTheme(query.matches ? "dark" : "light");
    query.addEventListener("change", onSystemChange);
    return () => query.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // Not remembered, but it still switches for this visit.
    }

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      applyTheme(next);
      return;
    }

    // Wipe the new theme in as a circle growing out of the button.
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      root().animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.2, 0.75, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-[color,transform] duration-500 ease-editorial hover:-rotate-12 ${className}`}
    >
      {/* Swapped with CSS, so the right icon shows before React hydrates. */}
      <span className="dark:hidden">
        <Moon />
      </span>
      <span className="hidden dark:block">
        <Sun />
      </span>
    </button>
  );
}
