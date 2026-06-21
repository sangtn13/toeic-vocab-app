import type {
  PartOfSpeech,
  StudySetStatus,
  VocabularyLevel
} from "@/types/study";
import type { EntityId } from "@/types/common";

export type AdminStudySet = {
  id: EntityId;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  displayOrder: number;
  status: StudySetStatus;
  unitCount: number;
  vocabularyCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminStudyUnit = {
  id: EntityId;
  studySetId: EntityId;
  studySetTitle: string;
  title: string;
  description: string | null;
  unitOrder: number;
  active: boolean;
  vocabularyCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminVocabulary = {
  id: EntityId;
  studySetId: EntityId;
  studySetTitle: string;
  unitId: EntityId;
  unitTitle: string;
  word: string;
  meaning: string;
  definition: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  phoneticUs: string | null;
  phoneticUk: string | null;
  pronunciationUsUrl: string | null;
  pronunciationUkUrl: string | null;
  hint: string | null;
  partOfSpeech: PartOfSpeech;
  difficultyLevel: VocabularyLevel;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StudySetUpsertPayload = {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  displayOrder: number;
  status: StudySetStatus;
};

export type StudyUnitUpsertPayload = {
  title: string;
  description?: string;
  unitOrder: number;
  active: boolean;
};

export type VocabularyUpsertPayload = {
  word: string;
  meaning: string;
  definition?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  phoneticUs?: string;
  phoneticUk?: string;
  pronunciationUsUrl?: string;
  pronunciationUkUrl?: string;
  hint?: string;
  partOfSpeech: PartOfSpeech;
  difficultyLevel: VocabularyLevel;
  displayOrder: number;
  active: boolean;
};
