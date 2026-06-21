import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getDefaultLocale,
  isLocale,
  preferenceCookieKeys,
  preferenceCookieMaxAge,
  type Locale
} from "@/lib/preferences";
import { buildLocalizedRoute, getLocaleFromPathname } from "@/config/routes";

function resolvePreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(preferenceCookieKeys.locale)?.value;
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (acceptLanguage.includes("en")) {
    return "en";
  }

  return getDefaultLocale();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLocale = getLocaleFromPathname(pathname);

  if (pathnameLocale) {
    const response = NextResponse.next();
    response.cookies.set(preferenceCookieKeys.locale, pathnameLocale, {
      path: "/",
      maxAge: preferenceCookieMaxAge,
      sameSite: "lax"
    });
    return response;
  }

  const locale = resolvePreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = buildLocalizedRoute(locale, pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
