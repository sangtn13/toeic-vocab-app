"use client";

import dynamic from "next/dynamic";
import { EmptyWorkspace } from "@/components/study/workspace/shared";
import type { AnswerFeedback, PartOfSpeechLabels, WorkspaceCopy } from "@/components/study/workspace/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { EntityId } from "@/types/common";
import type { PracticeMode, StudyItem } from "@/types/study";

const GuessWordPanel = dynamic(
  () =>
    import("@/components/study/workspace/guess-word-panel").then(
      (module) => module.GuessWordPanel
    ),
  {
    loading: () => <PanelSkeleton />
  }
);

const FlashcardPanel = dynamic(
  () =>
    import("@/components/study/workspace/flashcard-panel").then(
      (module) => module.FlashcardPanel
    ),
  {
    loading: () => <PanelSkeleton className="h-full" />
  }
);

const ChoicePanel = dynamic(
  () =>
    import("@/components/study/workspace/choice-panel").then(
      (module) => module.ChoicePanel
    ),
  {
    loading: () => <PanelSkeleton />
  }
);

export function WorkspaceActivityCard({
  copy,
  currentItem,
  mode,
  partOfSpeechLabels,
  studyActivityLoading,
  answers,
  answerFeedback,
  selectedChoiceFeedback,
  flashcardFlipped,
  showHint,
  advancePending,
  submitPending,
  currentIndex,
  items,
  showModeLoading,
  resolvedUnitId,
  unitHasVocabulary,
  bootstrapStatus,
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
  copy: WorkspaceCopy;
  currentItem?: StudyItem;
  mode: PracticeMode;
  partOfSpeechLabels: PartOfSpeechLabels;
  studyActivityLoading: boolean;
  answers: Record<string, string>;
  answerFeedback: AnswerFeedback | null;
  selectedChoiceFeedback: { vocabularyId: EntityId; value: string } | null;
  flashcardFlipped: boolean;
  showHint: boolean;
  advancePending: boolean;
  submitPending: boolean;
  currentIndex: number;
  items: StudyItem[];
  showModeLoading: boolean;
  resolvedUnitId?: EntityId;
  unitHasVocabulary: boolean;
  bootstrapStatus: "idle" | "loading" | "ready" | "failed";
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
  if (studyActivityLoading) {
    return (
      <Card className="overflow-hidden rounded-[30px] border-border bg-card shadow-[0_18px_40px_rgba(148,163,184,0.16)]">
        <CardContent className="min-h-[320px] space-y-4 p-5 sm:min-h-[420px] sm:p-6 lg:min-h-[640px] lg:p-8 xl:min-h-[760px]">
          <Skeleton className="mx-auto h-28 w-28 rounded-[28px]" />
          <Skeleton className="mx-auto h-10 w-56" />
          <Skeleton className="mx-auto h-5 w-72" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  if (!resolvedUnitId) {
    return <EmptyWorkspace message={copy.noUnitMessage} className="h-full" />;
  }

  if (bootstrapStatus === "failed") {
    return <EmptyWorkspace message={copy.bootstrapIssueMessage} className="h-full" />;
  }

  if (!unitHasVocabulary) {
    return <EmptyWorkspace message={copy.noItemMessage} className="h-full" />;
  }

  if (!currentItem) {
    return <EmptyWorkspace message={copy.noItemMessage} className="h-full" />;
  }

  return (
    <Card className="overflow-hidden rounded-[30px] border-border bg-card shadow-[0_18px_40px_rgba(148,163,184,0.16)]">
      <CardContent
        className={cn(
          "relative min-h-[320px] sm:min-h-[420px] lg:min-h-[640px] xl:min-h-[760px]",
          mode === "FLASHCARD"
            ? "flex h-[320px] flex-col p-2 sm:h-[420px] sm:p-3 lg:h-[640px] xl:h-[760px] xl:p-4"
            : "p-4 sm:p-6 xl:p-8",
          mode === "FLASHCARD" && "flex flex-col"
        )}
      >
        <div
          key={`${mode}-${currentItem.vocabularyId}-${currentIndex}`}
          className={cn(
            "workspace-card-transition transition-[opacity,transform,filter] duration-300",
            (showModeLoading || advancePending) && "scale-[0.992] opacity-60 blur-[1px]",
            mode === "FLASHCARD" && "h-full flex-1"
          )}
        >
          {mode === "GUESS_WORD" ? (
            <GuessWordPanel
              item={currentItem}
              answer={answers[currentItem.vocabularyId] || ""}
              onAnswerChange={onAnswerChange}
              onSubmit={onSubmit}
              showHint={showHint}
              onToggleHint={onToggleHint}
              feedback={answerFeedback?.vocabularyId === currentItem.vocabularyId ? answerFeedback : null}
              copy={copy}
              partOfSpeechLabels={partOfSpeechLabels}
              onRetry={onRetry}
              onNext={currentIndex < items.length - 1 ? onNextItem : undefined}
              isSubmitting={submitPending}
            />
          ) : null}

          {mode === "FLASHCARD" ? (
            <FlashcardPanel
              item={currentItem}
              flipped={flashcardFlipped}
              onFlip={onFlipFlashcard}
              onPlayUs={onPlayUs}
              onPlayUk={onPlayUk}
              currentIndex={currentIndex}
              totalItems={items.length}
              copy={copy}
              partOfSpeechLabels={partOfSpeechLabels}
              onPrev={onPreviousCard}
              onNext={onNextCard}
            />
          ) : null}

          {mode === "MULTIPLE_CHOICE" ? (
            <ChoicePanel
              item={currentItem}
              title={currentItem.meaning || copy.noMeaning}
              subtitle={currentItem.definition || copy.defaultChoiceSubtitle}
              prompt={copy.choicePrompt}
              feedback={answerFeedback?.vocabularyId === currentItem.vocabularyId ? answerFeedback : null}
              copy={copy}
              selectedValue={
                selectedChoiceFeedback?.vocabularyId === currentItem.vocabularyId
                  ? selectedChoiceFeedback.value
                  : null
              }
              onRetry={onRetry}
              onNext={currentIndex < items.length - 1 ? onNextItem : undefined}
              onSelect={onSelectChoice}
            />
          ) : null}

          {mode === "REVERSE_MULTIPLE_CHOICE" ? (
            <ChoicePanel
              item={currentItem}
              title={currentItem.word || copy.noWord}
              subtitle={[
                currentItem.phoneticUs ? `US: ${currentItem.phoneticUs}` : null,
                currentItem.phoneticUk ? `UK: ${currentItem.phoneticUk}` : null
              ]
                .filter(Boolean)
                .join("   ")}
              prompt={copy.choicePrompt}
              feedback={answerFeedback?.vocabularyId === currentItem.vocabularyId ? answerFeedback : null}
              copy={copy}
              selectedValue={
                selectedChoiceFeedback?.vocabularyId === currentItem.vocabularyId
                  ? selectedChoiceFeedback.value
                  : null
              }
              onRetry={onRetry}
              onNext={currentIndex < items.length - 1 ? onNextItem : undefined}
              onSelect={onSelectReverseChoice}
            />
          ) : null}
        </div>

        {showModeLoading || advancePending ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/36 backdrop-blur-[1px]">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-sky-500" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function PanelSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-14 w-40 rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-[28px]" />
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  );
}
