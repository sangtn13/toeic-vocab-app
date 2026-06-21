export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";
export type Locale = "vi" | "en";
export const supportedLocales = ["vi", "en"] as const;

export const preferenceStorageKeys = {
  themeMode: "vocasa-theme-mode",
  locale: "vocasa-locale"
} as const;

export const preferenceCookieKeys = {
  themeMode: preferenceStorageKeys.themeMode,
  locale: preferenceStorageKeys.locale
} as const;

export const preferenceCookieMaxAge = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "vi" || value === "en";
}

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function getDefaultLocale(): Locale {
  return "vi";
}

export function getDefaultThemeMode(): ThemeMode {
  return "system";
}

export function resolveTheme(themeMode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (themeMode === "system") {
    return prefersDark ? "dark" : "light";
  }

  return themeMode;
}
