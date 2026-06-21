"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/app/i18n-provider";
import { PreferencesProvider } from "@/app/preferences-provider";
import { queryClient } from "@/lib/query-client";
import type { Locale } from "@/lib/preferences";
import type { AppMessages } from "@/locales/types";

const AppBootstrap = dynamic(
  () => import("@/components/app-shell/app-bootstrap").then((module) => module.AppBootstrap),
  {
    ssr: false
  }
);

const Toaster = dynamic(
  () => import("sonner").then((module) => module.Toaster),
  {
    ssr: false
  }
);

export function ProvidersClient({
  children,
  initialLocale,
  messages
}: {
  children: ReactNode;
  initialLocale: Locale;
  messages: AppMessages;
}) {
  return (
    <I18nProvider messages={messages}>
      <PreferencesProvider initialLocale={initialLocale}>
        <QueryClientProvider client={queryClient}>
          <AppBootstrap />
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              className: "font-sans"
            }}
          />
        </QueryClientProvider>
      </PreferencesProvider>
    </I18nProvider>
  );
}
