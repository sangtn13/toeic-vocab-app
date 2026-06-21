import type { ReactNode } from "react";
import { I18nMessagesProvider } from "@/app/i18n-provider";
import type { Locale } from "@/lib/preferences";
import { getLocaleMessages } from "@/locales/get-locale-namespace";
import type { AppMessageNamespace } from "@/locales/types";

export function RouteMessagesProvider({
  children,
  locale,
  namespaces
}: {
  children: ReactNode;
  locale: Locale;
  namespaces: readonly AppMessageNamespace[];
}) {
  return (
    <I18nMessagesProvider messages={getLocaleMessages(locale, namespaces)}>
      {children}
    </I18nMessagesProvider>
  );
}
