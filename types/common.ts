export type EntityId = string;

export type ProgressSummary = {
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  percentage: number;
};

export type UnitStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
