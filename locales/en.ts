import { adminMessagesEn } from "@/locales/messages/en/admin";
import { appMessagesEn } from "@/locales/messages/en/app";
import { authMessagesEn } from "@/locales/messages/en/auth";
import { commonMessagesEn } from "@/locales/messages/en/common";
import { homeMessagesEn } from "@/locales/messages/en/home";
import { hooksMessagesEn } from "@/locales/messages/en/hooks";
import { metadataMessagesEn } from "@/locales/messages/en/metadata";
import { preferencesMessagesEn } from "@/locales/messages/en/preferences";
import { studyMessagesEn } from "@/locales/messages/en/study";
import type { AppLocaleMessages } from "@/locales/types";

export const en: AppLocaleMessages = {
  metadata: metadataMessagesEn,
  common: commonMessagesEn,
  preferences: preferencesMessagesEn,
  app: appMessagesEn,
  auth: authMessagesEn,
  home: homeMessagesEn,
  admin: adminMessagesEn,
  study: studyMessagesEn,
  hooks: hooksMessagesEn
};
