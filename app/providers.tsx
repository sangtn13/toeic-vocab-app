import type { ReactNode } from "react";
import { ProvidersClient } from "@/app/providers-client";
import type { Locale } from "@/lib/preferences";
import { getLocaleMessages } from "@/locales/get-locale-namespace";
import type { AppMessageNamespace } from "@/locales/types";

const sharedNamespaces = [
  "app",
  "auth",
  "common",
  "hooks",
  "preferences"
] as const satisfies readonly AppMessageNamespace[];

export function Providers({
  children,
  initialLocale,
  namespaces = sharedNamespaces
}: {
  children: ReactNode;
  initialLocale: Locale;
  namespaces?: readonly AppMessageNamespace[];
}) {
  return (
    <ProvidersClient
      initialLocale={initialLocale}
      messages={getLocaleMessages(initialLocale, namespaces)}
    >
      {children}
    </ProvidersClient>
  );
}
