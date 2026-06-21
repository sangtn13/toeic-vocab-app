"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  getDefaultLocale,
  getDefaultThemeMode,
  isThemeMode,
  preferenceCookieKeys,
  preferenceCookieMaxAge,
  preferenceStorageKeys,
  resolveTheme,
  type Locale,
  type ResolvedTheme,
  type ThemeMode
} from "@/lib/preferences";

type PreferencesContextValue = {
  hasHydrated: boolean;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setThemeMode: (themeMode: ThemeMode) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function buildPreferenceCookie(name: string, value: string) {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${preferenceCookieMaxAge}; SameSite=Lax`;
}

function getInitialThemeMode() {
  if (typeof window === "undefined") {
    return getDefaultThemeMode();
  }

  const storedThemeMode = window.localStorage.getItem(preferenceStorageKeys.themeMode);
  return isThemeMode(storedThemeMode) ? storedThemeMode : getDefaultThemeMode();
}

function getInitialSystemPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function PreferencesProvider({
  children,
  initialLocale = getDefaultLocale()
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [prefersDark, setPrefersDark] = useState<boolean>(getInitialSystemPreference);

  const resolvedTheme = useMemo(
    () => resolveTheme(themeMode, prefersDark),
    [prefersDark, themeMode]
  );

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updatePreference = (event?: MediaQueryListEvent) => {
      setPrefersDark(event?.matches ?? mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(preferenceStorageKeys.locale, locale);
    document.cookie = buildPreferenceCookie(preferenceCookieKeys.locale, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(preferenceStorageKeys.themeMode, themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({
      hasHydrated,
      locale,
      setLocale,
      themeMode,
      resolvedTheme,
      setThemeMode
    }),
    [hasHydrated, locale, resolvedTheme, themeMode]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider.");
  }

  return context;
}
