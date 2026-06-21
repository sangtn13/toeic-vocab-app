"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AnswerFeedback } from "@/components/study/workspace/types";
import type { EntityId } from "@/types/common";
import type { PracticeMode, StudyActivity, StudyItem } from "@/types/study";
import { getResumeItemIndex, getStudySessionKey } from "@/utils/study-session";

type SelectedChoiceFeedback = {
  vocabularyId: EntityId;
  value: string;
};

export function useWorkspaceSession({
  mode,
  resolvedUnitId,
  items,
  studyActivityData,
  studyActivityLoading,
  noAudioMessage,
  audioFailedMessage
}: {
  mode: PracticeMode;
  resolvedUnitId?: EntityId;
  items: StudyItem[];
  studyActivityData?: StudyActivity;
  studyActivityLoading: boolean;
  noAudioMessage: string;
  audioFailedMessage: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionUnitId, setCompletionUnitId] = useState<EntityId | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [selectedChoiceFeedback, setSelectedChoiceFeedback] =
    useState<SelectedChoiceFeedback | null>(null);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activitySnapshot, setActivitySnapshot] = useState<StudyActivity | null>(null);
  const resumeVocabularyIdsRef = useRef<Record<string, EntityId>>({});
  const shouldResumeFromActivityRef = useRef(false);

  useEffect(() => {
    if (!studyActivityLoading && !studyActivityData) {
      setActivitySnapshot(null);
    }
  }, [studyActivityData, studyActivityLoading]);

  useEffect(() => {
    if (!resolvedUnitId) {
      return;
    }

    setAnswers({});
    setActivitySnapshot(null);
    setAnswerFeedback(null);
    setSelectedChoiceFeedback(null);
    setFlashcardFlipped(false);
    setShowHint(false);
    shouldResumeFromActivityRef.current = true;
  }, [resolvedUnitId]);

  useEffect(() => {
    if (!resolvedUnitId) {
      return;
    }

    setAnswers({});
    setActivitySnapshot(null);
    setAnswerFeedback(null);
    setSelectedChoiceFeedback(null);
    setFlashcardFlipped(false);
    setShowHint(false);
  }, [mode, resolvedUnitId]);

  useEffect(() => {
    if (!items.length) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex > items.length - 1) {
      setCurrentIndex(items.length - 1);
    }
  }, [currentIndex, items]);

  useEffect(() => {
    if (!resolvedUnitId || !studyActivityData || !shouldResumeFromActivityRef.current) {
      return;
    }

    const sessionKey = getStudySessionKey(resolvedUnitId, mode);
    const preferredVocabularyId = resumeVocabularyIdsRef.current[sessionKey];

    setCurrentIndex(
      getResumeItemIndex(studyActivityData.items, preferredVocabularyId)
    );
    shouldResumeFromActivityRef.current = false;
  }, [mode, resolvedUnitId, studyActivityData]);

  useEffect(() => {
    if (!resolvedUnitId) {
      return;
    }

    const currentItem = items[currentIndex];

    if (!currentItem) {
      return;
    }

    resumeVocabularyIdsRef.current[getStudySessionKey(resolvedUnitId, mode)] =
      currentItem.vocabularyId;
  }, [currentIndex, items, mode, resolvedUnitId]);

  const moveToNextItem = () => {
    setAnswerFeedback(null);
    setSelectedChoiceFeedback(null);
    setShowHint(false);
    setCurrentIndex((index) => Math.min(index + 1, Math.max(items.length - 1, 0)));
  };

  const findNextReviewIndex = (nextItems: StudyItem[], currentVocabularyId: EntityId) => {
    if (!nextItems.length) {
      return 0;
    }

    const nextUnmasteredIndex = nextItems.findIndex((candidate) => !candidate.mastered);
    if (nextUnmasteredIndex >= 0) {
      return nextUnmasteredIndex;
    }

    const sameItemIndex = nextItems.findIndex(
      (candidate) => candidate.vocabularyId === currentVocabularyId
    );

    return sameItemIndex >= 0 ? sameItemIndex : 0;
  };

  const resolveNextItemPosition = (
    nextItems: StudyItem[],
    currentVocabularyId: EntityId,
    previousIndex: number
  ) => {
    if (!nextItems.length) {
      return {
        index: 0,
        kind: "empty" as const
      };
    }

    const currentItemIndex = nextItems.findIndex(
      (candidate) => candidate.vocabularyId === currentVocabularyId
    );
    const forwardSearchStart =
      currentItemIndex >= 0
        ? currentItemIndex + 1
        : Math.min(previousIndex, Math.max(nextItems.length - 1, 0));

    for (let index = forwardSearchStart; index < nextItems.length; index += 1) {
      if (!nextItems[index]?.mastered) {
        return {
          index,
          kind: "forward" as const
        };
      }
    }

    const reviewIndex = findNextReviewIndex(nextItems, currentVocabularyId);
    const reviewItem = nextItems[reviewIndex];

    if (reviewItem && !reviewItem.mastered) {
      return {
        index: reviewIndex,
        kind: "review" as const
      };
    }

    return {
      index: reviewIndex,
      kind: "fallback" as const
    };
  };

  const resetCurrentFeedback = () => {
    setAnswerFeedback(null);
    setSelectedChoiceFeedback(null);
    setShowHint(false);
  };

  const playPronunciation = (url?: string | null) => {
    if (!url) {
      toast.message(noAudioMessage);
      return;
    }

    const audio = new Audio(url);
    audio.play().catch(() => {
      toast.error(audioFailedMessage);
    });
  };

  const goToNextCard = () => {
    setFlashcardFlipped(false);
    setSelectedChoiceFeedback(null);
    setShowHint(false);
    setCurrentIndex((index) => Math.min(index + 1, Math.max(items.length - 1, 0)));
  };

  const goToPreviousCard = () => {
    setFlashcardFlipped(false);
    setSelectedChoiceFeedback(null);
    setShowHint(false);
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  return {
    answers,
    setAnswers,
    currentIndex,
    setCurrentIndex,
    completionOpen,
    setCompletionOpen,
    completionUnitId,
    setCompletionUnitId,
    authOpen,
    setAuthOpen,
    answerFeedback,
    setAnswerFeedback,
    selectedChoiceFeedback,
    setSelectedChoiceFeedback,
    flashcardFlipped,
    setFlashcardFlipped,
    showHint,
    setShowHint,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    activitySnapshot,
    setActivitySnapshot,
    moveToNextItem,
    findNextReviewIndex,
    resolveNextItemPosition,
    resetCurrentFeedback,
    playPronunciation,
    goToNextCard,
    goToPreviousCard
  };
}
