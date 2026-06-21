"use client";

import { useLocaleNamespace } from "@/app/i18n-provider";
import type { AppLocaleMessages, AppMessageNamespace } from "@/locales/types";

export function useI18n<K extends AppMessageNamespace>(namespace: K): AppLocaleMessages[K];
export function useI18n<K extends AppMessageNamespace>(namespace: K) {
  return useLocaleNamespace(namespace);
}
