import type { Locale } from "@/lib/preferences";
import { getLocaleNamespace } from "@/locales/get-locale-namespace";

export function getMetadataMessages(locale: Locale = "vi") {
  return getLocaleNamespace(locale, "metadata");
}
