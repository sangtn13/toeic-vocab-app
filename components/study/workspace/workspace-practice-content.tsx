"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenText,
  CheckCircle2,
  CircleAlert,
  CircleHelp,
  Loader2,
  RefreshCcw,
  Search
} from "lucide-react";
import { ApiWarning } from "@/components/shared/api-warning";
import { UnitCard, WorkspaceSkeleton } from "@/components/study/workspace/shared";
import { WorkspaceActivityCard } from "@/components/study/workspace/workspace-activity-card";
import type { AnswerFeedback, PartOfSpeechLabels, WorkspaceCopy } from "@/components/study/workspace/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildHomeRoute } from "@/config/routes";
import { DESKTOP_MEDIA_QUERY } from "@/lib/responsive";
import { formatMessage } from "@/locales/format";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/preferences";
import type { EntityId } from "@/types/common";
import type { PracticeMode, StudyActivity, StudyItem, StudySetDetail, StudyUnitProgress } from "@/types/study";
import { getModeLabel } from "@/utils/practice";

const modeIcons = {
  GUESS_WORD: CircleHelp,
  FLASHCARD: BookOpenText,
  MULTIPLE_CHOICE: CheckCircle2,
  REVERSE_MULTIPLE_CHOICE: Search
} as const;
const DESKTOP_LOAD_MORE_MIN_OFFSET = 96;

function getDesktopLoadMoreThreshold(container: HTMLDivElement) {
  return Math.max(
    DESKTOP_LOAD_MORE_MIN_OFFSET,
    Math.round(container.clientHeight * 0.15)
  );
}

function useDesktopLessonLayout() {
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateLayout = () => setIsDesktopLayout(mediaQuery.matches);

    updateLayout();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateLayout);
      return () => mediaQuery.removeEventListener("change", updateLayout);
    }

    mediaQuery.addListener(updateLayout);
    return () => mediaQuery.removeListener(updateLayout);
  }, []);

  return isDesktopLayout;
}

const LessonTopicsPanel = memo(function LessonTopicsPanel({
  copy,
  units,
  resolvedUnitId,
  unitCount,
  isUnitsLoading,
  hasMoreUnits,
  isFetchingMoreUnits,
  onLoadMoreUnits,
  onSelectUnit,
  isUnitOpen,
  isDesktopLayout
}: {
  copy: WorkspaceCopy;
  units: StudyUnitProgress[];
  resolvedUnitId?: EntityId;
  unitCount: number;
  isUnitsLoading: boolean;
  hasMoreUnits?: boolean;
  isFetchingMoreUnits?: boolean;
  onLoadMoreUnits?: () => void;
  onSelectUnit: (unitId: EntityId) => void;
  isUnitOpen: boolean;
  isDesktopLayout: boolean;
}) {
  const unitListRef = useRef<HTMLDivElement | null>(null);
  const loadMoreLockRef = useRef(false);
  const previousResolvedUnitIdRef = useRef<EntityId | undefined>(undefined);
  const previousRenderedUnitIdsRef = useRef<EntityId[]>([]);
  const visibleUnitCount = unitCount > 0 ? Math.min(units.length, unitCount) : units.length;
  const showLoadingState = isUnitsLoading || !!isFetchingMoreUnits;

  useEffect(() => {
    const container = unitListRef.current;

    if (!container || !hasMoreUnits || !onLoadMoreUnits || isFetchingMoreUnits || !isDesktopLayout) {
      return;
    }

    const maybeLoadMore = () => {
      const loadMoreThreshold = getDesktopLoadMoreThreshold(container);
      const remainingScroll =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const nearBottom = container.scrollTop > 0 && remainingScroll <= loadMoreThreshold;

      if (!nearBottom) {
        loadMoreLockRef.current = false;
        return;
      }

      if (loadMoreLockRef.current) {
        return;
      }

      loadMoreLockRef.current = true;
      onLoadMoreUnits();
    };

    container.addEventListener("scroll", maybeLoadMore, { passive: true });

    return () => {
      container.removeEventListener("scroll", maybeLoadMore);
    };
  }, [hasMoreUnits, isDesktopLayout, isFetchingMoreUnits, onLoadMoreUnits]);

  useEffect(() => {
    const container = unitListRef.current;

    if (!container || isFetchingMoreUnits || !isDesktopLayout) {
      return;
    }

    const loadMoreThreshold = getDesktopLoadMoreThreshold(container);
    const remainingScroll =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (remainingScroll > loadMoreThreshold) {
      loadMoreLockRef.current = false;
    }
  }, [isDesktopLayout, isFetchingMoreUnits, units.length]);

  useEffect(() => {
    const container = unitListRef.current;
    const renderedUnitIds = units.map((unit) => unit.id);

    if (!container || !isDesktopLayout || !resolvedUnitId) {
      previousResolvedUnitIdRef.current = resolvedUnitId;
      previousRenderedUnitIdsRef.current = renderedUnitIds;
      return;
    }

    const selectedUnitButton = Array.from(
      container.querySelectorAll<HTMLElement>("[data-unit-id]")
    ).find((element) => element.dataset.unitId === resolvedUnitId);
    const selectionChanged = previousResolvedUnitIdRef.current !== resolvedUnitId;
    const selectedWasMissing = !previousRenderedUnitIdsRef.current.includes(resolvedUnitId);

    if (selectedUnitButton && (selectionChanged || selectedWasMissing)) {
      selectedUnitButton.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    }

    previousResolvedUnitIdRef.current = resolvedUnitId;
    previousRenderedUnitIdsRef.current = renderedUnitIds;
  }, [isDesktopLayout, resolvedUnitId, units]);

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[30px] border-border bg-card shadow-[0_18px_40px_rgba(148,163,184,0.18)] lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:self-stretch",
        isUnitOpen && !isDesktopLayout && "hidden"
      )}
    >
      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="text-xl font-black uppercase tracking-[0.06em] text-foreground">
          {copy.topicListTitle}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground dark:text-slate-300">
          {copy.topicListDescription}
        </CardDescription>
        {showLoadingState ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:border-sky-400/24 dark:bg-sky-500/10 dark:text-sky-200">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{copy.loadingLessonList}</span>
            {unitCount > 0 ? (
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-sky-700 dark:bg-slate-950/30 dark:text-sky-100">
                {visibleUnitCount}/{unitCount}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardHeader>
      <CardContent
        ref={unitListRef}
        className="overflow-anchor-none scrollbar-gutter-stable scrollbar-thin-quiet space-y-3 p-4 pt-0 lg:flex-1 lg:min-h-0 lg:overflow-y-auto"
      >
        {!units.length && isUnitsLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <LessonTopicCardSkeleton key={`lesson-topic-skeleton-${index}`} />
            ))
          : units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isSelected={unit.id === resolvedUnitId}
                copy={copy}
                onSelectUnit={onSelectUnit}
              />
            ))}
        {units.length && (isUnitsLoading || isFetchingMoreUnits) ? (
          <>
            <LessonTopicCardSkeleton />
            <LessonTopicCardSkeleton />
          </>
        ) : null}
        {!isDesktopLayout && !isUnitOpen && hasMoreUnits ? (
          <Button
            type="button"
            variant="outline"
            onClick={onLoadMoreUnits}
            disabled={isFetchingMoreUnits}
            className="h-11 w-full rounded-2xl border-border bg-card"
          >
            {isFetchingMoreUnits ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {copy.loadMoreLessons}
          </Button>
        ) : null}
        {isDesktopLayout && isFetchingMoreUnits ? (
          <div className="hidden items-center justify-between rounded-[22px] border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-700 transition-all duration-300 dark:border-sky-400/24 dark:bg-sky-500/10 dark:text-sky-200 lg:flex">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-medium">{copy.loadingMoreLessons}</span>
            </div>
            {unitCount > 0 ? (
              <span className="text-xs font-semibold uppercase tracking-[0.14em]">
                {visibleUnitCount}/{unitCount}
              </span>
            ) : null}
          </div>
        ) : null}

      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  if (
    prevProps.resolvedUnitId !== nextProps.resolvedUnitId ||
    prevProps.unitCount !== nextProps.unitCount ||
    prevProps.isUnitsLoading !== nextProps.isUnitsLoading ||
    prevProps.hasMoreUnits !== nextProps.hasMoreUnits ||
    prevProps.isFetchingMoreUnits !== nextProps.isFetchingMoreUnits ||
    prevProps.isUnitOpen !== nextProps.isUnitOpen ||
    prevProps.isDesktopLayout !== nextProps.isDesktopLayout ||
    prevProps.units.length !== nextProps.units.length
  ) {
    return false;
  }

  for (let index = 0; index < prevProps.units.length; index += 1) {
    const prevUnit = prevProps.units[index];
    const nextUnit = nextProps.units[index];

    if (
      prevUnit.id !== nextUnit.id ||
      prevUnit.unitOrder !== nextUnit.unitOrder ||
      prevUnit.totalWords !== nextUnit.totalWords ||
      prevUnit.learnedWords !== nextUnit.learnedWords ||
      prevUnit.masteredWords !== nextUnit.masteredWords ||
      prevUnit.percentage !== nextUnit.percentage ||
      prevUnit.status !== nextUnit.status ||
      prevUnit.title !== nextUnit.title
    ) {
      return false;
    }
  }

  return true;
});

LessonTopicsPanel.displayName = "LessonTopicsPanel";

function LessonTopicCardSkeleton() {
  return <Skeleton className="h-[92px] rounded-[22px]" />;
}

export function WorkspacePracticeContent({
  locale,
  isUnitOpen,
  copy,
  partOfSpeechLabels,
  bootstrapStatus,
  bootstrapError,
  refreshProgress,
  studySetDetail,
  studySetTitle,
  unitTitle,
  units,
  unitCount,
  resolvedUnitId,
  isUnitsLoading,
  isUnitMetadataLoading,
  unitHasVocabulary,
  hasMoreUnits,
  isFetchingMoreUnits,
  onLoadMoreUnits,
  onSelectUnit,
  onBackToLessons,
  mode,
  onModeChange,
  practiceModes,
  studyActivityLoading,
  unitProgress,
  items,
  currentIndex,
  currentItem,
  showModeLoading,
  answers,
  answerFeedback,
  selectedChoiceFeedback,
  flashcardFlipped,
  showHint,
  advancePending,
  submitPending,
  restartPending,
  onRestart,
  onAnswerChange,
  onSubmit,
  onToggleHint,
  onRetry,
  onNextItem,
  onFlipFlashcard,
  onPlayUs,
  onPlayUk,
  onPreviousCard,
  onNextCard,
  onSelectChoice,
  onSelectReverseChoice
}: {
  locale: Locale;
  isUnitOpen: boolean;
  copy: WorkspaceCopy;
  partOfSpeechLabels: PartOfSpeechLabels;
  bootstrapStatus: "idle" | "loading" | "ready" | "failed";
  bootstrapError: string | null;
  refreshProgress: () => Promise<unknown>;
  studySetDetail: { isLoading: boolean; data?: StudySetDetail };
  studySetTitle?: string;
  unitTitle?: string;
  units: StudyUnitProgress[];
  unitCount: number;
  resolvedUnitId?: EntityId;
  isUnitsLoading: boolean;
  isUnitMetadataLoading: boolean;
  unitHasVocabulary: boolean;
  hasMoreUnits?: boolean;
  isFetchingMoreUnits?: boolean;
  onLoadMoreUnits?: () => void;
  onSelectUnit: (unitId: EntityId) => void;
  onBackToLessons: () => void;
  mode: PracticeMode;
  onModeChange: (value: string) => void;
  practiceModes: PracticeMode[];
  studyActivityLoading: boolean;
  unitProgress?: StudyActivity["unitProgress"];
  items: StudyItem[];
  currentIndex: number;
  currentItem?: StudyItem;
  showModeLoading: boolean;
  answers: Record<string, string>;
  answerFeedback: AnswerFeedback | null;
  selectedChoiceFeedback: { vocabularyId: EntityId; value: string } | null;
  flashcardFlipped: boolean;
  showHint: boolean;
  advancePending: boolean;
  submitPending: boolean;
  restartPending: boolean;
  onRestart: () => void;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onToggleHint: () => void;
  onRetry: () => void;
  onNextItem?: () => void;
  onFlipFlashcard: () => void;
  onPlayUs: () => void;
  onPlayUk: () => void;
  onPreviousCard: () => void;
  onNextCard: () => void;
  onSelectChoice: (value: string) => void;
  onSelectReverseChoice: (value: string) => void;
}) {
  const isDesktopLayout = useDesktopLessonLayout();
  const lessonListScrollRef = useRef<number | null>(null);
  const previousIsUnitOpenRef = useRef(isUnitOpen);
  const detailPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wasUnitOpen = previousIsUnitOpenRef.current;

    if (!isDesktopLayout && !wasUnitOpen && isUnitOpen) {
      window.requestAnimationFrame(() => {
        detailPanelRef.current?.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      });
    }

    if (!isDesktopLayout && wasUnitOpen && !isUnitOpen && lessonListScrollRef.current !== null) {
      const restoreScrollY = lessonListScrollRef.current;
      lessonListScrollRef.current = null;

      window.requestAnimationFrame(() => {
        window.scrollTo({ top: restoreScrollY, behavior: "auto" });
      });
    }

    previousIsUnitOpenRef.current = isUnitOpen;
  }, [isDesktopLayout, isUnitOpen]);

  const handleSelectUnit = (unitId: EntityId) => {
    if (typeof window !== "undefined" && !isDesktopLayout) {
      lessonListScrollRef.current = window.scrollY;
    }

    onSelectUnit(unitId);
  };

  const isLessonContentLoading = studyActivityLoading || isUnitMetadataLoading;

  const shouldUseCompactMobileStatusState =
    !isDesktopLayout &&
    isUnitOpen &&
    !isLessonContentLoading &&
    !!resolvedUnitId &&
    (bootstrapStatus === "failed" || !unitHasVocabulary || !currentItem);
  const compactMobileStatusMessage =
    bootstrapStatus === "failed" ? copy.bootstrapIssueMessage : copy.noItemMessage;

  return (
    <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:min-h-0 lg:overflow-y-auto lg:px-8 lg:py-7">
      <div className="flex min-h-0 flex-col gap-6 lg:h-full">
        {bootstrapStatus === "failed" ? (
          <ApiWarning
            title={copy.startFailedTitle}
            message={bootstrapError || copy.startFailedBody}
            onRetry={refreshProgress}
            showRetry
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {!isDesktopLayout ? (
            isUnitOpen ? (
              <Button
                type="button"
                variant="outline"
                onClick={onBackToLessons}
                className="h-11 rounded-[18px] border-border bg-card px-4 text-foreground shadow-[0_10px_24px_rgba(148,163,184,0.08)] hover:bg-muted/60"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {copy.backToLessons}
              </Button>
            ) : (
              <Button
                variant="outline"
                asChild
                className="h-11 rounded-[18px] border-border bg-card px-4 text-foreground shadow-[0_10px_24px_rgba(148,163,184,0.08)] hover:bg-muted/60"
              >
                <Link href={buildHomeRoute(locale)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {copy.backHome}
                </Link>
              </Button>
            )
          ) : (
            <Button
              variant="outline"
              asChild
              className="h-11 rounded-[18px] border-border bg-card px-4 text-foreground shadow-[0_10px_24px_rgba(148,163,184,0.08)] hover:bg-muted/60"
            >
              <Link href={buildHomeRoute(locale)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {copy.backHome}
              </Link>
            </Button>
          )}
          <div className="flex h-11 items-center rounded-[18px] border border-border bg-card px-4 text-sm font-semibold text-muted-foreground shadow-[0_10px_24px_rgba(148,163,184,0.08)]">
            {copy.workspaceTitle}
          </div>
        </div>

        {studySetDetail.isLoading || !studySetDetail.data ? (
          <WorkspaceSkeleton />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {studySetDetail.data.title}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                {studySetDetail.data.description || copy.workspaceDescription}
              </p>
            </div>

            <div
              className={cn(
                "grid gap-6",
                isDesktopLayout
                  ? "lg:min-h-0 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start"
                  : "grid-cols-1"
              )}
            >
              <LessonTopicsPanel
                copy={copy}
                units={units}
                resolvedUnitId={resolvedUnitId}
                unitCount={unitCount}
                isUnitsLoading={isUnitsLoading}
                hasMoreUnits={hasMoreUnits}
                isFetchingMoreUnits={isFetchingMoreUnits}
                onLoadMoreUnits={onLoadMoreUnits}
                onSelectUnit={handleSelectUnit}
                isUnitOpen={isUnitOpen}
                isDesktopLayout={isDesktopLayout}
              />

              <div
                ref={detailPanelRef}
                className={cn(
                  "min-w-0 space-y-4",
                  isDesktopLayout
                    ? "lg:col-start-2 lg:row-start-1"
                    : !isUnitOpen && "hidden"
                )}
              >
                <div className="rounded-[30px] border border-border bg-card p-5 shadow-[0_16px_34px_rgba(148,163,184,0.12)]">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-400/24 dark:bg-sky-500/10 dark:text-sky-200">
                        {copy.progressTitle}
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {studySetTitle || copy.loadingStudySet}
                        </p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                          {unitTitle || copy.loadingLesson}
                        </h2>
                        {isLessonContentLoading ? (
                          <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700 dark:border-sky-400/24 dark:bg-sky-500/10 dark:text-sky-200">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>{isUnitMetadataLoading ? copy.loadingLesson : copy.loadingData}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="w-full xl:w-auto xl:max-w-[36rem]">
                      <Tabs
                        value={mode}
                        onValueChange={onModeChange}
                      >
                        <TabsList className="grid h-auto grid-cols-4 gap-2 rounded-[22px] border border-border bg-primary/10 p-2 lg:hidden">
                          {practiceModes.map((practiceMode) => {
                            const CompactIcon = modeIcons[practiceMode] ?? CircleAlert;
                            return (
                              <TabsTrigger
                                key={practiceMode}
                                value={practiceMode}
                                title={getModeLabel(practiceMode, locale)}
                                disabled={!unitHasVocabulary || bootstrapStatus === "failed"}
                                className="aspect-square min-h-11 rounded-2xl p-0 text-muted-foreground transition-colors duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                              >
                                <CompactIcon className="h-5 w-5" />
                                <span className="sr-only">{getModeLabel(practiceMode, locale)}</span>
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                        <TabsList className="hidden h-auto gap-2 rounded-[22px] border border-border bg-primary/10 p-2 lg:grid lg:grid-cols-2 xl:grid-cols-4">
                          {practiceModes.map((practiceMode) => (
                            <TabsTrigger
                              key={practiceMode}
                              value={practiceMode}
                              disabled={!unitHasVocabulary || bootstrapStatus === "failed"}
                              className="min-h-11 rounded-2xl px-4 py-2.5 text-center text-xs font-semibold leading-tight whitespace-normal text-muted-foreground transition-colors duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                            >
                              {getModeLabel(practiceMode, locale)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="space-y-3">
                      <Progress
                        value={unitProgress?.percentage ?? 0}
                        className="h-3 rounded-full bg-muted"
                      />
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>
                          {formatMessage(copy.learnedWords, {
                            learned: unitProgress?.learnedWords ?? 0,
                            total: unitProgress?.totalWords ?? 0
                          })}
                        </span>
                        <span>
                          {formatMessage(copy.masteredWords, {
                            mastered: unitProgress?.masteredWords ?? 0
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-border bg-card px-4 py-3 shadow-[0_10px_24px_rgba(148,163,184,0.08)]">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-muted/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {copy.currentCard}
                        </span>
                        <span className="text-lg font-black tracking-[0.04em] text-foreground">
                          {items.length ? `${currentIndex + 1} / ${items.length}` : "0 / 0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {shouldUseCompactMobileStatusState ? (
                  <Card className="overflow-hidden rounded-[30px] border-border bg-card shadow-[0_18px_40px_rgba(148,163,184,0.16)]">
                    <CardContent className="space-y-4 p-5">
                      <div className="rounded-[24px] border border-dashed border-border bg-muted/20 px-5 py-8 text-center text-sm leading-7 text-muted-foreground">
                        {compactMobileStatusMessage}
                      </div>
                      <div className="rounded-[22px] border border-border bg-card px-4 py-4 shadow-[0_10px_24px_rgba(148,163,184,0.08)]">
                        <p className="leading-6">
                          {formatMessage(copy.lessonSummary, {
                            unitOrder: units.find((unit) => unit.id === resolvedUnitId)?.unitOrder ?? 0,
                            unitCount,
                            totalWords: studySetDetail.data.progress.totalWords
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <WorkspaceActivityCard
                    copy={copy}
                    currentItem={currentItem}
                    mode={mode}
                    partOfSpeechLabels={partOfSpeechLabels}
                    studyActivityLoading={isLessonContentLoading}
                    answers={answers}
                    answerFeedback={answerFeedback}
                    selectedChoiceFeedback={selectedChoiceFeedback}
                    flashcardFlipped={flashcardFlipped}
                    showHint={showHint}
                    advancePending={advancePending}
                    submitPending={submitPending}
                    currentIndex={currentIndex}
                    items={items}
                    showModeLoading={showModeLoading}
                    resolvedUnitId={resolvedUnitId}
                    unitHasVocabulary={unitHasVocabulary}
                    bootstrapStatus={bootstrapStatus}
                    onAnswerChange={onAnswerChange}
                    onSubmit={onSubmit}
                    onToggleHint={onToggleHint}
                    onRetry={onRetry}
                    onNextItem={onNextItem}
                    onFlipFlashcard={onFlipFlashcard}
                    onPlayUs={onPlayUs}
                    onPlayUk={onPlayUk}
                    onPreviousCard={onPreviousCard}
                    onNextCard={onNextCard}
                    onSelectChoice={onSelectChoice}
                    onSelectReverseChoice={onSelectReverseChoice}
                  />
                )}
              </div>

              <div
                className={cn(
                  "min-w-0 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground",
                  isDesktopLayout
                    ? "px-1 pb-6 pt-2 lg:col-start-2 lg:row-start-2"
                    : !isUnitOpen
                      ? "hidden"
                      : shouldUseCompactMobileStatusState
                        ? "hidden"
                        : "rounded-[24px] border border-border bg-card/80 px-4 py-4 shadow-[0_12px_28px_rgba(148,163,184,0.1)]"
                )}
              >
                <p className={cn(!isDesktopLayout && "leading-6")}>
                  {formatMessage(copy.lessonSummary, {
                    unitOrder: units.find((unit) => unit.id === resolvedUnitId)?.unitOrder ?? 0,
                    unitCount,
                    totalWords: studySetDetail.data.progress.totalWords
                  })}
                </p>
                {resolvedUnitId && unitHasVocabulary ? (
                  <Button
                    variant="outline"
                    onClick={onRestart}
                    disabled={restartPending || bootstrapStatus === "failed"}
                    className={cn(
                      "rounded-2xl border-border bg-card",
                      !isDesktopLayout && "w-full"
                    )}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    {copy.restartLesson}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}














