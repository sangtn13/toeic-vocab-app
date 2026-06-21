import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { appConfig } from "@/config/app";
import {
  isLocale,
  preferenceStorageKeys,
  supportedLocales,
  type Locale
} from "@/lib/preferences";
import { getMetadataMessages } from "@/locales/scoped";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export function generateMetadata({
  params
}: {
  params: { locale: string };
}): Metadata {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const messages = getMetadataMessages(params.locale);

  return {
    title: `${appConfig.name} | ${messages.appTitleSuffix}`,
    description: messages.appDescription
  };
}

export default function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var themeKey = ${JSON.stringify(preferenceStorageKeys.themeMode)};
                var localeKey = ${JSON.stringify(preferenceStorageKeys.locale)};
                var routeLocale = ${JSON.stringify(locale)};
                var storedTheme = localStorage.getItem(themeKey);
                var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                var resolvedTheme = storedTheme === "light" || storedTheme === "dark"
                  ? storedTheme
                  : (prefersDark ? "dark" : "light");
                document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
                document.documentElement.dataset.theme = resolvedTheme;
                document.documentElement.style.colorScheme = resolvedTheme;
                document.documentElement.lang = routeLocale;
                if (localStorage.getItem(localeKey) !== routeLocale) {
                  localStorage.setItem(localeKey, routeLocale);
                }
              })();
            `
          }}
        />
      </head>
      <body className="font-sans">
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
