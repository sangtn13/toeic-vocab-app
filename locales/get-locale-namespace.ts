import { en } from "@/locales/en";
import { vi } from "@/locales/vi";
import type { Locale } from "@/lib/preferences";
import type {
  AppMessageNamespace,
  AppLocaleMessages,
  AppMessages
} from "@/locales/types";

const localeMessages: Record<Locale, AppLocaleMessages> = {
  en,
  vi
};

export function getLocaleMessages(
  locale: Locale,
  namespaces?: readonly AppMessageNamespace[]
): AppMessages {
  const messages = localeMessages[locale];

  if (!namespaces?.length) {
    return messages;
  }

  return Object.fromEntries(
    namespaces.map((namespace) => [namespace, messages[namespace]])
  ) as AppMessages;
}

export function getLocaleNamespace<K extends AppMessageNamespace>(
  locale: Locale,
  namespace: K
): AppLocaleMessages[K] {
  return localeMessages[locale][namespace];
}
