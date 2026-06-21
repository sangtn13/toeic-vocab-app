import type { ProgressSummary, UnitStatus } from "@/types/common";
import type { StudySetLearningStatus } from "@/types/study";

function isProgressCompleted(progress: ProgressSummary) {
  return progress.totalWords > 0 && progress.masteredWords === progress.totalWords;
}

export function getStudySetLearningStatus(progress: ProgressSummary): StudySetLearningStatus {
  if (isProgressCompleted(progress)) {
    return "COMPLETED";
  }

  if (progress.learnedWords > 0) {
    return "IN_PROGRESS";
  }

  return "NOT_STARTED";
}

export function getUnitStatus(progress: ProgressSummary): UnitStatus {
  if (isProgressCompleted(progress)) {
    return "COMPLETED";
  }

  if (progress.learnedWords > 0) {
    return "IN_PROGRESS";
  }

  return "AVAILABLE";
}
