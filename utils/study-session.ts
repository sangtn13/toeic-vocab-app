import type { EntityId } from "@/types/common";
import type { PracticeMode, StudyItem } from "@/types/study";

export function getStudySessionKey(unitId: EntityId, mode: PracticeMode) {
  return `${unitId}:${mode}`;
}

export function getResumeItemIndex(
  items: StudyItem[],
  preferredVocabularyId?: EntityId
) {
  if (!items.length) {
    return 0;
  }

  if (preferredVocabularyId) {
    const preferredActiveIndex = items.findIndex(
      (item) => item.vocabularyId === preferredVocabularyId && !item.mastered
    );

    if (preferredActiveIndex >= 0) {
      return preferredActiveIndex;
    }
  }

  const nextUnmasteredIndex = items.findIndex((item) => !item.mastered);

  if (nextUnmasteredIndex >= 0) {
    return nextUnmasteredIndex;
  }

  if (preferredVocabularyId) {
    const preferredIndex = items.findIndex(
      (item) => item.vocabularyId === preferredVocabularyId
    );

    if (preferredIndex >= 0) {
      return preferredIndex;
    }
  }

  return 0;
}
