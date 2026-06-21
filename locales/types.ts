import { adminMessagesVi } from "@/locales/messages/vi/admin";
import { appMessagesVi } from "@/locales/messages/vi/app";
import { authMessagesVi } from "@/locales/messages/vi/auth";
import { commonMessagesVi } from "@/locales/messages/vi/common";
import { homeMessagesVi } from "@/locales/messages/vi/home";
import { hooksMessagesVi } from "@/locales/messages/vi/hooks";
import { metadataMessagesVi } from "@/locales/messages/vi/metadata";
import { preferencesMessagesVi } from "@/locales/messages/vi/preferences";
import { studyMessagesVi } from "@/locales/messages/vi/study";

export interface AppLocaleMessages {
  metadata: typeof metadataMessagesVi;
  common: typeof commonMessagesVi;
  preferences: typeof preferencesMessagesVi;
  app: typeof appMessagesVi;
  auth: typeof authMessagesVi;
  home: typeof homeMessagesVi;
  admin: typeof adminMessagesVi;
  study: typeof studyMessagesVi;
  hooks: typeof hooksMessagesVi;
}

export type AppMessageNamespace = keyof AppLocaleMessages;
export type AppMessages = Partial<AppLocaleMessages>;
