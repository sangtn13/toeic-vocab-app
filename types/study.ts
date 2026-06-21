import type { EntityId, ProgressSummary, UnitStatus } from "@/types/common";

export type PracticeMode =
  | "GUESS_WORD"
  | "FLASHCARD"
  | "MULTIPLE_CHOICE"
  | "REVERSE_MULTIPLE_CHOICE";

export type StudySetStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type StudySetLearningStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type PartOfSpeech =
  | "NOUN"
  | "VERB"
  | "PHRASAL_VERB"
  | "ADJECTIVE"
  | "ADVERB"
  | "PHRASE"
  | "OTHER";

export type VocabularyLevel = "FOUNDATION" | "CORE" | "ADVANCED";

export type StudyProgress = {
  progressToken: string;
  displayName: string;
  persistent: boolean;
};

export type StudyProgressResolution = {
  progress: StudyProgress;
  created: boolean;
};

export type StudySetCard = {
  id: EntityId;
  title: string;
  slug: string;
  description: string | null;
  learningStatus: StudySetLearningStatus;
  totalUnits: number;
  totalWords: number;
};

export type StudyUnitProgress = {
  id: EntityId;
  title: string;
  unitOrder: number;
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  percentage: number;
  status: UnitStatus;
};

export type StudySetDetail = {
  title: string;
  description: string | null;
  progress: ProgressSummary;
};

type StudyChoice = {
  value: string;
  label: string;
};

export type StudyItem = {
  vocabularyId: EntityId;
  mastered: boolean;
  word: string | null;
  meaning: string | null;
  definition: string | null;
  exampleSentence: string | null;
  exampleSentenceMasked: string | null;
  exampleTranslation: string | null;
  phoneticUs: string | null;
  phoneticUk: string | null;
  pronunciationUsUrl: string | null;
  pronunciationUkUrl: string | null;
  hint: string | null;
  partOfSpeech: PartOfSpeech;
  choices: StudyChoice[];
};

export type StudyActivity = {
  mode: PracticeMode;
  studySetTitle: string;
  unitTitle: string;
  studySetProgress: ProgressSummary;
  unitProgress: ProgressSummary;
  items: StudyItem[];
};

type StudyUnitAction = {
  unitId: EntityId;
  title: string;
  unitOrder: number;
};

type StudyWordReview = {
  vocabularyId: EntityId;
  word: string;
  meaning: string;
};

export type AnswerResult = {
  vocabularyId: EntityId;
  practiceMode: PracticeMode;
  correct: boolean;
  correctAnswer: string;
  unitCompleted: boolean;
  studySetProgress: ProgressSummary;
  unitProgress: ProgressSummary;
  progress: StudyProgress;
  studyActivity?: StudyActivity | null;
  unitCompletion?: UnitCompletion | null;
};

export type UnitCompletion = {
  unitProgress: ProgressSummary;
  studySetProgress: ProgressSummary;
  nextUnit: StudyUnitAction | null;
  vocabularies: StudyWordReview[];
};

export type RestartUnitResult = {
  unitProgress: ProgressSummary;
  studySetProgress: ProgressSummary;
  progress: StudyProgress;
};

export type SubmitAnswerPayload = {
  vocabularyId: EntityId;
  practiceMode: PracticeMode;
  answer: string;
};