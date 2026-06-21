import { isLocale, type Locale } from "@/lib/preferences";
import type { EntityId } from "@/types/common";

const routes = {
  home: "/",
  admin: "/admin"
} as const;

function normalizePath(path: string) {
  if (!path || path === "/") {
    return "";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function buildLocalizedRoute(locale: Locale, path: string = routes.home) {
  const normalizedPath = normalizePath(path);
  return `/${locale}${normalizedPath}`;
}

export function buildHomeRoute(locale: Locale) {
  return buildLocalizedRoute(locale);
}

export function buildAdminRoute(locale: Locale) {
  return buildLocalizedRoute(locale, routes.admin);
}

export function buildStudySetRoute(locale: Locale, slug: string) {
  return buildLocalizedRoute(locale, `/study-sets/${slug}`);
}

export function buildPracticeRoute(locale: Locale, slug: string, unitId: EntityId) {
  return `${buildStudySetRoute(locale, slug)}/units/${unitId}`;
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [segment] = pathname.split("/").filter(Boolean);
  return isLocale(segment) ? segment : null;
}

export function stripLocalePrefix(pathname: string) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return pathname || routes.home;
  }

  const withoutLocale = pathname.slice(locale.length + 1);
  return withoutLocale ? (withoutLocale.startsWith("/") ? withoutLocale : `/${withoutLocale}`) : routes.home;
}

export function isHomePath(pathname: string) {
  return stripLocalePrefix(pathname) === routes.home;
}

export function replaceLocaleInPathname(pathname: string, locale: Locale) {
  return buildLocalizedRoute(locale, stripLocalePrefix(pathname));
}

export function buildNavigationHref(locale: Locale, anchor: string, isHomePage: boolean) {
  return isHomePage ? anchor : `${buildHomeRoute(locale)}${anchor}`;
}
