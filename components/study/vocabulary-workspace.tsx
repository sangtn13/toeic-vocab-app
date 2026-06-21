"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { usePreferences } from "@/app/preferences-provider";
import { getResolvedUnit } from "@/components/study/workspace/shared";
import { useWorkspaceSession } from "@/components/study/workspace/use-workspace-session";
import { WorkspacePracticeContent } from "@/components/study/workspace/workspace-practice-content";
import { WorkspaceShell } from "@/components/study/workspace/workspace-shell";
import { useI18n } from "@/hooks/use-i18n";
import { studyKeys } from "@/hooks/study-cache";
import { useRestartUnit, useSubmitAnswer } from "@/hooks/use-study-mutations";
import {
  useStudyActivity,
  useStudySetDetail,
  useStudySetUnits
} from "@/hooks/use-study-queries";
import { useStudyProgress } from "@/hooks/use-study-progress";
import { toast } from "sonner";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { buildHomeRoute, buildPracticeRoute, buildStudySetRoute, stripLocalePrefix } from "@/config/routes";
import { publicStudyService } from "@/services/public-study.service";
import type { EntityId, ProgressSummary } from "@/types/common";
import type {
  AnswerResult,
  PracticeMode,
  StudyItem,
  StudyUnitProgress,
  UnitCompletion
} from "@/types/study";
import { getModeLabel } from "@/utils/practice";
import { getUnitStatus } from "@/utils/study-progress";
import { getUserFacingErrorMessage } from "@/utils/error";
import { getRoleLabel } from "@/utils/user-copy";

const practiceModes: PracticeMode[] = ["GUESS_WORD", "FLASHCARD", "MULTIPLE_CHOICE", "REVERSE_MULTIPLE_CHOICE"];
const emptyStudyItems: StudyItem[] = [];
const emptyStudyUnits: StudyUnitProgress[] = [];
const emptyProgressSummary: ProgressSummary = {
  totalWords: 0,
  learnedWords: 0,
  masteredWords: 0,
  percentage: 0
};

const WorkspaceDialogs = dynamic(
  () =>
    import("@/components/study/workspace/workspace-dialogs").then(
      (module) => module.WorkspaceDialogs
    )
);

function getUnitIdFromPathname(pathname: string, slug: string) {
  const normalizedPath = stripLocalePrefix(pathname);
  const unitPrefix = `/study-sets/${slug}/units/`;

  if (!normalizedPath.startsWith(unitPrefix)) {
    return undefined;
  }

  const unitId = normalizedPath.slice(unitPrefix.length).split("/")[0];
  return unitId ? decodeURIComponent(unitId) : undefined;
}

function getUnitProgressSummary(unit?: StudyUnitProgress): ProgressSummary | undefined {
  if (!unit) {
    return undefined;
  }

  return {
    totalWords: unit.totalWords,
    learnedWords: unit.learnedWords,
    masteredWords: unit.masteredWords,
    percentage: unit.percentage
  };
}

function mergeStudyUnits(
  baseUnits: StudyUnitProgress[],
  progressUnits: StudyUnitProgress[]
) {
  if (!baseUnits.length) {
    return progressUnits;
  }

  if (!progressUnits.length) {
    return baseUnits;
  }

  const progressUnitsById = new Map(progressUnits.map((unit) => [unit.id, unit]));
  const mergedUnits = baseUnits.map((unit) => {
    const incomingUnit = progressUnitsById.get(unit.id);

    if (!incomingUnit) {
      return unit;
    }

    return mergeStudyUnitProgress(unit, incomingUnit);
  });
  const missingProgressUnits = progressUnits.filter(
    (unit) => !baseUnits.some((baseUnit) => baseUnit.id === unit.id)
  );

  return missingProgressUnits.length ? [...mergedUnits, ...missingProgressUnits] : mergedUnits;
}

function getUnitStatusRank(status: StudyUnitProgress["status"]) {
  switch (status) {
    case "COMPLETED":
      return 2;
    case "IN_PROGRESS":
      return 1;
    default:
      return 0;
  }
}

function shouldKeepBaseUnitProgress(
  baseUnit: StudyUnitProgress,
  incomingUnit: StudyUnitProgress
) {
  if (baseUnit.learnedWords !== incomingUnit.learnedWords) {
    return baseUnit.learnedWords > incomingUnit.learnedWords;
  }

  if (baseUnit.masteredWords !== incomingUnit.masteredWords) {
    return baseUnit.masteredWords > incomingUnit.masteredWords;
  }

  if (baseUnit.percentage !== incomingUnit.percentage) {
    return baseUnit.percentage > incomingUnit.percentage;
  }

  return getUnitStatusRank(baseUnit.status) > getUnitStatusRank(incomingUnit.status);
}

function mergeStudyUnitProgress(
  baseUnit: StudyUnitProgress,
  incomingUnit: StudyUnitProgress
) {
  if (!shouldKeepBaseUnitProgress(baseUnit, incomingUnit)) {
    return incomingUnit;
  }

  return {
    ...incomingUnit,
    learnedWords: baseUnit.learnedWords,
    masteredWords: baseUnit.masteredWords,
    percentage: baseUnit.percentage,
    status: baseUnit.status
  };
}

function areStudyUnitsEqual(
  previousUnits: StudyUnitProgress[],
  nextUnits: StudyUnitProgress[]
) {
  if (previousUnits.length !== nextUnits.length) {
    return false;
  }

  for (let index = 0; index < previousUnits.length; index += 1) {
    const previousUnit = previousUnits[index];
    const nextUnit = nextUnits[index];

    if (
      previousUnit.id !== nextUnit.id ||
      previousUnit.title !== nextUnit.title ||
      previousUnit.unitOrder !== nextUnit.unitOrder ||
      previousUnit.totalWords !== nextUnit.totalWords ||
      previousUnit.learnedWords !== nextUnit.learnedWords ||
      previousUnit.masteredWords !== nextUnit.masteredWords ||
      previousUnit.percentage !== nextUnit.percentage ||
      previousUnit.status !== nextUnit.status
    ) {
      return false;
    }
  }

  return true;
}
function getSidebarUnitStatus(progress: ProgressSummary): StudyUnitProgress["status"] {
  return getUnitStatus(progress);
}

function patchSidebarUnitProgress(
  units: StudyUnitProgress[],
  unitId: EntityId,
  progress: ProgressSummary,
  options?: {
    force?: boolean;
  }
) {
  return units.map((unit) => {
    if (unit.id !== unitId) {
      return unit;
    }

    const nextUnitProgress = {
      ...unit,
      totalWords: progress.totalWords || unit.totalWords,
      learnedWords: progress.learnedWords,
      masteredWords: progress.masteredWords,
      percentage: progress.percentage,
      status: getSidebarUnitStatus(progress)
    };

    if (options?.force) {
      return nextUnitProgress;
    }

    return mergeStudyUnitProgress(unit, nextUnitProgress);
  });
}

export function VocabularyWorkspace({
  slug,
  unitId
}: {
  slug: string;
  unitId?: EntityId;
}) {
  const { locale } = usePreferences();
  const copy = useI18n("study").workspace;
  const partOfSpeechLabels = useI18n("common").labels.partOfSpeech;
  const initialUnitId = typeof unitId === "string" ? unitId : undefined;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isAuthenticated, user } = useAuth();
  const logoutMutation = useLogout();
  const submitAnswer = useSubmitAnswer();
  const { progress, bootstrapError, bootstrapStatus, refreshProgress } = useStudyProgress();
  const [mode, setMode] = useState<PracticeMode>("GUESS_WORD");
  const [pendingMode, setPendingMode] = useState<PracticeMode | null>(null);
  const [restartConfirmOpen, setRestartConfirmOpen] = useState(false);
  const [advancePending, setAdvancePending] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<EntityId | undefined>(initialUnitId);
  const [anchoredUnitId, setAnchoredUnitId] = useState<EntityId | undefined>(initialUnitId);
  const [completionData, setCompletionData] = useState<UnitCompletion | null>(null);

  const progressReady = bootstrapStatus === "ready" && !!progress?.progressToken;
  const canLoadStudyDetail = !progress?.progressToken || progressReady;

  const studySetDetail = useStudySetDetail(slug, progress?.progressToken, canLoadStudyDetail);
  const studySetUnits = useStudySetUnits(slug, progress?.progressToken, canLoadStudyDetail);
  const displayStudySetDetail = studySetDetail.data;
  const fetchedUnits = studySetUnits.data?.pages.flatMap((page) => page.items) ?? emptyStudyUnits;
  const fetchedUnitCount = studySetUnits.data?.pages[0]?.totalElements;
  const [sidebarUnits, setSidebarUnits] = useState<StudyUnitProgress[]>(emptyStudyUnits);
  const totalUnitCount = fetchedUnitCount ?? sidebarUnits.length;
  const hasMoreUnitPages = studySetUnits.hasNextPage;
  const isInitialUnitsLoading = studySetUnits.isLoading;
  const isFetchingNextUnitPage = studySetUnits.isFetchingNextPage;
  const fetchNextUnitPage = studySetUnits.fetchNextPage;
  const isUnitOpen = typeof selectedUnitId === "string";
  const selectedUnit = selectedUnitId
    ? sidebarUnits.find((unit) => unit.id === selectedUnitId)
    : undefined;
  const resolvedUnit =
    selectedUnit ??
    getResolvedUnit(
      selectedUnitId ? undefined : sidebarUnits,
      selectedUnitId ? undefined : anchoredUnitId
    );
  const resolvedUnitId = resolvedUnit?.id;
  const requestedUnitId = selectedUnitId ?? resolvedUnitId;
  const isUnitMetadataLoading =
    !!requestedUnitId &&
    !resolvedUnit &&
    (studySetUnits.isFetching || !!hasMoreUnitPages);
  const resolvedUnitHasVocabulary = (resolvedUnit?.totalWords ?? 0) > 0;
  const shouldUseActivityState = !!requestedUnitId && resolvedUnitHasVocabulary;

  const studyActivity = useStudyActivity({
    slug,
    unitId: requestedUnitId ?? "",
    mode,
    progressToken: progress?.progressToken,
    enabled: progressReady && shouldUseActivityState
  });

  useEffect(() => {
    setSelectedUnitId(initialUnitId);
    setAnchoredUnitId(initialUnitId);
  }, [initialUnitId]);

  useEffect(() => {
    const handlePopState = () => {
      const nextUnitId = getUnitIdFromPathname(window.location.pathname, slug);
      setSelectedUnitId(nextUnitId);
      setAnchoredUnitId(nextUnitId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [slug]);

  useEffect(() => {
    setSidebarUnits((current) => {
      if (!fetchedUnits.length) {
        return current;
      }

      const nextUnits = mergeStudyUnits(current, fetchedUnits);
      return areStudyUnitsEqual(current, nextUnits) ? current : nextUnits;
    });
  }, [fetchedUnits]);

  useEffect(() => {
    if (
      !selectedUnitId ||
      sidebarUnits.some((unit) => unit.id === selectedUnitId)
    ) {
      return;
    }

    if (hasMoreUnitPages && !isFetchingNextUnitPage) {
      void fetchNextUnitPage();
    }
  }, [
    selectedUnitId,
    sidebarUnits,
    hasMoreUnitPages,
    isFetchingNextUnitPage,
    fetchNextUnitPage
  ]);

  const {
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
    resolveNextItemPosition,
    resetCurrentFeedback,
    playPronunciation,
    goToNextCard,
    goToPreviousCard
  } = useWorkspaceSession({
    mode,
    resolvedUnitId: requestedUnitId,
    items: shouldUseActivityState ? studyActivity.data?.items ?? emptyStudyItems : emptyStudyItems,
    studyActivityData: shouldUseActivityState ? studyActivity.data : undefined,
    studyActivityLoading: shouldUseActivityState && studyActivity.isFetching,
    noAudioMessage: copy.noAudio,
    audioFailedMessage: copy.audioFailed
  });
  const restartUnit = useRestartUnit();
  const activeUnitId = completionUnitId ?? requestedUnitId;

  const items = shouldUseActivityState
    ? activitySnapshot?.items ?? studyActivity.data?.items ?? emptyStudyItems
    : emptyStudyItems;
  const currentItem = items[currentIndex];
  const unitProgress =
    (shouldUseActivityState
      ? activitySnapshot?.unitProgress ?? studyActivity.data?.unitProgress
      : undefined) ??
    getUnitProgressSummary(resolvedUnit) ??
    emptyProgressSummary;
  const studySetTitle =
    (shouldUseActivityState
      ? activitySnapshot?.studySetTitle || studyActivity.data?.studySetTitle
      : undefined) || displayStudySetDetail?.title;
  const unitTitle =
    (shouldUseActivityState
      ? activitySnapshot?.unitTitle || studyActivity.data?.unitTitle
      : undefined) || resolvedUnit?.title;
  const showModeLoading = pendingMode !== null && shouldUseActivityState;
  const shouldRenderDialogs = authOpen || completionOpen || restartConfirmOpen;

  const getEmbeddedActivity = (result: AnswerResult) =>
    result.studyActivity ?? null;
  const getEmbeddedCompletion = (result: AnswerResult) =>
    result.unitCompletion ?? null;

  const fetchLatestActivity = async (
    nextProgressToken: string,
    nextMode: PracticeMode = mode,
    nextUnitId: EntityId = resolvedUnitId ?? ""
  ) => {
    return queryClient.fetchQuery({
      queryKey: studyKeys.studyActivity({
        slug,
        unitId: nextUnitId,
        mode: nextMode,
        progressToken: nextProgressToken
      }),
      queryFn: () =>
        publicStudyService.getStudyActivity({
          slug,
          unitId: nextUnitId,
          mode: nextMode,
          progressToken: nextProgressToken
        }),
      staleTime: 30_000
    });
  };

  useEffect(() => {
    if (!pendingMode || studyActivity.isFetching) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPendingMode(null);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [pendingMode, studyActivity.isFetching]);

  const handleSelectUnit = useCallback((nextUnitId: EntityId) => {
    setSelectedUnitId((currentUnitId) => {
      if (currentUnitId === nextUnitId) {
        return currentUnitId;
      }

      setAnchoredUnitId(nextUnitId);
      window.history.pushState(null, "", buildPracticeRoute(locale, slug, nextUnitId));
      return nextUnitId;
    });
  }, [locale, slug]);

  const handleBackToLessons = useCallback(() => {
    setSelectedUnitId(undefined);
    setAnchoredUnitId(undefined);
    setCompletionOpen(false);
    setCompletionUnitId(null);
    setCompletionData(null);
    setRestartConfirmOpen(false);
    window.history.pushState(null, "", buildStudySetRoute(locale, slug));
  }, [locale, slug, setCompletionOpen, setCompletionUnitId]);

  const handleSelectNextUnit = useCallback((nextUnitId: EntityId) => {
    setCompletionOpen(false);
    setCompletionUnitId(null);
    setCompletionData(null);
    setRestartConfirmOpen(false);
    handleSelectUnit(nextUnitId);
  }, [handleSelectUnit, setCompletionOpen, setCompletionUnitId]);

  const handleSubmit = async (item: StudyItem, explicitAnswer?: string) => {
    if (!progress?.progressToken) {
      toast.error(copy.continueUnavailable);
      return;
    }

    if (!resolvedUnitId) {
      toast.error(copy.unknownLesson);
      return;
    }

    const rawAnswer = explicitAnswer ?? answers[item.vocabularyId] ?? "";
    if (!rawAnswer.trim()) {
      toast.error(copy.answerRequired);
      return;
    }

    try {
      if (!selectedUnitId && resolvedUnitId) {
        setAnchoredUnitId(resolvedUnitId);
      }

      setActivitySnapshot((current) => current ?? studyActivity.data ?? null);

      const result = await submitAnswer.mutateAsync({
        progressToken: progress.progressToken,
        slug,
        unitId: resolvedUnitId,
        payload: {
          vocabularyId: item.vocabularyId,
          practiceMode: mode,
          answer: rawAnswer
        }
      });

      if (!result.correct) {
        setAdvancePending(false);
        setActivitySnapshot((current) => current ?? studyActivity.data ?? null);
        toast.error(copy.answerWrong);
        setAnswerFeedback({
          vocabularyId: item.vocabularyId,
          submittedAnswer: rawAnswer,
          correctAnswer: result.correctAnswer,
          correct: false
        });
      } else {
        setAnswerFeedback(null);
      }

      if (result.correct && result.unitCompleted) {
        setAdvancePending(false);
        if (resolvedUnitId) {
          setCompletionUnitId(resolvedUnitId);
        }

        const embeddedCompletion = getEmbeddedCompletion(result);

        if (resolvedUnitId && embeddedCompletion) {
          setCompletionData(embeddedCompletion);
          setSidebarUnits((current) =>
            patchSidebarUnitProgress(current, resolvedUnitId, embeddedCompletion.unitProgress)
          );

        }

        toast.success(copy.unitCompleted);
        setCompletionOpen(true);
      } else if (result.correct && resolvedUnitId) {
        setAdvancePending(true);
        const nextActivity =
          getEmbeddedActivity(result) ??
          (await fetchLatestActivity(result.progress.progressToken));
        const nextItems = nextActivity?.items ?? [];
        const nextPosition = resolveNextItemPosition(
          nextItems,
          item.vocabularyId,
          currentIndex
        );

        setSidebarUnits((current) =>
          patchSidebarUnitProgress(current, resolvedUnitId, result.unitProgress)
        );
        setActivitySnapshot(nextActivity ?? null);
        setCurrentIndex(nextPosition.index);
        setSelectedChoiceFeedback(null);
        setShowHint(false);
        setAdvancePending(false);

        if (nextItems.length && nextPosition.kind === "forward") {
          toast.success(copy.nextCard);
        } else if (nextItems.length && nextPosition.kind === "review") {
          toast.success(copy.nextReview);
        } else {
          toast.success(copy.lessonUpdated);
        }
      } else if (result.correct) {
        setAdvancePending(false);
        toast.success(copy.lessonUpdated);
      }

      setAnswers((current) => ({
        ...current,
        [item.vocabularyId]: result.correct ? "" : rawAnswer
      }));
    } catch (error) {
      setAdvancePending(false);
      toast.error(getUserFacingErrorMessage(error, copy.submitFailed, locale));
    }
  };

  const handleRestart = async () => {
    if (!progress?.progressToken || !activeUnitId) {
      toast.error(copy.restartUnavailable);
      return;
    }

    try {
      setRestartConfirmOpen(false);
      const result = await restartUnit.mutateAsync({
        progressToken: progress.progressToken,
        slug,
        unitId: activeUnitId,
        mode
      });
      const refreshedActivity = await fetchLatestActivity(result.progress.progressToken, mode, activeUnitId);

      setSidebarUnits((current) =>
        patchSidebarUnitProgress(current, activeUnitId, result.unitProgress, { force: true })
      );
      setActivitySnapshot(refreshedActivity ?? null);
      toast.success(copy.restarted);
      setCompletionOpen(false);
      setCompletionUnitId(null);
      setCompletionData(null);
      setCurrentIndex(0);
      setAnswerFeedback(null);
      setSelectedChoiceFeedback(null);
      setFlashcardFlipped(false);
      setShowHint(false);
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error, copy.restartFailed, locale));
    }
  };

  const handleModeChange = (value: string) => {
    if (!resolvedUnitHasVocabulary) {
      return;
    }

    const nextMode = value as PracticeMode;
    if (nextMode !== mode) {
      setPendingMode(nextMode);
      setMode(nextMode);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success(copy.loggedOut);
      router.replace(buildHomeRoute(locale));
    } catch (error) { toast.error(getUserFacingErrorMessage(error, copy.logoutFailed, locale)); }
  };
  const handleChoiceSelection = (value: string) =>
    currentItem && (setSelectedChoiceFeedback({ vocabularyId: currentItem.vocabularyId, value }), void handleSubmit(currentItem, value));
  const handleRequestRestart = () => setRestartConfirmOpen(true);

  return (
    <>
      <WorkspaceShell
        collapsed={sidebarCollapsed}
        sidebarOpen={sidebarOpen}
        copy={copy}
        canAccessAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
        isLoggingOut={logoutMutation.isPending}
        progressReady={progressReady}
        studySetTitle={studySetTitle || studySetDetail.data?.title || copy.currentStudySet}
        unitTitle={unitTitle || copy.loadingLesson}
        activeModeLabel={getModeLabel(mode, locale)}
        userLabel={user?.fullName ?? copy.guestVisitor}
        userRoleLabel={getRoleLabel(user?.role, locale)}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={handleLogout}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        onSidebarOpenChange={setSidebarOpen}
        onOpenSidebar={() => setSidebarOpen(true)}
      >
        <WorkspacePracticeContent
          locale={locale}
          isUnitOpen={isUnitOpen}
          copy={copy}
          partOfSpeechLabels={partOfSpeechLabels}
          bootstrapStatus={bootstrapStatus}
          bootstrapError={bootstrapError}
          refreshProgress={refreshProgress}
          studySetDetail={{
            ...studySetDetail,
            data: displayStudySetDetail
          }}
          studySetTitle={studySetTitle}
          unitTitle={unitTitle}
          units={sidebarUnits}
          unitCount={totalUnitCount}
          resolvedUnitId={requestedUnitId}
          isUnitsLoading={isInitialUnitsLoading}
          isUnitMetadataLoading={isUnitMetadataLoading}
          hasMoreUnits={!!hasMoreUnitPages}
          isFetchingMoreUnits={isFetchingNextUnitPage}
          onLoadMoreUnits={() => void fetchNextUnitPage()}
          onSelectUnit={handleSelectUnit}
          onBackToLessons={handleBackToLessons}
          unitHasVocabulary={resolvedUnitHasVocabulary}
          mode={mode}
          onModeChange={handleModeChange}
          practiceModes={practiceModes}
          studyActivityLoading={shouldUseActivityState && studyActivity.isLoading}
          unitProgress={unitProgress}
          items={items}
          currentIndex={currentIndex}
          currentItem={currentItem}
          showModeLoading={showModeLoading}
          answers={answers}
          answerFeedback={answerFeedback}
          selectedChoiceFeedback={selectedChoiceFeedback}
          flashcardFlipped={flashcardFlipped}
          showHint={showHint}
          advancePending={advancePending}
          submitPending={submitAnswer.isPending}
          restartPending={restartUnit.isPending}
          onRestart={handleRequestRestart}
          onAnswerChange={(value) =>
            setAnswers((current) => ({
              ...current,
              [currentItem?.vocabularyId ?? ""]: value
            }))
          }
          onSubmit={() => currentItem && void handleSubmit(currentItem)}
          onToggleHint={() => setShowHint((current) => !current)}
          onRetry={resetCurrentFeedback}
          onNextItem={currentIndex < items.length - 1 ? moveToNextItem : undefined}
          onFlipFlashcard={() => setFlashcardFlipped((current) => !current)}
          onPlayUs={() => currentItem && playPronunciation(currentItem.pronunciationUsUrl)}
          onPlayUk={() => currentItem && playPronunciation(currentItem.pronunciationUkUrl)}
          onPreviousCard={goToPreviousCard}
          onNextCard={goToNextCard}
          onSelectChoice={handleChoiceSelection}
          onSelectReverseChoice={handleChoiceSelection}
        />
      </WorkspaceShell>

      {shouldRenderDialogs ? (
        <WorkspaceDialogs
          copy={copy}
          completionOpen={completionOpen}
          completionData={completionData ?? undefined}
          authOpen={authOpen}
          restartConfirmOpen={restartConfirmOpen}
          restartPending={restartUnit.isPending}
          onCompletionOpenChange={(open) => {
            setCompletionOpen(open);
            if (!open) {
              setCompletionUnitId(null);
              setCompletionData(null);
            }
          }}
          onAuthOpenChange={setAuthOpen}
          onRequestRestart={handleRequestRestart}
          onRestartConfirmOpenChange={setRestartConfirmOpen}
          onRestart={handleRestart}
          onSelectNextUnit={handleSelectNextUnit}
        />
      ) : null}
    </>
  );
}






















