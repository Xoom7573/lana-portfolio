// Light / dark theme, shared by the layout's startup script and ThemeToggle.
// The colours themselves live in app/globals.css; these are only for the browser bar.

export type Theme = "light" | "dark";

// Remembers the theme a visitor picked. Without it the site follows their system.
export const themeStorageKey = "theme";

// Browser bar colour per theme: --color-ground in app/globals.css.
export const themeColors: Record<Theme, string> = {
  light: "#5d0e2a",
  dark: "#14070c",
};
