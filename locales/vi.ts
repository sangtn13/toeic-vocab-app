import { adminMessagesVi } from "@/locales/messages/vi/admin";
import { appMessagesVi } from "@/locales/messages/vi/app";
import { authMessagesVi } from "@/locales/messages/vi/auth";
import { commonMessagesVi } from "@/locales/messages/vi/common";
import { homeMessagesVi } from "@/locales/messages/vi/home";
import { hooksMessagesVi } from "@/locales/messages/vi/hooks";
import { metadataMessagesVi } from "@/locales/messages/vi/metadata";
import { preferencesMessagesVi } from "@/locales/messages/vi/preferences";
import { studyMessagesVi } from "@/locales/messages/vi/study";
import type { AppLocaleMessages } from "@/locales/types";

export const vi: AppLocaleMessages = {
  metadata: metadataMessagesVi,
  common: commonMessagesVi,
  preferences: preferencesMessagesVi,
  app: appMessagesVi,
  auth: authMessagesVi,
  home: homeMessagesVi,
  admin: adminMessagesVi,
  study: studyMessagesVi,
  hooks: hooksMessagesVi
};
