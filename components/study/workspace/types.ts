import type { EntityId } from "@/types/common";
import type { AppLocaleMessages } from "@/locales";

export type AnswerFeedback = {
  vocabularyId: EntityId;
  submittedAnswer: string;
  correctAnswer: string;
  correct: boolean;
};

export type PartOfSpeechLabels = AppLocaleMessages["common"]["labels"]["partOfSpeech"];
export type WorkspaceCopy = AppLocaleMessages["study"]["workspace"];
