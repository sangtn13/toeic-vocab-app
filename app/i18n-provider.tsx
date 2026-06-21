"use client";

import {
  createContext,
  useContext,
  type ReactNode
} from "react";
import type {
  AppMessageNamespace,
  AppLocaleMessages,
  AppMessages
} from "@/locales/types";

const I18nContext = createContext<AppMessages | null>(null);

export function I18nMessagesProvider({
  children,
  messages
}: {
  children: ReactNode;
  messages: AppMessages;
}) {
  const inheritedMessages = useContext(I18nContext);

  return (
    <I18nContext.Provider value={inheritedMessages ? { ...inheritedMessages, ...messages } : messages}>
      {children}
    </I18nContext.Provider>
  );
}

function useLocaleMessages() {
  const messages = useContext(I18nContext);

  if (!messages) {
    throw new Error("useLocaleMessages must be used within I18nProvider.");
  }

  return messages;
}

export function useLocaleNamespace<K extends AppMessageNamespace>(namespace: K) {
  const namespaceMessages = useLocaleMessages()[namespace];

  if (!namespaceMessages) {
    throw new Error(`Missing locale namespace: ${namespace}.`);
  }

  return namespaceMessages as AppLocaleMessages[K];
}

export const I18nProvider = I18nMessagesProvider;
