"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "theme";

const SUPPORTED_THEMES: Theme[] = ["light", "dark"];
const themeListeners = new Set<() => void>();

interface ThemeContextValue {
  changeTheme: (theme: string) => void;
  currentTheme: Theme;
  supportedThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function normalizeTheme(value: string | null | undefined): Theme {
  return value === "dark" || value === "light" ? value : DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
}

function getServerThemeSnapshot() {
  return DEFAULT_THEME;
}

function subscribeToTheme(callback: () => void) {
  themeListeners.add(callback);

  return () => {
    themeListeners.delete(callback);
  };
}

function notifyThemeListeners() {
  themeListeners.forEach((callback) => callback());
}

function persistTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  notifyThemeListeners();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const currentTheme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    const storedTheme = getThemeSnapshot();

    persistTheme(storedTheme);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      applyTheme(getThemeSnapshot());
      notifyThemeListeners();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const changeTheme = useCallback((theme: string) => {
    const nextTheme = normalizeTheme(theme);

    persistTheme(nextTheme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      changeTheme,
      currentTheme,
      supportedThemes: SUPPORTED_THEMES,
    }),
    [changeTheme, currentTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
