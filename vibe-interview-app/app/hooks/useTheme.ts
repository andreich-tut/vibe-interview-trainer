import { useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
}

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSavedTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light" || saved === "system") {
    return saved;
  }
  return "system";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    return getSystemTheme();
  }
  return mode;
}

function applyTheme(resolved: ResolvedTheme): void {
  document.documentElement.setAttribute("data-theme", resolved);
}

function buildState(): ThemeState {
  const theme = getSavedTheme();
  const resolvedTheme = resolveTheme(theme);
  return { theme, resolvedTheme };
}

// Module-level store for useSyncExternalStore
let currentState: ThemeState | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): ThemeState {
  if (currentState === null) {
    currentState = buildState();
    applyTheme(currentState.resolvedTheme);
  }
  return currentState;
}

const SERVER_SNAPSHOT: ThemeState = { theme: "system", resolvedTheme: "dark" };

function getServerSnapshot(): ThemeState {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  // Listen for system color scheme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = (): void => {
    if (currentState?.theme === "system") {
      const resolvedTheme = getSystemTheme();
      currentState = { theme: "system", resolvedTheme };
      applyTheme(resolvedTheme);
      notify();
    }
  };
  mediaQuery.addEventListener("change", handleMediaChange);

  // Listen for storage changes from other tabs
  const handleStorage = (e: StorageEvent): void => {
    if (e.key === STORAGE_KEY) {
      currentState = buildState();
      applyTheme(currentState.resolvedTheme);
      notify();
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(onStoreChange);
    mediaQuery.removeEventListener("change", handleMediaChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useTheme(): {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: ThemeMode) => void;
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((t: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, t);
    const resolvedTheme = t === "system" ? getSystemTheme() : t;
    currentState = { theme: t, resolvedTheme };
    applyTheme(resolvedTheme);
    notify();
  }, []);

  return {
    theme: state.theme,
    resolvedTheme: state.resolvedTheme,
    setTheme,
  };
}
